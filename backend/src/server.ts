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

// IR→カーソル制御の有効/無効フラグ
let irCursorEnabled = false;

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

function setWiiConnected(next: boolean) {
    if (isWiiConnected === next) return;
    isWiiConnected = next;
    broadcast({ type: 'status', connected: isWiiConnected });

    // ★追加: 切断に遷移した瞬間をフロントへ通知（ポップアップ表示トリガー）
    if (!isWiiConnected) {
        broadcast({ type: 'wiiDisconnected', at: Date.now() });
    }
}

wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('Client connected');
    // 接続直後に現在の状態を通知
    try {
        ws.send(JSON.stringify({ type: 'status', connected: isWiiConnected, irCursorEnabled }));
    } catch { }
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

    // 3. 機能の初期化
    try {
        console.log("Initializing sensors (IR + Accel)...");

        // レポートモード0x37（Coreボタン + Accel + IR(10bytes) + Extension(6bytes)）に設定
        device.write([0x12, 0x00, 0x37]);

        // IRカメラを有効化
        device.write([0x13, 0x04]);
        device.write([0x1a, 0x04]);

        // IRカメラの初期化（感度設定3: バランス型）
        // I2Cアドレス 0x30 に 0x01 を書き込み（初期化開始）
        device.write([0x17, 0x00, 0x30, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00]);
        // I2Cアドレス 0x00-0x06 に感度パラメータを書き込み
        device.write([0x17, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0xAA, 0x64, 0x63, 0x03]);
        // I2Cアドレス 0x1A に感度パラメータを書き込み
        device.write([0x17, 0x00, 0x1A, 0x00, 0x00, 0x00, 0x00, 0x63, 0x03]);
        // I2Cアドレス 0x33 に 0x03 を書き込み（感度設定完了）
        device.write([0x17, 0x00, 0x33, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x03]);
        // I2Cアドレス 0x30 に 0x08 を書き込み（初期化完了）
        device.write([0x17, 0x00, 0x30, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x08]);

        console.log(" Initialization complete. (IR sensitivity: 3)");
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

        // === IR解析（0x37専用） ===
        const irDots = parseIR_0x37(data);

        // === カーソル座標計算 ===
        const cursorRaw = calcCursorFromIR(irDots);
        const cursor = cursorRaw ? normalizeCursor(cursorRaw) : null;

        // === PCカーソル移動（有効時のみ） ===
        if (irCursorEnabled && cursor) {
            const screenX = Math.round(cursor.x * screenWidth);
            const screenY = Math.round(cursor.y * screenHeight);
            SetCursorPos(screenX, screenY);
        }

        // === フロントへ送るデータ ===
        const payload = {
            buttons,
            accel,
            ir: irDots,
            cursor   // ★追加
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

        try { device?.close(); } catch { }
        connectWiiRemote();
    });

    // ★追加: 正常クローズ時もタイマー停止
    device.on('close', () => {
        // ★追加: closeも切断イベント発火点として通知
        broadcast({ type: 'wiiDisconnected', at: Date.now(), reason: 'close' });

        setWiiConnected(false);
        if (keepAliveInterval) clearInterval(keepAliveInterval);
    });
}

function parseIR_0x37(data: Buffer) {
    // IRデータは data[6]〜[15]
    const points = [];

    // IR1
    const x1 = data[6] | ((data[8] >> 4) & 0x03) << 8;
    const y1 = data[7] | ((data[8] >> 6) & 0x03) << 8;

    // IR2
    const x2 = data[9] | ((data[8] >> 0) & 0x03) << 8;
    const y2 = data[10] | ((data[8] >> 2) & 0x03) << 8;

    if (x1 < 1023 && y1 < 767) points.push({ x: x1, y: y1 });
    if (x2 < 1023 && y2 < 767) points.push({ x: x2, y: y2 });

    return points;
}

function calcCursorFromIR(ir: { x: number; y: number }[]) {
    if (ir.length < 2) return null;

    const [a, b] = ir.sort((p, q) => p.x - q.x);

    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;

    return { x: midX, y: midY };
}

function normalizeCursor(pos: { x: number; y: number }) {
    return {
        x: 1.0 - pos.x / 1024, // 左右反転（重要）
        y: pos.y / 768
    };
}

connectWiiRemote();