#!/usr/bin/env python3
"""WAVファイルを8bit PCM 2kHz モノラル (Signed) に変換"""
import os
import sys
import struct

try:
    import numpy as np
    from scipy.io import wavfile
    from scipy import signal
except ImportError:
    print("必要なライブラリがインストールされていません")
    print("インストール: pip install numpy scipy")
    sys.exit(1)

def convert_wav_to_raw(input_file, output_file, duration_sec=None):
    """WAVを8bit PCM 2kHz モノラル .rawに変換（高品質処理）"""
    print(f"変換中: {input_file} -> {output_file}")
    
    # WAV読み込み
    try:
        sample_rate, audio = wavfile.read(input_file)
        print(f"  元のサンプルレート: {sample_rate} Hz, 形状: {audio.shape}")
    except Exception as e:
        print(f"✗ エラー: {e}")
        return
    
    # ステレオの場合はモノラルに変換
    if len(audio.shape) == 2:
        audio = audio.mean(axis=1)
    
    # float64に変換（高精度処理）
    if audio.dtype.kind == 'f':
        audio = audio.astype(np.float64)
    else:
        # 整数型の場合は正規化
        audio = audio.astype(np.float64) / 32768.0
    
    # DCオフセット除去
    audio = audio - np.mean(audio)
    
    # 時間制限
    if duration_sec:
        max_samples = int(sample_rate * duration_sec)
        audio = audio[:max_samples]
    
    # 2kHzにリサンプリング（Wiiリモコンの制限）
    target_rate = 2000
    
    # アンチエイリアシングフィルタ（カイザー窓）
    nyquist = target_rate / 2
    cutoff = 850  # 850Hz（ナイキストの85%で品質と安全性のバランス）
    
    # 正規化周波数
    w = cutoff / (sample_rate / 2)
    
    # カイザー窓FIRフィルタ（リニアフェーズで歪みなし）
    if w < 1.0:
        numtaps = 101  # フィルタ長
        taps = signal.firwin(numtaps, cutoff, fs=sample_rate, window=('kaiser', 8.0))
        audio = signal.filtfilt(taps, 1.0, audio)
    
    if sample_rate != target_rate:
        # 高品質リサンプリング（window='kaiser'で最高品質）
        from math import gcd
        g = gcd(target_rate, sample_rate)
        up = target_rate // g
        down = sample_rate // g
        audio = signal.resample_poly(audio, up, down, window=('kaiser', 8.0))
    
    # ピーク正規化（-1.0 to 1.0）
    max_val = np.max(np.abs(audio))
    if max_val > 0:
        audio = audio / max_val
    
    # ソフトクリッピング（アナログ的な歪み低減）
    audio = np.tanh(audio * 0.8) / np.tanh(0.8)
    
    # 最終振幅調整（音割れ防止と音量のバランス）
    audio = audio * 0.70
    
    # ディザリング追加（量子化ノイズをホワイトノイズに変換）
    dither = np.random.triangular(-0.5/127, 0, 0.5/127, len(audio))
    audio = audio + dither
    
    # int8 (Signed) に変換（クリッピング）
    audio = np.clip(audio * 127, -128, 127).astype(np.int8)
    
    # rawファイルとして出力
    with open(output_file, 'wb') as f:
        f.write(audio.tobytes())
    
    print(f"✓ 完了: {os.path.getsize(output_file)} bytes")

if __name__ == "__main__":
    print("=" * 60)
    print("まず、MP3ファイルをWAVに変換してください：")
    print("1. https://cloudconvert.com/mp3-to-wav にアクセス")
    print("2. shoot.mp3, Oh.mp3, uxo.mp3 をアップロード")
    print("3. WAVに変換してダウンロード")
    print("4. このフォルダに shot.wav, oh.wav, uxo.wav として配置")
    print("5. このスクリプトを再度実行")
    print("=" * 60)
    print()
    
    # 現在のディレクトリのWAVファイルを変換
    files = [
        ("shot.wav", "shot.raw", 0.5),   # 0.5秒
        ("oh.wav", "oh.raw", 0.8),       # 0.8秒
        ("uxo.wav", "uxo.raw", 0.6),     # 0.6秒
    ]
    
    found = False
    for wav_file, raw_file, duration in files:
        if os.path.exists(wav_file):
            found = True
            convert_wav_to_raw(wav_file, raw_file, duration)
        else:
            print(f"⚠ ファイルが見つかりません: {wav_file}")
    
    if not found:
        print("\nWAVファイルが見つかりませんでした。")
        print("上記の手順でMP3→WAV変換を行ってください。")
