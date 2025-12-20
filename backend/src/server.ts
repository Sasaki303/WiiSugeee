import HID from 'node-hid';
import { WebSocketServer, WebSocket } from 'ws';
import koffi from 'koffi';

// Windows API for mouse control
const user32 = koffi.load('user32.dll');
const SetCursorPos = user32.func('SetCursorPos', 'bool', ['int', 'int']);
const GetSystemMetrics = user32.func('GetSystemMetrics', 'int', ['int']);

// Screen dimensions
const SM_CXSCREEN = 0;
const SM_CYSCREEN = 1;
let screenWidth = GetSystemMetrics(SM_CXSCREEN);
let screenHeight = GetSystemMetrics(SM_CYSCREEN);
console.log(`Screen size: ${screenWidth}x${screenHeight}`);

// ========================================
// IR初期化用ヘルパー関数
// ========================================

function sleep(ms: number): Promise<void> {
    return new Promise((res) => setTimeout(res, ms));
}

async function setReportMode37(device: HID.HID): Promise<void> {
    // 0x12: Set Data Reporting Mode
    // 2nd byte: bit2(0x04)=continuous reporting
    // 3rd byte: 0x37 (Core + Accel + IR(10bytes) + Extension(6bytes))
    device.write([0x12, 0x04, 0x37]);
    await sleep(50);
}

/**
 * Output Report 0x16: Write Memory and Registers
 * (a2) 16 MM AA AA AA SS DD... (DD padded to 16 bytes)
 * MM: bit2(0x04)=register space, bit0=rumble
 */
function writeReg(device: HID.HID, addr: number, data: number[]): void {
    const buf = Buffer.alloc(22, 0x00); // 1(reportId) + 21(payload)
    buf[0] = 0x16;

    // MM: register space(0x04), rumble off
    buf[1] = 0x04;

    // 24-bit address big-endian (e.g., 0xB00030)
    buf[2] = (addr >> 16) & 0xff;
    buf[3] = (addr >> 8) & 0xff;
    buf[4] = addr & 0xff;

    // size (max 16)
    const size = Math.min(16, data.length);
    buf[5] = size;

    // data (padded to 16)
    for (let i = 0; i < size; i++) buf[6 + i] = data[i] & 0xff;

    device.write([...buf]);
}

/**
 * IR カメラ初期化（Wii方式に寄せた安定版）
 * - 0x13/0x1a: 0x06 を使うパターン
 * - 0xB00030 に 0x01 → 感度 → mode → 0x08
 * - 各ステップ 50ms delay
 */
async function initIR(device: HID.HID): Promise<void> {
    console.log("  [IR] Enabling IR camera...");

    // IR enable (Wii方式)
    device.write([0x13, 0x06]);
    await sleep(50);
    device.write([0x1a, 0x06]);
    await sleep(50);

    // Init start: 0xB00030 = 0x01
    writeReg(device, 0xB00030, [0x01]);
    await sleep(50);

    console.log("  [IR] Writing sensitivity registers...");

    // Sensitivity block 1 (9 bytes) - Wii level 3
    writeReg(device, 0xB00000, [0x02, 0x00, 0x00, 0x71, 0x01, 0x00, 0xaa, 0x00, 0x64]);
    await sleep(50);

    // Sensitivity block 2 (2 bytes) - Wii level 3
    writeReg(device, 0xB0001A, [0x63, 0x03]);
    await sleep(50);

    // Mode number: Basic = 0x01 (0x37 の IR10bytes と整合)
    writeReg(device, 0xB00033, [0x01]);
    await sleep(50);

    // Finish: 0xB00030 = 0x08
    writeReg(device, 0xB00030, [0x08]);
    await sleep(50);

    console.log("  [IR] IR camera initialized (Basic Mode, Sensitivity Level 3)");
}


// IR→カーソル制御の有効/無効フラグ（デフォルトで無効 - フロントのIRオーバーレイを使用）
let irCursorEnabled = false;

// ========================================
// カーソルスムージング用
// ========================================
let lastCursor: { x: number; y: number } | null = null;
let lastIrPoints: { x: number; y: number }[] = [];
const SMOOTHING_FACTOR = 0.3; // 0に近いほど滑らか（遅延増）、1に近いほど即応（ジッタ増）
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// WiiリモコンのID定義
const VENDOR_ID = 0x057e;
const PRODUCT_ID = 0x0306;      // 初期型
const PRODUCT_ID_PLUS = 0x0330; // Plus

// WebSocketサーバーの立ち上げ
const wss = new WebSocketServer({ port: 8080 });
console.log('WebSocket Server started on port 8080');

// クライアント管理
let clients: WebSocket[] = [];
wss.on('listening', () => {
    // noop
});

let isWiiConnected = false;
let currentDevice: HID.HID | null = null; // ★追加: 現在のデバイスを保持
let speakerInitialized = false; // スピーカーが初期化済みかどうか
let isPlayingAudio = false;

function setWiiConnected(next: boolean) {
    if (isWiiConnected === next) return;
    isWiiConnected = next;
    broadcast({ type: 'status', connected: isWiiConnected });

    // ★追加: 切断に遷移した瞬間をフロントへ通知（ポップアップ表示トリガー）
    if (!isWiiConnected) {
        broadcast({ type: 'wiiDisconnected', at: Date.now() });
        speakerInitialized = false; // 切断時にスピーカー初期化フラグをリセット
    }
}

// Wiiリモコンのスピーカーを初期化
function initSpeaker() {
    if (!currentDevice || speakerInitialized) return;

    try {
        console.log('=== Initializing Wii Remote speaker ===');

        // // 0. データレポートモードを0x30に変更（スピーカー用）
        // console.log('Setting data report mode to 0x30...');
        // currentDevice.write([0x12, 0x00, 0x30]);

        // 少し待機
        setTimeout(() => {
            if (!currentDevice) return;

            // 1. スピーカーの有効化 (0x14へ0x04を送信)
            console.log('Enabling speaker...');
            currentDevice.write([0x14, 0x04]);

            // 2. スピーカーのミュート (0x19へ0x04を送信)
            console.log('Muting speaker...');
            currentDevice.write([0x19, 0x04]);

            // 少し待機してからレジスタ設定
            setTimeout(() => {
                if (!currentDevice) return;

                // 3. レジスタ0xa20009へ0x01を書き込み
                console.log('Writing to register 0xa20009...');
                currentDevice.write([0x16, 0x04, 0xa2, 0x00, 0x09, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

                // 4. レジスタ0xa20001へ0x08を書き込み
                console.log('Writing to register 0xa20001 (0x08)...');
                currentDevice.write([0x16, 0x04, 0xa2, 0x00, 0x01, 0x01, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

                // 5. レジスタ0xa20001へ7-byte configurationを書き込み
                // 00 40 70 17 50 00 00
                // 40: 8bit PCM, 70 17: 2kHz (リトルエンディアン 6000 = 0x1770, 12000000/2000=6000), 50: ボリューム
                console.log('Writing 7-byte configuration...');
                // 5. サンプルレート設定 (0x17へ書き込み)
                // 12MHz / 2000Hz = 6000 = 0x1770 (リトルエンディアン: 70 17)
                console.log('Setting sample rate to 2000Hz...');
                currentDevice.write([
                    0x16, 0x04, 0xa2, 0x00, 0x01, 0x07,
                    0x00, 0x40, 0x70, 0x17, 0x50, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
                ]);

                // 6. レジスタ0xa20008へ0x01を書き込み
                console.log('Writing to register 0xa20008...');
                currentDevice.write([0x16, 0x04, 0xa2, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

                // 7. ミュート解除 (0x19へ0x00を送信)
                console.log('Unmuting speaker...');
                currentDevice.write([0x19, 0x00]);

                speakerInitialized = true;
                console.log('=== Speaker initialized successfully ===');
            }, 50);
        }, 50);

    } catch (err) {
        console.error('Failed to initialize speaker:', err);
        speakerInitialized = false;
    }
}

// 簡易的なビープ音を生成（8bit Signed PCM）
function generateBeep(frequency: number, durationMs: number): Buffer {
    // Wiiリモコン側のスピーカー設定に合わせる
    const sampleRate = 2000;
    const samples = Math.floor((sampleRate * durationMs) / 1000);
    const buffer = Buffer.alloc(samples);

    for (let i = 0; i < samples; i++) {
        // サイン波生成
        const t = i / sampleRate;
        const value = Math.sin(2 * Math.PI * frequency * t);

        // エンベロープ
        let envelope = 1.0;
        const totalTime = durationMs / 1000;
        if (t < 0.02) envelope = t / 0.02;
        else if (t > totalTime - 0.05) envelope = (totalTime - t) / 0.05;

        // Signed 8-bit PCM (-128 to 127)
        // 振幅を控えめに設定して音割れを防止 (50程度)
        const scaled = Math.floor(value * envelope * 50);
        buffer.writeInt8(Math.max(-128, Math.min(127, scaled)), i);
    }

    return buffer;
}

// 音声ファイルから読み込む（.rawファイルがある場合）
function loadAudioFile(soundType: 'shot' | 'oh' | 'uxo'): Buffer | null {
    try {
        const filename = soundType === 'uxo' ? 'uxo.raw' : `${soundType}.raw`;
        const filepath = path.join(__dirname, '..', 'sounds', filename);

        if (fs.existsSync(filepath)) {
            console.log(`Loading audio file: ${filename}`);
            const data = fs.readFileSync(filepath);
            // ファイルは既にSigned 8-bit PCMとして変換されている前提
            // そのままBufferとして返す
            console.log(`Loaded ${data.length} bytes from ${filename}`);
            return data;
        }
    } catch (err) {
        console.error(`Failed to load audio file for ${soundType}:`, err);
    }

    return null;
}

// Wiiリモコンのスピーカーで音を鳴らす
function playSoundOnWii(soundType: 'shot' | 'oh' | 'uxo') {
    // ★再生中ならスキップ（接続状態に関係なく）
    if (isPlayingAudio) {
        console.log('Audio is already playing, skipping.');
        return;
    }

    if (!currentDevice || !isWiiConnected) {
        console.log('Cannot play sound: Wii Remote not connected');
        return;
    }

    console.log(`Playing sound: ${soundType}`);

    // スピーカーが初期化されていなければ初期化
    if (!speakerInitialized) {
        console.log('Speaker not initialized, initializing now...');
        initSpeaker();
        // 初期化後、少し待ってから音声送信
        setTimeout(() => playSoundOnWiiInternal(soundType), 200);
    } else {
        playSoundOnWiiInternal(soundType);
    }
}


function playSoundOnWiiInternal(soundType: 'shot' | 'oh' | 'uxo') {
    if (!currentDevice) return;

    // スピーカーが初期化されていない場合は初期化
    if (!speakerInitialized) {
        console.log('Speaker not initialized, initializing...');
        initSpeaker();
        // 初期化完了を待ってから再生
        setTimeout(() => playSoundOnWiiInternal(soundType), 200);
        return;
    }

    try {
        console.log(`Generating audio data for: ${soundType}`);

        const soundConfigs = {
            'shot': { freq: 600, duration: 150 },
            'oh': { freq: 350, duration: 250 },
            'uxo': { freq: 250, duration: 200 }
        } as const;

        const config = soundConfigs[soundType] ?? soundConfigs['shot'];

        let audioData = loadAudioFile(soundType);
        if (!audioData) {
            console.log(`Audio file not found, generating beep for: ${soundType}`);
            audioData = generateBeep(config.freq, config.duration);
        }

        console.log(`Audio data size: ${audioData.length} bytes`);

        // ★パケット送信ループ
        isPlayingAudio = true;

        const chunkSize = 20;
        const sampleRate = 2000;
        // Wiiリモコンの実際のバッファ処理能力に合わせた送信間隔
        // 実測値に基づき20msに設定（遅めに送ってバッファオーバーフローを防ぐ）
        const chunkMs = 20;

        const totalChunks = Math.ceil(audioData.length / chunkSize);
        let chunkIndex = 0;

        // レポートID 0x18、サイズフィールド（20バイトを示す）
        const packet: number[] = new Array(22).fill(0);
        packet[0] = 0x18; // スピーカーデータレポート
        packet[1] = (chunkSize << 3); // サイズフィールド: 20 << 3 = 0xA0

        console.log(`Starting playback: ${totalChunks} chunks, ${chunkMs}ms interval, theoretical duration: ${(totalChunks * chunkSize / sampleRate * 1000).toFixed(0)}ms`);

        const tick = () => {
            if (!currentDevice) {
                console.log('Device disconnected during playback');
                isPlayingAudio = false;
                return;
            }

            if (chunkIndex >= totalChunks) {
                console.log(`Playback complete. Sent ${chunkIndex} chunks`);
                isPlayingAudio = false;
                return;
            }

            const offset = chunkIndex * chunkSize;

            // 20バイト詰める（足りない分は0でパディング）
            for (let i = 0; i < chunkSize; i++) {
                packet[2 + i] = audioData[offset + i] ?? 0;
            }

            const dev = currentDevice;
            if (!dev) {
                isPlayingAudio = false;
                return;
            }

            try {
                dev.write(packet);
            } catch (e) {
                console.error('Error sending audio packet:', e);
                isPlayingAudio = false;
                return;
            }

            chunkIndex++;

            // 次のチャンクを送信
            setTimeout(tick, chunkMs);
        };

        // 最初のチャンクを送信開始
        tick();
    } catch (err) {
        console.error('Failed to play sound on Wii:', err);
        isPlayingAudio = false;
    }
}


wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('Client connected');
    // 接続直後に現在の状態を通知
    try {
        ws.send(JSON.stringify({ type: 'status', connected: isWiiConnected, irCursorEnabled }));
    } catch {  }
    ws.on('close', () => {
        clients = clients.filter(c => c !== ws);
    });

    // クライアントからのメッセージ受信
    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data.toString());
            if (msg.type === 'setIrCursor') {
                irCursorEnabled = !!msg.enabled;
                console.log(`IR Cursor control: ${irCursorEnabled ? 'ENABLED' : 'DISABLED'}`);
                broadcast({ type: 'irCursorStatus', enabled: irCursorEnabled });
            }
        } catch { }
    });

    // ★追加: クライアントからのメッセージを受信（Wiiリモコンへの音声再生要求）
    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data.toString());
            if (msg.type === 'playSound' && msg.soundType) {
                playSoundOnWii(msg.soundType);
            }
        } catch (e) {
            console.error('Failed to parse client message:', e);
        }
    });
});

// データを全クライアントに配信
function broadcast(data: any) {
    const json = JSON.stringify(data);
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(json);
        }
    });
}

// 接続と初期化処理
async function connectWiiRemote() {
    // 1. 候補デバイスを探す
    const devices = HID.devices().filter(d =>
        d.vendorId === VENDOR_ID && (d.productId === PRODUCT_ID || d.productId === PRODUCT_ID_PLUS)
    );

    if (devices.length === 0) {
        console.log('Wii Remote not found. Waiting...');
        setWiiConnected(false);
        setWiiConnected(false);
        setTimeout(connectWiiRemote, 3000);
        return;
    }

    console.log(`Found ${devices.length} candidates. Testing connection...`);

    let device: HID.HID | null = null;
    let keepAliveInterval: NodeJS.Timeout | null = null; // ★追加: タイマー変数

    // 2. 書き込み可能なデバイスを探す
    for (const devInfo of devices) {
        if (!devInfo.path) continue;


        try {
            console.log(`Testing path: ${devInfo.path}`);
            const tempDevice = new HID.HID(devInfo.path);

            // 疎通確認
            tempDevice.write([0x11, 0x10]);


            console.log(">> Success! Connected.");
            device = tempDevice;
            break;
        } catch (e) {
            // console.log(">> Failed to write to this interface.");
        }
    }

    if (!device) {
        console.error("Could not connect to any device interfaces. Retrying...");
        setWiiConnected(false);
        setWiiConnected(false);
        setTimeout(connectWiiRemote, 3000);
        return;
    }

    // ★追加: デバイスを保持
    currentDevice = device;

    // 3. 機能の初期化
    try {
        console.log("Initializing sensors (IR + Accel)...");

        // レポートモード0x37（Coreボタン + Accel + IR(10bytes) + Extension(6bytes)）に設定
        // ★重要: continuous(0x04) を立てて、ボタン押下でも確実にレポートが来るようにする
        await setReportMode37(device);

        // IRカメラの初期化（WiiBrew仕様準拠）
        await initIR(device);

        // IR初期化後にも念のため再設定（状態変化でモードが戻るケースの保険）
        await setReportMode37(device);
        device.write([0x12, 0x00, 0x37]);
        device.write([0x13, 0x04]);
        device.write([0x1a, 0x04]);
        device.write([0x17, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x90, 0x00, 0x41]);
        device.write([0x17, 0x00, 0x40, 0x00, 0x00, 0x00, 0x00, 0x90, 0x00, 0x41]);

        console.log("Initialization complete.");
        setWiiConnected(true);

        // ★追加: Keep-Alive処理 (3秒ごとにステータス要求を送る)
        keepAliveInterval = setInterval(() => {
            try {
                // 0x15: ステータス要求 (振動なし) -> これでWiiリモコンのスリープを回避
                device?.write([0x15, 0x00]);
            } catch (e) {
                if (keepAliveInterval) clearInterval(keepAliveInterval);
            }
        }, 3000);

    } catch (err) {
        console.error("Initialization failed:", err);
        setWiiConnected(false);
        setWiiConnected(false);
        device.close();
        setTimeout(connectWiiRemote, 1000);
        return;
    }

    // 4. データ受信処理
    let lastIrLogTime = 0;
    let reportCount = { 0x20: 0, 0x37: 0, other: 0 };
    let lastReportModeResendAt = 0;
    let lastCursorUpdateTime = 0; // ★追加: カーソル更新のスロットリング用

    device.on('data', (data: Buffer) => {
        if (data.length < 3) return;

        const reportId = data[0];

        // ★デバッグ: レポート種別をカウント
        if (reportId === 0x20) reportCount[0x20]++;
        else if (reportId === 0x37) reportCount[0x37]++;
        else reportCount.other++;

        // ★追加: Status Report (0x20) を受信したらレポートモードを再送
        // 拡張の抜き差し等で 0x20 が飛んでくることがあり、0x12 を送り直さないとデータが来なくなる
        if (reportId === 0x20) {
            // Status report
            // data[3] の bit3(0x08) が IR enabled になっているかをまず確認
            const lf = data[3] ?? 0;
            const irEnabled = (lf & 0x08) !== 0;

            console.log(
                `[Status 0x20] irEnabled=${irEnabled} lf=0x${lf.toString(16).padStart(2, "0")} ` +
                `(counts: 0x20=${reportCount[0x20]}, 0x37=${reportCount[0x37]})`
            );

            // ★仕様上は 0x20 受信後に 0x12 を再送した方が堅牢。
            // ただし 0x20 は keepAlive で定期的に来るので、1秒に1回までに制限して再送する。
            const nowMs = Date.now();
            if (nowMs - lastReportModeResendAt > 1000) {
                lastReportModeResendAt = nowMs;
                try {
                    device?.write([0x12, 0x04, 0x37]);
                } catch (e) {
                    console.error("Failed to re-send report mode 0x37:", e);
                }
            }
            return;
        }


        // 0x37 以外のレポートは無視
        if (reportId !== 0x37) {
            console.log(`[Unknown Report 0x${reportId.toString(16)}] length=${data.length}`);
            return;
        }

        const b1 = data[1] ?? 0;
        const b2 = data[2] ?? 0;

        const buttons = {
            Left: (b1 & 0x01) !== 0,
            Right: (b1 & 0x02) !== 0,
            Down: (b1 & 0x04) !== 0,
            Up: (b1 & 0x08) !== 0,
            Plus: (b1 & 0x10) !== 0,
            Two: (b2 & 0x01) !== 0,
            One: (b2 & 0x02) !== 0,
            B: (b2 & 0x04) !== 0,
            A: (b2 & 0x08) !== 0,
            Minus: (b2 & 0x10) !== 0,
            Home: (b2 & 0x80) !== 0,
        };

        // accel はひとまず 8bit をそのまま採用（確実に変化が取れる）
        // MotionPlus(いわゆる"ジャイロ")は Extension 初期化/解析が別途必要
        const accel = {
            x: data[3] ?? 0,
            y: data[4] ?? 0,
            z: data[5] ?? 0,
        };

        // === IR解析（0x37 Basic Mode: 10bytes で最大4点） ===
        const irDots = parseIR_0x37(data);

        // ★デバッグ: ボタン押下をログ出力
        const pressedButtons = Object.entries(buttons)
            .filter(([_, v]) => v)
            .map(([k]) => k);
        if (pressedButtons.length > 0) {
            console.log(`[BTN] ${pressedButtons.join(', ')}`);
        }

        // ★デバッグ: IRデータをログ出力（500ms間隔）
        const now = Date.now();
        if (now - lastIrLogTime > 500) {
            lastIrLogTime = now;

            // 0x37 の先頭をダンプ（ボタンバイト位置の切り分け用）
            // 期待: [37 b1 b2 ax ay az ...]
            console.log(`[0x37 HEX] ${[...data.slice(0, 18)].map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
            console.log(`[RAW BTN] b1=0x${b1.toString(16).padStart(2, '0')} b2=0x${b2.toString(16).padStart(2, '0')}`);

            if (irDots.length > 0) {
                const irStr = irDots.map((p: { x: number; y: number }, i: number) => `IR${i + 1}:(${p.x},${p.y})`).join(' ');
                console.log(`[IR] ${irDots.length} points detected: ${irStr}`);
            } else {
                // IRが見えていない時も定期的にログ
                console.log(`[IR] No points detected (raw bytes 6-15: ${[...data.slice(6, 16)].map(b => b.toString(16).padStart(2, '0')).join(' ')})`);
            }
        }

        // === カーソル座標計算 ===
        const cursorRaw = calcCursorFromIR(irDots);
        
        // カーソル計算できた場合、スムージングを適用
        let cursor: { x: number; y: number } | null = null;
        if (cursorRaw) {
            const normalized = normalizeCursor(cursorRaw);
            
            // スムージング（ローパスフィルター）
            if (lastCursor) {
                cursor = {
                    x: lastCursor.x + (normalized.x - lastCursor.x) * SMOOTHING_FACTOR,
                    y: lastCursor.y + (normalized.y - lastCursor.y) * SMOOTHING_FACTOR,
                };
            } else {
                cursor = normalized;
            }
            lastCursor = cursor;
            lastIrPoints = irDots;
        } else if (lastCursor && lastIrPoints.length > 0) {
            // IRが一時的に見えなくなった場合、最後の座標を維持
            cursor = lastCursor;
        }

        // === PCカーソル移動（有効時のみ、16msにスロットリング） ===
        if (irCursorEnabled && cursor) {
            const nowForCursor = Date.now();
            // 60fps相当（16ms）でカーソル更新を制限して、イベント処理をブロックしない
            if (nowForCursor - lastCursorUpdateTime >= 16) {
                lastCursorUpdateTime = nowForCursor;
                
                // 画面座標に変換
                const screenX = Math.round(cursor.x * screenWidth);
                const screenY = Math.round(cursor.y * screenHeight);
                
                // 画面範囲内にクランプ
                const clampedX = Math.max(0, Math.min(screenWidth - 1, screenX));
                const clampedY = Math.max(0, Math.min(screenHeight - 1, screenY));
                
                SetCursorPos(clampedX, clampedY);
            }
        }

        // === フロントへ送るデータ ===
        const payload = {
            buttons,
            accel,
            ir: irDots,
            cursor
        };

        broadcast(payload);

    });

    device.on('error', (err) => {

        console.error('Wii Remote disconnected:', err);

        // ★追加: エラーハンドラを発火点として、必ずフロントへ切断イベントを送る
        // （setWiiConnected(false) は state 変更時のみ送るため、保険としてここでも送る）
        broadcast({ type: 'wiiDisconnected', at: Date.now(), reason: String(err) });

        setWiiConnected(false);
        setWiiConnected(false);
        // ★追加: 切断されたらタイマーを止める
        if (keepAliveInterval) clearInterval(keepAliveInterval);

        // ★追加: デバイスをクリア
        currentDevice = null;
        isPlayingAudio = false;


        try { device?.close(); } catch { }

        try { device?.close(); } catch { }
        connectWiiRemote();
    });

    // ★追加: 正常クローズ時もタイマー停止
    device.on('close', () => {
        // ★追加: closeも切断イベント発火点として通知
        broadcast({ type: 'wiiDisconnected', at: Date.now(), reason: 'close' });

        setWiiConnected(false);
        if (keepAliveInterval) clearInterval(keepAliveInterval);

        // ★追加: デバイスをクリア
        currentDevice = null;
        isPlayingAudio = false;

        setWiiConnected(false);
        if (keepAliveInterval) clearInterval(keepAliveInterval);
    });
}

function parseIR_0x37(data: Buffer): { x: number; y: number }[] {
    // Basic Mode (10 bytes): data[6]〜[15]
    // 各点は 2.5 bytes (X下位8bit, Y下位8bit, XY上位2bit×2)
    // 最大4点取得可能
    const points: { x: number; y: number }[] = [];

    // IR1: data[6], data[7], data[8] の上位4bit
    const x1 = data[6] | ((data[8] >> 4) & 0x03) << 8;
    const y1 = data[7] | ((data[8] >> 6) & 0x03) << 8;

    // IR2: data[9], data[10], data[8] の下位4bit
    const x2 = data[9] | ((data[8] >> 0) & 0x03) << 8;
    const y2 = data[10] | ((data[8] >> 2) & 0x03) << 8;

    // IR3: data[11], data[12], data[13] の上位4bit
    const x3 = data[11] | ((data[13] >> 4) & 0x03) << 8;
    const y3 = data[12] | ((data[13] >> 6) & 0x03) << 8;

    // IR4: data[14], data[15], data[13] の下位4bit
    const x4 = data[14] | ((data[13] >> 0) & 0x03) << 8;
    const y4 = data[15] | ((data[13] >> 2) & 0x03) << 8;

    // 無効な座標 (1023, 1023) はフィルタリング
    // WiiBrew: "If an object is not seen, its position is 1023,1023"
    if (x1 !== 1023 && y1 !== 1023) points.push({ x: x1, y: y1 });
    if (x2 !== 1023 && y2 !== 1023) points.push({ x: x2, y: y2 });
    if (x3 !== 1023 && y3 !== 1023) points.push({ x: x3, y: y3 });
    if (x4 !== 1023 && y4 !== 1023) points.push({ x: x4, y: y4 });


    return points;
}

function calcCursorFromIR(ir: { x: number; y: number }[]): { x: number; y: number } | null {
    // 2点以上あれば「距離が一番離れている2点」を選ぶ（安定化）
    if (ir.length >= 2) {
        let maxDist = 0;
        let bestPair: [{ x: number; y: number }, { x: number; y: number }] | null = null;

        for (let i = 0; i < ir.length; i++) {
            for (let j = i + 1; j < ir.length; j++) {
                const dx = ir[i].x - ir[j].x;
                const dy = ir[i].y - ir[j].y;
                const dist = dx * dx + dy * dy;
                if (dist > maxDist) {
                    maxDist = dist;
                    bestPair = [ir[i], ir[j]];
                }
            }
        }

        if (bestPair) {
            const [a, b] = bestPair;
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;
            return { x: midX, y: midY };
        }
    }
    
    // 1点のみの場合、前回の2点目を使って推定
    if (ir.length === 1 && lastIrPoints.length >= 2) {
        // 前回の2点間の距離とオフセットを使って推定
        const [prevA, prevB] = lastIrPoints.slice(0, 2);
        const prevMidX = (prevA.x + prevB.x) / 2;
        const prevMidY = (prevA.y + prevB.y) / 2;
        
        // 現在の1点が前回のどちらに近いか判定
        const distToA = Math.abs(ir[0].x - prevA.x) + Math.abs(ir[0].y - prevA.y);
        const distToB = Math.abs(ir[0].x - prevB.x) + Math.abs(ir[0].y - prevB.y);
        
        // 前回の中点からの相対位置を保持して推定
        const halfWidth = Math.abs(prevB.x - prevA.x) / 2;
        const halfHeight = Math.abs(prevB.y - prevA.y) / 2;
        
        let estimatedMidX: number;
        let estimatedMidY: number;
        
        if (distToA < distToB) {
            // 現在の点はAに近い → Bが見えなくなった
            estimatedMidX = ir[0].x + halfWidth;
            estimatedMidY = ir[0].y + (prevMidY - prevA.y);
        } else {
            // 現在の点はBに近い → Aが見えなくなった
            estimatedMidX = ir[0].x - halfWidth;
            estimatedMidY = ir[0].y + (prevMidY - prevB.y);
        }
        
        return { x: estimatedMidX, y: estimatedMidY };
    }

    return null;
}

function normalizeCursor(pos: { x: number; y: number }): { x: number; y: number } {
    // IRカメラ座標系: X=0-1023, Y=0-767
    // 画面座標系: 左上が(0,0)
    // Wiiリモコンを画面に向けた時:
    //   - IRのXは右が大きい → 画面では左右反転が必要
    //   - IRのYは下が大きい → 画面もそのままでOK（ただし上に行きにくい場合は調整）
    
    // Y座標のマージンを調整（センサーバーが画面下にある場合）
    // 有効範囲を少し狭めて、上下の端にも届きやすくする
    const xNorm = 1.0 - pos.x / 1024; // 左右反転
    const yNorm = pos.y / 768;
    
    // Y座標の有効範囲を調整（上に行きやすくする）
    // センサーバーの位置に応じて調整可能
    const yAdjusted = (yNorm - 0.1) / 0.8; // 10%-90%の範囲を0-1にマップ
    
    return {
        x: Math.max(0, Math.min(1, xNorm)),
        y: Math.max(0, Math.min(1, yAdjusted)),
    };
}

connectWiiRemote();