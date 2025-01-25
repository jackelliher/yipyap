import * as dotenv from 'dotenv';
dotenv.config();

import nodeRecordLpcm16 from 'node-record-lpcm16';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { format } from 'date-fns';
import * as readline from 'readline';
import { exec } from 'child_process';
import { promisify } from 'util';
import Anthropic from '@anthropic-ai/sdk';

import OpenAI from 'openai';
import { TextBlock } from '@anthropic-ai/sdk/resources';

const execAsync = promisify(exec);

console.log('API Key loaded:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Make sure to set this environment variable
});

class AudioRecorder {
  private openai: OpenAI;
  private anthropic: Anthropic;
  private tempDir: string;

  constructor() {
    this.openai = openai;
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.tempDir = path.join(os.tmpdir(), 'yipyap-recordings');
    // Ensure temp directory exists
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
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
    return path.join(this.tempDir, `recording_${timestamp}.wav`);
  }

  public async record(): Promise<string> {
    let filename: string = this.generateFilename();
    return new Promise((resolve, reject) => {
      try {
        console.log('Recording... Press spacebar to stop');

        // Configure and start recording
        const recording = nodeRecordLpcm16.record({
          sampleRate: 44100,
          channels: 1,
          audioType: 'wav',
          recorder: 'sox',  // or 'arecord' for Linux
        });

        // Create write stream
        const fileStream = fs.createWriteStream(filename);

        // Pipe the audio to file
        recording.stream().pipe(fileStream);

        // Handle recording errors
        recording.stream().on('error', (err: Error) => {
          console.error('Recording error:', err);
          if (filename && fs.existsSync(filename)) {
            fs.unlinkSync(filename);
          }
          reject(err);
        });

        // Setup keypress detection
        readline.emitKeypressEvents(process.stdin);
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(true);
        }

        process.stdin.on('keypress', (_str, key) => {
          if (key.name === 'space') {
            recording.stop();
            fileStream.end();
            if (process.stdin.isTTY) {
              process.stdin.setRawMode(false);
            }
            console.log(`\nRecording saved as: ${filename}`);
            resolve(filename);
          } else if (key.ctrl && key.name === 'c') {
            process.exit();
          }
        });

      } catch (error) {
        console.error('Error setting up recording:', error);
        if (filename && fs.existsSync(filename)) {
          fs.unlinkSync(filename);
        }
        reject(error);
      }
    });
  }
}

async function launchVimEditor(text: string): Promise<string> {
  const tmpFile = path.join(os.tmpdir(), `yipyap-edit-${Date.now()}.txt`);
  fs.writeFileSync(tmpFile, text);

  try {
    // Reset terminal settings
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    
    // Use spawn instead of exec to properly handle interactive processes
    const { spawn } = require('child_process');
    await new Promise((resolve, reject) => {
      const vim = spawn('vim', [tmpFile], {
        stdio: 'inherit' // This connects vim to the terminal
      });

      vim.on('exit', (code: number) => {
        if (code === 0) resolve(null);
        else reject(new Error(`vim exited with code ${code}`));
      });
    });

    const editedContent = fs.readFileSync(tmpFile, 'utf-8');
    return editedContent;
  } finally {
    if (fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
  }
}

async function askClaude(text: string): Promise<string> {
  const response = await new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  }).messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: text,
    }],
  });

  if (response.content[0].type === 'text') {
    return (response.content[0] as TextBlock).text;
  }
  throw new Error('Expected text block');
}

async function main() {
  let filename: string | undefined = undefined;
  try {
    const recorder = new AudioRecorder();

    // Record audio
    console.log("Starting recording...");
    filename = await recorder.record();

    // Transcribe the audio
    const transcription = await recorder.transcribeAudio(filename);
    console.log("\nTranscription:");
    console.log(transcription);

  // Launch vim for editing
  console.log("\nLaunching vim for editing. Press :wq to save and exit...");
  const editedText = await launchVimEditor(transcription);
  
  // Send to Claude and get response
  console.log("\nSending to Claude...");
  const claudeResponse = await askClaude(editedText);
  
  console.log("\nClaude's Response:");
  console.log("----------------------------------------");
  console.log(claudeResponse);
  console.log("----------------------------------------");
  
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  } finally {
    if (filename && fs.existsSync(filename)) {
      fs.unlinkSync(filename);
      console.log('Cleaned up recording file');
    }
  }
}

// Run the application
if (require.main === module) {
  main();
}

export default AudioRecorder;
