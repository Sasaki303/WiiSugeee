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
wss.on('listening', () => {
    // noop
});

let isWiiConnected = false;
let currentDevice: HID.HID | null = null;

// Wiiリモコンのスピーカーで音を鳴らす関数
function playWiiSound(sound: 'q' | 'w' | 'e') {
    if (!currentDevice || !isWiiConnected) {
        console.log('Cannot play sound: Wii Remote not connected');
        return;
    }
    
    try {
        // 短いビープ音を鳴らす（周波数と長さで違いを出す）
        const patterns: { [key: string]: number[] } = {
            'q': [0x14, 0x01, 0xF0, 0x20, 0x40, 0x80], // 高音短
            'w': [0x14, 0x01, 0xC0, 0x30, 0x60, 0x90], // 中音中
            'e': [0x14, 0x01, 0xA0, 0x40, 0x80, 0xA0]  // 低音長
        };
        
        const pattern = patterns[sound] || patterns['q'];
        currentDevice.write(pattern);
        console.log(`Playing sound ${sound} on Wii Remote speaker`);
    } catch (err) {
        console.error('Failed to play sound on Wii Remote:', err);
    }
}

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
        ws.send(JSON.stringify({ type: 'status', connected: isWiiConnected }));
    } catch {}
    
    // クライアントからのメッセージを受信
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            if (data.type === 'playSound' && data.sound) {
                playWiiSound(data.sound);
            }
        } catch (err) {
            console.error('Failed to parse client message:', err);
        }
    });
    
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
		setWiiConnected(false);
        setTimeout(connectWiiRemote, 3000);
        return;
    }

    console.log(`Found ${devices.length} candidates. Testing connection...`);

    let device: HID.HID | null = null;
    let keepAliveInterval: NodeJS.Timeout | null = null; // ★追加: タイマー変数
    currentDevice = null; // リセット

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
            currentDevice = tempDevice; // グローバル変数に保存
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

        const accel = {
            x: data[3] ?? 0,
            y: data[4] ?? 0,
            z: data[5] ?? 0
        };

        const irDots = [];
        const ir1_x = (data[6] ?? 0) | (((data[8] ?? 0) >> 4) & 0x03) << 8;
        const ir1_y = (data[7] ?? 0) | (((data[8] ?? 0) >> 6) & 0x03) << 8;
        const ir2_x = (data[9] ?? 0)  | (((data[8] ?? 0) >> 0) & 0x03) << 8;
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
        currentDevice = null;
        // ★追加: 切断されたらタイマーを止める
        if (keepAliveInterval) clearInterval(keepAliveInterval);
        
        try { device?.close(); } catch {}
        connectWiiRemote();
    });

    // ★追加: 正常クローズ時もタイマー停止
    device.on('close', () => {
        // ★追加: closeも切断イベント発火点として通知
        broadcast({ type: 'wiiDisconnected', at: Date.now(), reason: 'close' });

    		setWiiConnected(false);
        currentDevice = null;
         if (keepAliveInterval) clearInterval(keepAliveInterval);
    });
}

connectWiiRemote();