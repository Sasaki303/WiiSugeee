import HID from 'node-hid';
import { WebSocketServer, WebSocket } from 'ws';
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
        // 振幅を少し抑える (80程度)
        const scaled = Math.floor(value * envelope * 80);
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

        // ★先頭無音（入れるなら1パケット分で十分なことが多い）
        const silence = Buffer.alloc(20, 0);
        const dataToSend = Buffer.concat([silence, audioData]);

        // ★ここから送信ループ（1 tick = 1 packet）
        isPlayingAudio = true;

        const chunkSize = 20;
        // ★スピーカー設定（initSpeakerの0x1770=2000Hz）と一致させる
        const sampleRate = 2000;
        const chunkMs = (chunkSize / sampleRate) * 1000;

        const totalChunks = Math.ceil(dataToSend.length / chunkSize);
        let chunkIndex = 0;

        // ★毎回の配列生成を避ける（ジッタ減）
        const packet: number[] = new Array(22).fill(0);
        packet[0] = 0x18;
        packet[1] = 0xA0;

        const t0 = performance.now();

        const tick = () => {
            // currentDevice が途中で null になる可能性がある
            if (!currentDevice) {
                isPlayingAudio = false;
                return;
            }

            if (chunkIndex >= totalChunks) {
                isPlayingAudio = false;
                return;
            }

            const now = performance.now();
            const expected = Math.floor((now - t0) / chunkMs);

            // ★遅れたらまとめ送りせずドロップして追いつく
            if (expected > chunkIndex + 1) {
                // まず無音を1パケット送って耳障りを減らす
                for (let i = 0; i < chunkSize; i++) packet[2 + i] = 0;

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

                // 追いつく（遅れ分は捨てる）
                chunkIndex = expected;
                if (chunkIndex >= totalChunks) {
                    isPlayingAudio = false;
                    return;
                }
            }
            const offset = chunkIndex * chunkSize;

            // 20バイト詰める（足りない分は0でパディング）
            for (let i = 0; i < chunkSize; i++) {
                packet[2 + i] = dataToSend[offset + i] ?? 0;
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

            const nextAt = t0 + chunkIndex * chunkMs;
            const delay = Math.max(0, nextAt - performance.now());
            setTimeout(tick, delay);


        };

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
        ws.send(JSON.stringify({ type: 'status', connected: isWiiConnected }));
    } catch { }
    ws.on('close', () => {
        clients = clients.filter(c => c !== ws);
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
        setTimeout(connectWiiRemote, 3000);
        return;
    }

    // ★追加: デバイスを保持
    currentDevice = device;

    // 3. 機能の初期化
    try {
        console.log("Initializing sensors (IR + Accel)...");

        device.write([0x12, 0x00, 0x37]);
        device.write([0x13, 0x04]);
        device.write([0x1a, 0x04]);
        device.write([0x17, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x90, 0x00, 0x41]);
        device.write([0x17, 0x00, 0x40, 0x00, 0x00, 0x00, 0x00, 0x90, 0x00, 0x41]);

        console.log(" Initialization complete.");
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
        device.close();
        setTimeout(connectWiiRemote, 1000);
        return;
    }

    // 4. データ受信処理
    device.on('data', (data: Buffer) => {
        if (data.length < 3) return;

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

        const accel = {
            x: data[3] ?? 0,
            y: data[4] ?? 0,
            z: data[5] ?? 0
        };

        const irDots = [];
        const ir1_x = (data[6] ?? 0) | (((data[8] ?? 0) >> 4) & 0x03) << 8;
        const ir1_y = (data[7] ?? 0) | (((data[8] ?? 0) >> 6) & 0x03) << 8;
        const ir2_x = (data[9] ?? 0) | (((data[8] ?? 0) >> 0) & 0x03) << 8;
        const ir2_y = (data[10] ?? 0) | (((data[8] ?? 0) >> 2) & 0x03) << 8;

        if (ir1_x < 1023 && ir1_y < 1023) irDots.push({ x: ir1_x, y: ir1_y });
        if (ir2_x < 1023 && ir2_y < 1023) irDots.push({ x: ir2_x, y: ir2_y });

        const payload = {
            buttons,
            accel,
            ir: irDots
        };

        broadcast(payload);
    });

    device.on('error', (err) => {

        console.error('Wii Remote disconnected:', err);

        // ★追加: エラーハンドラを発火点として、必ずフロントへ切断イベントを送る
        // （setWiiConnected(false) は state 変更時のみ送るため、保険としてここでも送る）
        broadcast({ type: 'wiiDisconnected', at: Date.now(), reason: String(err) });

        setWiiConnected(false);
        // ★追加: 切断されたらタイマーを止める
        if (keepAliveInterval) clearInterval(keepAliveInterval);

        // ★追加: デバイスをクリア
        currentDevice = null;
        isPlayingAudio = false;


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

    });
}

connectWiiRemote();