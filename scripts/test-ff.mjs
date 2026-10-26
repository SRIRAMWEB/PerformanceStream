import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'child_process';

const ffmpeg = spawn(ffmpegPath, ['-version']);
ffmpeg.stdout.on('data', d => console.log(d.toString().split('\n')[0]));
ffmpeg.on('close', code => console.log('Exited with code:', code));
