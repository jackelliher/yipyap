
import sounddevice as sd
from scipy.io import wavfile
import numpy as np
import time
from datetime import datetime

def record_audio(duration=5, sample_rate=44100):
    """
    Record audio from the default microphone.
    
    Args:
        duration (int): Recording duration in seconds
        sample_rate (int): Sample rate in Hz
    """
    print(f"Recording for {duration} seconds...")
    
    # Record audio
    recording = sd.rec(
        int(duration * sample_rate),
        samplerate=sample_rate,
        channels=1,
        dtype=np.int16
    )
    
    # Wait for the recording to complete
    sd.wait()
    
    return recording, sample_rate

def save_audio(recording, sample_rate):
    """
    Save the recorded audio to a WAV file.
    
    Args:
        recording (numpy.ndarray): The recorded audio data
        sample_rate (int): Sample rate in Hz
    """
    # Generate filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"recording_{timestamp}.wav"
    
    # Save as WAV file
    wavfile.write(filename, sample_rate, recording)
    print(f"Recording saved as: {filename}")

def main():
    try:
        # Show available devices
        print("Available audio devices:")
        print(sd.query_devices())
        print("\nUsing default input device...")
        
        # Record audio (5 seconds by default)
        duration = 5
        recording, sample_rate = record_audio(duration=duration)
        
        # Save the recording
        save_audio(recording, sample_rate)
        
    except Exception as e:
        print(f"Error occurred: {str(e)}")

if __name__ == "__main__":
    main()
