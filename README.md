# Audio Recorder

A Node.js application written in TypeScript that records audio from your system's default microphone and saves it as a WAV file.

## Features

- Records audio using system default microphone
- Saves recordings as WAV files with timestamps
- High-quality audio recording (44.1kHz sample rate, 16-bit depth)
- Mono channel recording
- TypeScript for type safety and better development experience

## Prerequisites

- Node.js (v14 or higher)
- System audio recording tools:
  - Linux: `sox` (`sudo apt-get install sox`)
  - macOS: `sox` (`brew install sox`)
  - Windows: Download and install Sox manually

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd audio-recorder
```

2. Install dependencies:
```bash
npm install
```

## Usage

Start the application:
```bash
# Development mode with auto-reload
npm run dev

# Production build and run
npm run build
npm start
```

The application will:
1. Start recording from your default microphone
2. Record for 5 seconds
3. Save the recording as a WAV file with a timestamp (e.g., `recording_20240215_143022.wav`)

## Project Structure

```
├── src/
│   └── main.ts         # Main application code
├── dist/               # Compiled JavaScript files
├── package.json        # Project dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Scripts

- `npm run build` - Compiles TypeScript to JavaScript
- `npm start` - Runs the compiled application
- `npm run dev` - Runs the application in development mode with hot reload

## Dependencies

- `node-audio-recorder` - For audio recording functionality
- `wav` - For WAV file creation
- `date-fns` - For timestamp formatting

## Development Dependencies

- `typescript` - For TypeScript support
- `ts-node` - For running TypeScript files directly
- `ts-node-dev` - For development with auto-reload
- Various TypeScript type definitions (@types/*)

## Troubleshooting

1. Make sure your microphone is properly connected and set as the default input device
2. Verify that Sox is installed correctly for your operating system
3. Check microphone permissions in your system settings
4. If you get permission errors, try running with elevated privileges

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.

