# YipYap

A voice-to-text application that records audio from your microphone, transcribes it using OpenAI's Whisper, and allows you to edit the text before sending it to Claude for a response.

## Features

- Records audio from system microphone
- Transcribes speech using OpenAI's Whisper API
- Opens vim for text editing
- Sends edited text to Claude AI for responses
- Temporary file handling for secure operation

## Prerequisites

- Node.js (v18 or higher)
- System audio recording tools:
  - Linux: `sox` (`sudo apt-get install sox`)
  - macOS: `sox` (`brew install sox`)
- vim text editor
- OpenAI API key
- Anthropic API key

## Installation

1. Install system dependencies:
```bash
sudo make install
```

2. Set up your environment variables:
```bash
cp .env.example .env
```

3. Edit `.env` with your API keys:
```
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

## Usage

Start the application:
```bash
yipyap
```

The application will:
1. Record audio from your microphone, pressing spacebar when you wish to stop
2. Transcribe the audio using Whisper
3. Open vim for editing the transcription
4. Send your edited text to Claude
5. Display Claude's response
```

Filepath: README.md
Replace lines: 46-78
```markdown
## Project Structure

```
├── src/               # Source code
├── Makefile          # Installation commands
└── package.json      # Project configuration
```
```

## Scripts

- `npm run build` - Compiles TypeScript to JavaScript
- `npm start` - Runs the compiled application
- `npm run dev` - Runs the application in development mode with hot reload

## Dependencies

- `node-record-lpcm16` - Audio recording
- `openai` - Whisper API client
- `@anthropic-ai/sdk` - Claude API client
- `date-fns` - Timestamp formatting

## Development

To work on the project:

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Run in development mode:
```bash
npm run dev
```

## Building from Source

To build and install manually:
```bash
npm run build
sudo make install
```
## Development Dependencies

- `typescript` - For TypeScript support
- `ts-node` - For running TypeScript files directly
- `ts-node-dev` - For development with auto-reload
- Various TypeScript type definitions (@types/*)

## Troubleshooting

1. Make sure your microphone is properly connected and set as the default input device
2. Verify that Sox is installed correctly: `sox --version`
3. Check microphone permissions in your system settings
4. Verify your API keys are correctly set in `.env`
5. Ensure vim is installed: `vim --version`
6. For recording issues:
   ```bash
   # Test microphone with sox
   rec test.wav
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.

