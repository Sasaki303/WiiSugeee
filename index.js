const HID = require("node-hid");
const robot = require("robotjs");
const effects = require("./effects");

const VENDOR_ID = 0x057e;
const PRODUCT_ID = 0x0330; // Wiiリモコンプラス

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const devices = HID.devices().filter(
    d => d.vendorId === VENDOR_ID && d.productId === PRODUCT_ID
  );

  if (devices.length === 0) {
    console.log("Wiiリモコンが見つかりません");
    return;
  }

  const device = new HID.HID(devices[0].path);
  console.log("接続成功");

  // LED ON
  device.write([0x11, 0x10]);
  await sleep(100);

  // Extension 初期化
  device.write([0x16, 0x04, 0xA4, 0x00]);
  await sleep(100);

  // MotionPlus 有効化
  device.write([0x16, 0x04, 0xA6, 0x00]);
  await sleep(50);
  device.write([0x16, 0x04, 0xA6, 0x04]);
  await sleep(100);

  // レポートモード：ボタン + ジャイロ
  device.write([0x12, 0x00, 0x35]);
  console.log("受信開始");

  let prev = {};

  device.on("data", data => {
    if (data[0] !== 0x35) return;

    const b1 = data[1];
    const b2 = data[2];

    const right = !!(b1 & 0x02);
    const left  = !!(b1 & 0x01);
    const btn1  = !!(b2 & 0x02);
    const btn2  = !!(b2 & 0x01);

    // -----------------
    // スライド操作
    // -----------------
    if (right && !prev.right) {
      robot.keyTap("right");
      console.log("▶ 次のスライド");
    }

    if (left && !prev.left) {
      robot.keyTap("left");
      console.log("◀ 前のスライド");
    }

    // -----------------
    // エフェクト
    // -----------------
    if (btn1 && !prev.btn1) {
      effects.clap();
      console.log("👏 拍手");
    }

    if (btn2 && !prev.btn2) {
      effects.sparkle();
      console.log("✨ エフェクト");
    }

    // -----------------
    // ジャイロ表示
    // -----------------
    const yaw   = ((data[3] << 8) | data[4]) & 0x3FFF;
    const pitch = ((data[5] << 8) | data[6]) & 0x3FFF;
    const roll  = ((data[7] << 8) | data[8]) & 0x3FFF;

    console.clear();
    console.log(`Gyro YPR: ${yaw}, ${pitch}, ${roll}`);

    prev = { right, left, btn1, btn2 };
  });
}

main();
