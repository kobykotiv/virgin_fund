import fs from 'fs';
import { AudioContext, OscillatorNode } from 'web-audio-api';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class SoundGenerator {
  private context: AudioContext;
  private sampleRate = 44100;

  constructor() {
    this.context = new AudioContext();
  }

  private async generateBuffer(duration: number, fn: (t: number) => number): Promise<Buffer> {
    const samples = Math.floor(this.sampleRate * duration);
    const buffer = new Float32Array(samples);

    for (let i = 0; i < samples; i++) {
      const t = i / this.sampleRate;
      buffer[i] = fn(t);
    }

    // Convert to 16-bit PCM
    const pcm = new Int16Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      pcm[i] = Math.max(-32768, Math.min(32767, Math.floor(buffer[i] * 32767)));
    }

    // Create WAV header
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeInt32LE(36 + pcm.length * 2, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeInt32LE(16, 16);
    header.writeInt16LE(1, 20);
    header.writeInt16LE(1, 22);
    header.writeInt32LE(this.sampleRate, 24);
    header.writeInt32LE(this.sampleRate * 2, 28);
    header.writeInt16LE(2, 32);
    header.writeInt16LE(16, 34);
    header.write('data', 36);
    header.writeInt32LE(pcm.length * 2, 40);

    return Buffer.concat([header, Buffer.from(pcm.buffer)]);
  }

  async generateTrade(): Promise<Buffer> {
    return this.generateBuffer(0.1, (t) => {
      const freq = 800 + Math.exp(-t * 20) * 400;
      return Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 10);
    });
  }

  async generateProfit(): Promise<Buffer> {
    return this.generateBuffer(0.3, (t) => {
      const f1 = 400 + t * 400;
      const f2 = 600 + t * 600;
      return (
        (Math.sin(2 * Math.PI * f1 * t) + Math.sin(2 * Math.PI * f2 * t)) *
        0.5 *
        Math.exp(-t * 5)
      );
    });
  }

  async generateLoss(): Promise<Buffer> {
    return this.generateBuffer(0.3, (t) => {
      const f1 = 800 - t * 400;
      const f2 = 1200 - t * 600;
      return (
        (Math.sin(2 * Math.PI * f1 * t) + Math.sin(2 * Math.PI * f2 * t)) *
        0.5 *
        Math.exp(-t * 5)
      );
    });
  }

  async generateMilestone(): Promise<Buffer> {
    return this.generateBuffer(0.5, (t) => {
      const f1 = 523.25; // C5
      const f2 = 659.25; // E5
      const f3 = 783.99; // G5
      return (
        (Math.sin(2 * Math.PI * f1 * t) +
          Math.sin(2 * Math.PI * f2 * t) +
          Math.sin(2 * Math.PI * f3 * t)) *
        0.33 *
        Math.exp(-t * 4)
      );
    });
  }

  async generateError(): Promise<Buffer> {
    return this.generateBuffer(0.2, (t) => {
      const f1 = 400;
      const f2 = 300;
      return (
        (Math.sin(2 * Math.PI * f1 * t) + Math.sin(2 * Math.PI * f2 * t)) *
        0.5 *
        Math.pow(Math.sin(Math.PI * 5 * t), 2) *
        Math.exp(-t * 8)
      );
    });
  }
}

async function main() {
  const generator = new SoundGenerator();
  const publicDir = join(__dirname, '..', 'public', 'sounds');

  // Create directory if it doesn't exist
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Generate and save sound files
  const sounds = {
    trade: await generator.generateTrade(),
    profit: await generator.generateProfit(),
    loss: await generator.generateLoss(),
    milestone: await generator.generateMilestone(),
    error: await generator.generateError(),
  };

  for (const [name, buffer] of Object.entries(sounds)) {
    fs.writeFileSync(join(publicDir, `${name}.wav`), buffer);
    console.log(`Generated ${name}.wav`);
  }
}

main().catch(console.error);
