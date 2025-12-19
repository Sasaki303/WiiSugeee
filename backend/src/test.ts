import HID from "node-hid";

// WiiリモコンのID
const VENDOR_ID = 0x057e;
const PRODUCT_ID = 0x0306;      // 初期型
const PRODUCT_ID_PLUS = 0x0330; // MotionPlus

console.log("Searching Wii Remote...");

// デバイス探索
const devices = HID.devices().filter(
	d =>
		d.vendorId === VENDOR_ID &&
		(d.productId === PRODUCT_ID || d.productId === PRODUCT_ID_PLUS)
);

if (devices.length === 0) {
	console.error("❌ Wii Remote not found");
	process.exit(1);
}

console.log(`Found ${devices.length} device(s)`);

let device: HID.HID | null = null;

// 書き込み可能な interface を探す
for (const dev of devices) {
	if (!dev.path) continue;
	try {
		console.log(`Trying path: ${dev.path}`);
		const d = new HID.HID(dev.path);
		d.write([0x11, 0x10]); // 疎通確認
		device = d;
		console.log("✅ Connected!");
		break;
	} catch {
		// 次へ
	}
}

if (!device) {
	console.error("❌ Could not open any interface");
	process.exit(1);
}

/* =========================
   初期化
========================= */

console.log("Initializing Wii Remote...");

// レポートモード: Buttons + Accel + IR
device.write([0x12, 0x00, 0x37]);

// IR 有効化
device.write([0x13, 0x04]);
device.write([0x1a, 0x04]);

// IR 感度設定（標準）
device.write([0x17, 0x00, 0x30, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00]);
device.write([0x17, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0xaa, 0x64, 0x63, 0x03]);
device.write([0x17, 0x00, 0x1a, 0x00, 0x00, 0x00, 0x00, 0x63, 0x03]);
device.write([0x17, 0x00, 0x33, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x03]);
device.write([0x17, 0x00, 0x30, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x08]);

console.log("✅ Initialization complete");

/* =========================
   データ受信
========================= */

device.on("data", (data: Buffer) => {
	// ボタン
	const b1 = data[1] ?? 0;
	const b2 = data[2] ?? 0;

	const buttons = {
		Left:  !!(b1 & 0x01),
		Right: !!(b1 & 0x02),
		Down:  !!(b1 & 0x04),
		Up:    !!(b1 & 0x08),
		Plus:  !!(b1 & 0x10),
		Two:   !!(b2 & 0x01),
		One:   !!(b2 & 0x02),
		B:     !!(b2 & 0x04),
		A:     !!(b2 & 0x08),
		Minus: !!(b2 & 0x10),
		Home:  !!(b2 & 0x80),
	};

	// 加速度
	const accel = {
		x: data[3],
		y: data[4],
		z: data[5],
	};

	// IR（最大2点）
	const ir = [];
	const ir1x = (data[6] | ((data[8] >> 4) & 0x03) << 8);
	const ir1y = (data[7] | ((data[8] >> 6) & 0x03) << 8);
	const ir2x = (data[9] | ((data[8] >> 0) & 0x03) << 8);
	const ir2y = (data[10] | ((data[8] >> 2) & 0x03) << 8);

	if (ir1x < 1023 && ir1y < 1023) ir.push({ x: ir1x, y: ir1y });
	if (ir2x < 1023 && ir2y < 1023) ir.push({ x: ir2x, y: ir2y });

	console.clear();
	console.log("=== Wii Remote Data ===");
	console.log("Buttons:", buttons);
	console.log("Accel:", accel);
	console.log("IR:", ir);
});

device.on("error", err => {
	console.error("❌ Device error:", err);
	process.exit(1);
});
