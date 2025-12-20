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
    """WAVを8bit PCM 2kHz モノラル .rawに変換"""
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
    
    # float型の場合は整数に変換
    if audio.dtype.kind == 'f':
        audio = (audio * 32767).astype(np.int16)
    
    # 時間制限
    if duration_sec:
        max_samples = int(sample_rate * duration_sec)
        audio = audio[:max_samples]
    
    # 2kHzにリサンプリング（Wiiリモコンの制限）
    target_rate = 2000
    
    # エイリアシングノイズを防ぐためのローパスフィルタ
    # ナイキスト周波数 (1000Hz) に近づけてより多くの周波数を保持
    nyquist = target_rate / 2
    cutoff = 950  # 950Hz以下を通す（より多くの高音域を保持）
    
    # 正規化周波数
    w = cutoff / (sample_rate / 2)
    
    # 8次バターワースフィルタ（より急峻なカットオフで品質向上）
    if w < 1.0:
        b, a = signal.butter(8, w, 'low')
        audio = signal.filtfilt(b, a, audio)
    
    if sample_rate != target_rate:
        num_samples = int(len(audio) * target_rate / sample_rate)
        # 高品質リサンプリング
        audio = signal.resample_poly(audio, target_rate, sample_rate)
    
    # 正規化して8bit符号付きPCMに変換 (-128 to 127)
    audio = audio.astype(np.float32)
    max_val = np.max(np.abs(audio))
    if max_val > 0:
        audio = audio / max_val * 0.85  # 音量を上げつつ音割れを防止 (0.85)
    
    # int8 (Signed) に変換
    audio = (audio * 127).astype(np.int8)
    
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
