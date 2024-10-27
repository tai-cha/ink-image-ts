import { image2sixel } from 'sixel';
import { promises as fs } from 'fs';

export async function convertToSixel(src: string | Buffer, width: number, height: number, maxColors = 256): Promise<string> {
  let data: Uint8Array;

  if (typeof src === 'string') {
    const buffer = await fs.readFile(src);
    data = new Uint8Array(buffer);
  } else {
    data = new Uint8Array(src);
  }

  return image2sixel(data, width, height, maxColors);
}
