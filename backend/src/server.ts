import HID from 'node-hid';
import { WebSocketServer, WebSocket } from 'ws';
import koffi from 'koffi';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';

let SetCursorPos: ((x: number, y: number) => boolean) | null = null;
let GetSystemMetrics: ((index: number) => number) | null = null;
let screenWidth = 1920;
let screenHeight = 1080;

if (isWindows) {
    const user32 = koffi.load('user32.dll');
    SetCursorPos = user32.func('SetCursorPos', 'bool', ['int', 'int']);
    GetSystemMetrics = user32.func('GetSystemMetrics', 'int', ['int']);
    screenWidth = GetSystemMetrics(0);
    screenHeight = GetSystemMetrics(1);
    console.log(`Screen size: ${screenWidth}x${screenHeight}`);
} else {
    console.log(`Running on ${process.platform} - cursor control disabled`);
}

function sleep(ms: number): Promise<void> {
    return new Promise((res) => setTimeout(res, ms));
}

async function setReportMode37(device: HID.HID): Promise<void> {
    device.write([0x12, 0x04, 0x37]);
    await sleep(50);
}

function writeReg(device: HID.HID, addr: number, data: number[]): void {
    const buf = Buffer.alloc(22, 0x00);
    buf[0] = 0x16;
    buf[1] = 0x04;
    buf[2] = (addr >> 16) & 0xff;
    buf[3] = (addr >> 8) & 0xff;
    buf[4] = addr & 0xff;
    const size = Math.min(16, data.length);
    buf[5] = size;
    for (let i = 0; i < size; i++) buf[6 + i] = data[i] & 0xff;
    device.write([...buf]);
}

async function initIR(device: HID.HID): Promise<void> {
    console.log("  [IR] Enabling IR camera...");
    device.write([0x13, 0x06]);
    await sleep(50);
    device.write([0x1a, 0x06]);
    await sleep(50);
    writeReg(device, 0xB00030, [0x01]);
    await sleep(50);
    writeReg(device, 0xB00000, [0x02, 0x00, 0x00, 0x71, 0x01, 0x00, 0xaa, 0x00, 0x64]);
    await sleep(50);
    writeReg(device, 0xB0001A, [0x63, 0x03]);
    await sleep(50);
    writeReg(device, 0xB00033, [0x01]);
    await sleep(50);
    writeReg(device, 0xB00030, [0x08]);
    await sleep(50);
    console.log("  [IR] IR camera initialized");
}


let irCursorEnabled = false;

let lastCursor: { x: number; y: number } | null = null;
let lastIrPoints: { x: number; y: number }[] = [];
const SMOOTHING_FACTOR = 0.3;

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
let speakerInitialized = false;
let isPlayingAudio = false;

function setWiiConnected(next: boolean) {
    if (isWiiConnected === next) return;
    isWiiConnected = next;
    broadcast({ type: 'status', connected: isWiiConnected });
    if (!isWiiConnected) {
        broadcast({ type: 'wiiDisconnected', at: Date.now() });
        speakerInitialized = false;
    }
}

function initSpeaker() {
    if (!currentDevice || speakerInitialized) return;

    try {
        console.log('Initializing speaker...');
        setTimeout(() => {
            if (!currentDevice) return;
            currentDevice.write([0x14, 0x04]);
            currentDevice.write([0x19, 0x04]);

            setTimeout(() => {
                if (!currentDevice) return;
                currentDevice.write([0x16, 0x04, 0xa2, 0x00, 0x09, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
                currentDevice.write([0x16, 0x04, 0xa2, 0x00, 0x01, 0x01, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
                currentDevice.write([
                    0x16, 0x04, 0xa2, 0x00, 0x01, 0x07,
                    0x00, 0x40, 0x70, 0x17, 0x50, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
                ]);
                currentDevice.write([0x16, 0x04, 0xa2, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
                currentDevice.write([0x19, 0x00]);
                speakerInitialized = true;
                console.log('Speaker initialized');
            }, 50);
        }, 50);

    } catch (err) {
        console.error('Failed to initialize speaker:', err);
        speakerInitialized = false;
    }
}

function generateBeep(frequency: number, durationMs: number): Buffer {
    const sampleRate = 2000;
    const samples = Math.floor((sampleRate * durationMs) / 1000);
    const buffer = Buffer.alloc(samples);

    for (let i = 0; i < samples; i++) {
        const t = i / sampleRate;
        const value = Math.sin(2 * Math.PI * frequency * t);
        let envelope = 1.0;
        const totalTime = durationMs / 1000;
        if (t < 0.02) envelope = t / 0.02;
        else if (t > totalTime - 0.05) envelope = (totalTime - t) / 0.05;
        const scaled = Math.floor(value * envelope * 50);
        buffer.writeInt8(Math.max(-128, Math.min(127, scaled)), i);
    }
    return buffer;
}

function loadAudioFile(soundType: 'shot' | 'oh' | 'uxo'): Buffer | null {
    try {
        const filename = soundType === 'uxo' ? 'uxo.raw' : `${soundType}.raw`;
        const filepath = path.join(__dirname, '..', 'sounds', filename);
        if (fs.existsSync(filepath)) {
            return fs.readFileSync(filepath);
        }
    } catch (err) {
        console.error(`Failed to load audio file for ${soundType}:`, err);
    }

    return null;
}

function playSoundOnWii(soundType: 'shot' | 'oh' | 'uxo') {
    if (isPlayingAudio) return;
    if (!currentDevice || !isWiiConnected) return;

    if (!speakerInitialized) {
        initSpeaker();
        setTimeout(() => playSoundOnWiiInternal(soundType), 200);
    } else {
        playSoundOnWiiInternal(soundType);
    }
}


function playSoundOnWiiInternal(soundType: 'shot' | 'oh' | 'uxo') {
    if (!currentDevice) return;
    if (!speakerInitialized) {
        initSpeaker();
        setTimeout(() => playSoundOnWiiInternal(soundType), 200);
        return;
    }

    try {
        const soundConfigs = {
            'shot': { freq: 600, duration: 150 },
            'oh': { freq: 350, duration: 250 },
            'uxo': { freq: 250, duration: 200 }
        } as const;

        const config = soundConfigs[soundType] ?? soundConfigs['shot'];
        let audioData = loadAudioFile(soundType);
        if (!audioData) {
            audioData = generateBeep(config.freq, config.duration);
        }

        isPlayingAudio = true;
        const chunkSize = 20;
        const sampleRate = 2000;
        const chunkMs = 20;

        const totalChunks = Math.ceil(audioData.length / chunkSize);
        let chunkIndex = 0;

        const packet: number[] = new Array(22).fill(0);
        packet[0] = 0x18;
        packet[1] = (chunkSize << 3);

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

            // 20バイト詰める
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

async function connectWiiRemote() {
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
    let keepAliveInterval: NodeJS.Timeout | null = null;

    for (const devInfo of devices) {
        if (!devInfo.path) continue;

        try {
            console.log(`Testing path: ${devInfo.path}`);
            const tempDevice = new HID.HID(devInfo.path);
            tempDevice.write([0x11, 0x10]);
            console.log(">> Success! Connected.");
            device = tempDevice;
            break;
        } catch (e) { }
    }

    if (!device) {
        console.error("Could not connect to any device interfaces. Retrying...");
        setWiiConnected(false);
        setWiiConnected(false);
        setTimeout(connectWiiRemote, 3000);
        return;
    }

    currentDevice = device;

    try {
        console.log("Initializing sensors (IR + Accel)...");

        await setReportMode37(device);
        await initIR(device);
        await setReportMode37(device);
        device.write([0x12, 0x00, 0x37]);
        device.write([0x13, 0x04]);
        device.write([0x1a, 0x04]);
        device.write([0x17, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x90, 0x00, 0x41]);
        device.write([0x17, 0x00, 0x40, 0x00, 0x00, 0x00, 0x00, 0x90, 0x00, 0x41]);

        console.log("Initialization complete.");
        setWiiConnected(true);
        keepAliveInterval = setInterval(() => {
            try {
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

    let lastIrLogTime = 0;
    let reportCount = { 0x20: 0, 0x37: 0, other: 0 };
    let lastReportModeResendAt = 0;
    let lastCursorUpdateTime = 0;

    device.on('data', (data: Buffer) => {
        if (data.length < 3) return;

        const reportId = data[0];

        if (reportId === 0x20) reportCount[0x20]++;
        else if (reportId === 0x37) reportCount[0x37]++;
        else reportCount.other++;

        if (reportId === 0x20) {
            const lf = data[3] ?? 0;
            const irEnabled = (lf & 0x08) !== 0;

            console.log(
                `[Status 0x20] irEnabled=${irEnabled} lf=0x${lf.toString(16).padStart(2, "0")} ` +
                `(counts: 0x20=${reportCount[0x20]}, 0x37=${reportCount[0x37]})`
            );

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

        const accel = {
            x: data[3] ?? 0,
            y: data[4] ?? 0,
            z: data[5] ?? 0,
        };

        const irDots = parseIR_0x37(data);

        const pressedButtons = Object.entries(buttons)
            .filter(([_, v]) => v)
            .map(([k]) => k);
        if (pressedButtons.length > 0) {
            console.log(`[BTN] ${pressedButtons.join(', ')}`);
        }

        const now = Date.now();
        if (now - lastIrLogTime > 500) {
            lastIrLogTime = now;

            console.log(`[0x37 HEX] ${[...data.slice(0, 18)].map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
            console.log(`[RAW BTN] b1=0x${b1.toString(16).padStart(2, '0')} b2=0x${b2.toString(16).padStart(2, '0')}`);

            if (irDots.length > 0) {
                const irStr = irDots.map((p: { x: number; y: number }, i: number) => `IR${i + 1}:(${p.x},${p.y})`).join(' ');
                console.log(`[IR] ${irDots.length} points detected: ${irStr}`);
            } else {
                console.log(`[IR] No points detected (raw bytes 6-15: ${[...data.slice(6, 16)].map(b => b.toString(16).padStart(2, '0')).join(' ')})`);
            }
        }

        const cursorRaw = calcCursorFromIR(irDots);
        
        let cursor: { x: number; y: number } | null = null;
        if (cursorRaw) {
            const normalized = normalizeCursor(cursorRaw);
            
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
            cursor = lastCursor;
        }

        if (irCursorEnabled && cursor) {
            const nowForCursor = Date.now();
            if (nowForCursor - lastCursorUpdateTime >= 16) {
                lastCursorUpdateTime = nowForCursor;
                
                const screenX = Math.round(cursor.x * screenWidth);
                const screenY = Math.round(cursor.y * screenHeight);
                
                const clampedX = Math.max(0, Math.min(screenWidth - 1, screenX));
                const clampedY = Math.max(0, Math.min(screenHeight - 1, screenY));
                
                if (SetCursorPos) {
                    SetCursorPos(clampedX, clampedY);
                }
            }
        }

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

        broadcast({ type: 'wiiDisconnected', at: Date.now(), reason: String(err) });

        setWiiConnected(false);
        setWiiConnected(false);
        if (keepAliveInterval) clearInterval(keepAliveInterval);

        currentDevice = null;
        isPlayingAudio = false;


        try { device?.close(); } catch { }

        try { device?.close(); } catch { }
        connectWiiRemote();
    });

    device.on('close', () => {
        broadcast({ type: 'wiiDisconnected', at: Date.now(), reason: 'close' });

        setWiiConnected(false);
        if (keepAliveInterval) clearInterval(keepAliveInterval);

        currentDevice = null;
        isPlayingAudio = false;

        setWiiConnected(false);
        if (keepAliveInterval) clearInterval(keepAliveInterval);
    });
}

function parseIR_0x37(data: Buffer): { x: number; y: number }[] {
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

    if (x1 !== 1023 && y1 !== 1023) points.push({ x: x1, y: y1 });
    if (x2 !== 1023 && y2 !== 1023) points.push({ x: x2, y: y2 });
    if (x3 !== 1023 && y3 !== 1023) points.push({ x: x3, y: y3 });
    if (x4 !== 1023 && y4 !== 1023) points.push({ x: x4, y: y4 });

    return points;
}

function calcCursorFromIR(ir: { x: number; y: number }[]): { x: number; y: number } | null {
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
    
    if (ir.length === 1 && lastIrPoints.length >= 2) {
        const [prevA, prevB] = lastIrPoints.slice(0, 2);
        const prevMidX = (prevA.x + prevB.x) / 2;
        const prevMidY = (prevA.y + prevB.y) / 2;
        
        const distToA = Math.abs(ir[0].x - prevA.x) + Math.abs(ir[0].y - prevA.y);
        const distToB = Math.abs(ir[0].x - prevB.x) + Math.abs(ir[0].y - prevB.y);
        
        const halfWidth = Math.abs(prevB.x - prevA.x) / 2;
        const halfHeight = Math.abs(prevB.y - prevA.y) / 2;
        
        let estimatedMidX: number;
        let estimatedMidY: number;
        
        if (distToA < distToB) {
            estimatedMidX = ir[0].x + halfWidth;
            estimatedMidY = ir[0].y + (prevMidY - prevA.y);
        } else {
            estimatedMidX = ir[0].x - halfWidth;
            estimatedMidY = ir[0].y + (prevMidY - prevB.y);
        }
        
        return { x: estimatedMidX, y: estimatedMidY };
    }

    return null;
}

function normalizeCursor(pos: { x: number; y: number }): { x: number; y: number } {
    const xNorm = 1.0 - pos.x / 1024;
    const yNorm = pos.y / 768;
    
    const yAdjusted = (yNorm - 0.1) / 0.8;
    
    return {
        x: Math.max(0, Math.min(1, xNorm)),
        y: Math.max(0, Math.min(1, yAdjusted)),
    };
}

connectWiiRemote();