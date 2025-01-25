import * as dotenv from 'dotenv';
dotenv.config();

import nodeRecordLpcm16 from 'node-record-lpcm16';
import * as fs from 'fs';
import { format } from 'date-fns';
import player from 'play-sound';
import OpenAI from 'openai';

console.log('API Key loaded:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Make sure to set this environment variable
});

class AudioRecorder {
  private player: any;
  private openai: OpenAI;

  constructor() {
    this.player = player();
    this.openai = openai;
  }

  public async transcribeAudio(filename: string): Promise<string> {
    try {
      console.log('Transcribing audio...');

      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(filename),
        model: "whisper-1",
      });

      console.log('Transcription complete!');
      return transcription.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  private generateFilename(): string {
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    return `recording_${timestamp}.wav`;
  }

  public async playAudio(filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`Playing recording: ${filename}`);
      this.player.play(filename, (err: Error) => {
        if (err) {
          console.error('Error playing audio:', err);
          reject(err);
        }
        resolve();
      });
    });
  }

  public async streamRecord(totalDuration: number = 30000, chunkDuration: number = 3000): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Starting continuous recording...');
        console.log('Press Ctrl+C to stop');

        let startTime = Date.now();
        let chunkNumber = 0;

        const processChunk = async (chunkFilename: string) => {
          try {
            const transcription = await this.transcribeAudio(chunkFilename);
            if (transcription.trim()) {
              console.log(`[${chunkNumber}] ${transcription}`);
            }
          } catch (error) {
            console.error('Error processing chunk:', error);
          } finally {
            fs.unlinkSync(chunkFilename);
          }
        };

        while (Date.now() - startTime < totalDuration) {
          const chunkFilename = `chunk_${chunkNumber}_${this.generateFilename()}`;

          // Record a chunk
          const recording = nodeRecordLpcm16.record({
            sampleRate: 44100,
            channels: 1,
            audioType: 'wav',
            recorder: 'sox',
          });

          const fileStream = fs.createWriteStream(chunkFilename);
          recording.stream().pipe(fileStream);

          // Wait for chunk duration
          await new Promise(resolve => setTimeout(resolve, chunkDuration));

          // Stop recording this chunk
          recording.stop();
          fileStream.end();

          // Process chunk in background
          processChunk(chunkFilename);

          chunkNumber++;
        }

        console.log('Recording complete!');
        resolve();

      } catch (error) {
        console.error('Error in continuous recording:', error);
        reject(error);
      }
    });
  }
}

async function main() {

  try {
    const recorder = new AudioRecorder();

    // Start streaming recording for 30 seconds, processing in 3-second chunks
    await recorder.streamRecord(30000, 3000);

  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);

  }
}

// Run the application
if (require.main === module) {
  main();
}

export default AudioRecorder;

