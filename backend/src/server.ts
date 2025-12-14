import HID from 'node-hid';
import { WebSocketServer, WebSocket } from 'ws';

// WiiリモコンのID定義
const VENDOR_ID = 0x057e;
const PRODUCT_ID = 0x0306;      // 初期型
const PRODUCT_ID_PLUS = 0x0330; // Plus

// WebSocketサーバーの立ち上げ
const wss = new WebSocketServer({ port: 8080 });
console.log('WebSocket Server started on port 8080');

// クライアント管理
let clients: WebSocket[] = [];
wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('Client connected');
    ws.on('close', () => {
        clients = clients.filter(c => c !== ws);
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
        setTimeout(connectWiiRemote, 3000);
        return;
    }

    console.log(`Found ${devices.length} candidates. Testing connection...`);

    let device: HID.HID | null = null;

    // 2. 書き込み可能なデバイスを探す（ここが重要）
    for (const devInfo of devices) {
        if (!devInfo.path) continue;
        
        try {
            console.log(`Testing path: ${devInfo.path}`);
            const tempDevice = new HID.HID(devInfo.path);

            // 疎通確認（LED点灯コマンドを送ってみる）
            tempDevice.write([0x11, 0x10]);
            
            console.log(">> Success! Connected.");
            device = tempDevice;
            break; // 成功したらループを抜ける
        } catch (e) {
            // console.log(">> Failed to write to this interface.");
        }
    }

    if (!device) {
        console.error("Could not connect to any device interfaces. Retrying...");
        setTimeout(connectWiiRemote, 3000);
        return;
    }

    // 3. 機能の初期化 (IRと加速度を有効化)
    try {
        console.log("Initializing sensors (IR + Accel)...");

        // レポートモード設定 (0x37: Buttons + Accel + IR 10bytes interleaved)
        device.write([0x12, 0x00, 0x37]); 

        // IRカメラ有効化
        device.write([0x13, 0x04]); 
        device.write([0x1a, 0x04]); 

        // IR感度設定 (Block 1 & 2) - WiiFlash等の設定値を参考
        device.write([0x17, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x90, 0x00, 0x41]);
        device.write([0x17, 0x00, 0x40, 0x00, 0x00, 0x00, 0x00, 0x90, 0x00, 0x41]);

        console.log(" Initialization complete.");

    } catch (err) {
        console.error("Initialization failed:", err);
        device.close();
        setTimeout(connectWiiRemote, 1000);
        return;
    }

    // 4. データ受信処理
    device.on('data', (data: Buffer) => {
        // データが短すぎる場合はスキップ
        if (data.length < 3) return;

        // ボタン解析 (Data[1]とData[2]を使用)
        const b1 = data[1] ?? 0;
        const b2 = data[2] ?? 0;

        const buttons = {
            Left:  (b1 & 0x01) !== 0,
            Right: (b1 & 0x02) !== 0,
            Down:  (b1 & 0x04) !== 0,
            Up:    (b1 & 0x08) !== 0,
            Plus:  (b1 & 0x10) !== 0,
            
            Two:   (b2 & 0x01) !== 0,
            One:   (b2 & 0x02) !== 0,
            B:     (b2 & 0x04) !== 0,
            A:     (b2 & 0x08) !== 0,
            Minus: (b2 & 0x10) !== 0,
            Home:  (b2 & 0x80) !== 0,
        };

        // 加速度 (Mode 0x37 では Byte 3,4,5)
        const accel = {
            x: data[3] ?? 0,
            y: data[4] ?? 0,
            z: data[5] ?? 0
        };

        // IR解析 (Mode 0x37 では Byte 6-15)
        // 簡易実装: 1点目と2点目のみ抽出
        const irDots = [];
        
        // Dot 1
        const ir1_x = (data[6] ?? 0) | (((data[8] ?? 0) >> 4) & 0x03) << 8;
        const ir1_y = (data[7] ?? 0) | (((data[8] ?? 0) >> 6) & 0x03) << 8;
        
        // Dot 2
        const ir2_x = (data[9] ?? 0)  | (((data[8] ?? 0) >> 0) & 0x03) << 8;
        const ir2_y = (data[10] ?? 0) | (((data[8] ?? 0) >> 2) & 0x03) << 8;

        // WiiのIRセンサは検出していないとき 1023 (0x3FF) を返す
        if (ir1_x < 1023 && ir1_y < 1023) irDots.push({ x: ir1_x, y: ir1_y });
        if (ir2_x < 1023 && ir2_y < 1023) irDots.push({ x: ir2_x, y: ir2_y });

        const payload = {
            buttons,
            accel,
            ir: irDots
        };

        // コンソール確認用 (連打されるので、確認後はコメントアウト推奨)
        // console.log(`BTN: ${JSON.stringify(buttons)} | IR: ${irDots.length}pts`);

        broadcast(payload);
    });

    device.on('error', (err) => {
        console.error('Wii Remote disconnected:', err);
        try { device?.close(); } catch {}
        connectWiiRemote();
    });
}

connectWiiRemote();