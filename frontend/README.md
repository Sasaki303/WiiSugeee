This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Wiiコントローラ連携フック

このプロジェクトには、Wiiリモコンの入力を受け取るカスタム React フック `useWiiController` が追加されています。主な特徴と使い方は以下の通りです。

- WebSocket 経由で Wii 入力を受信します（デフォルト: `ws://localhost:8080`）。
- 返り値はオブジェクトで、`wiiState`（現在の状態）と `pressed`（「このフレームで押されたボタン」）を受け取れます。
- `pressed` はフレーム単位で押下を一度だけ検出するための補助フィールドです。複数の入力更新が描画更新より高速な場合でも取りこぼしを防ぐためにバッファリングしてから 30fps 相当で更新されます。

### 型と構造（参考）

- `wiiState` の例:
  - `buttons`: A, B, One, Two, Plus, Minus, Home, Up, Down, Right, Left（各 boolean）
  - `accel`: 加速度 ({ x, y, z })
  - `ir`: 赤外線座標の配列
- `pressed`: `wiiState.buttons` の部分集合で、当該フレームで押されたボタンに `true` が入ります。

### 簡単な利用例

```tsx
import { useWiiController } from "@/hooks/useWiiController";

function MyComponent() {
  const { wiiState, pressed } = useWiiController();

  // 例: A ボタンがこのフレームで押されたか
  if (pressed.A) {
    // 処理
  }

  return <div>接続状態: {wiiState ? '接続中' : '未接続'}</div>;
}
```

### 注意点

- ローカルで WebSocket サーバ（Wii 入力をブリッジするサーバ）が必要です。デフォルトでは `ws://localhost:8080` に接続します。
- TypeScript を使用している場合、フックの型定義は `frontend/src/hooks/useWiiController.ts` に記載されています。
