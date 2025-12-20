# 音声ファイル変換手順

## 方法1: オンラインコンバータ（最も簡単）

1. https://cloudconvert.com/mp3-to-raw にアクセス
2. MP3ファイル（shoot.mp3, Oh.mp3, uxo.mp3）をアップロード
3. 設定:
   - Audio Codec: PCM
   - Sample Rate: 2000 Hz
   - Channels: 1 (mono)
   - Bit Depth: 8
4. 変換後、`shot.raw`, `oh.raw`, `uxo.raw`にリネーム
5. このフォルダに配置

## 方法2: FFmpegポータブル版

1. https://github.com/BtbN/FFmpeg-Builds/releases からダウンロード
2. `ffmpeg-master-latest-win64-gpl.zip`を解凍
3. `ffmpeg.exe`のパスを確認
4. PowerShellで以下を実行:

```powershell
# ffmpeg.exeのパスを指定（例）
$ffmpeg = "C:\path\to\ffmpeg.exe"

# 変換
& $ffmpeg -i shoot.mp3 -t 0.5 -ar 2000 -ac 1 -f s8 shot.raw
& $ffmpeg -i Oh.mp3 -t 0.8 -ar 2000 -ac 1 -f s8 oh.raw
& $ffmpeg -i uxo.mp3 -t 0.6 -ar 2000 -ac 1 -f s8 uxo.raw
```

## 現在の状態

- ✓ MP3ファイル配置済み（shoot.mp3, Oh.mp3, uxo.mp3）
- ⚠ rawファイル未作成（shot.raw, oh.raw, uxo.raw）
- バックエンドは`.raw`ファイルを優先的に読み込み、なければビープ音を生成します
