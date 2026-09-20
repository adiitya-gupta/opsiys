const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function buildIcons() {
  const sourceImage = path.join(__dirname, '../public/logos/opsiyslogo.png');
  const publicDir = path.join(__dirname, '../public');

  console.log('Generating resized PNG favicons from source logo...');

  // 1. Generate exact dimensioned PNGs
  const sizes = [
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'favicon-96x96.png', size: 96 },
    { name: 'favicon-192x192.png', size: 192 },
    { name: 'favicon-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'apple-touch-icon-precomposed.png', size: 180 },
    { name: 'logo.png', size: 512 },
    { name: 'favicon.png', size: 192 }
  ];

  for (const item of sizes) {
    const outputPath = path.join(publicDir, item.name);
    await sharp(sourceImage)
      .resize(item.size, item.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outputPath);
    console.log(`Generated ${item.name} (${item.size}x${item.size}) - Size: ${fs.statSync(outputPath).size} bytes`);
  }

  // 2. Generate authentic Microsoft ICO file containing 16x16, 32x32, 48x48 frames
  console.log('Building authentic Microsoft ICO format favicon.ico...');
  const frameSizes = [16, 32, 48];
  const frames = [];

  for (const s of frameSizes) {
    const buf = await sharp(sourceImage)
      .resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    frames.push({ size: s, buffer: buf });
  }

  // Calculate ICO header & entry offsets
  const numImages = frames.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + (dirEntrySize * numImages);

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // ICO Type
  header.writeUInt16LE(numImages, 4); // Image count

  const entries = [];
  const imageBuffers = [];

  for (const frame of frames) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(frame.size >= 256 ? 0 : frame.size, 0); // Width
    entry.writeUInt8(frame.size >= 256 ? 0 : frame.size, 1); // Height
    entry.writeUInt8(0, 2); // Palette colors
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(frame.buffer.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset of image data

    entries.push(entry);
    imageBuffers.push(frame.buffer);
    offset += frame.buffer.length;
  }

  const icoBuffer = Buffer.concat([header, ...entries, ...imageBuffers]);
  const icoPath = path.join(publicDir, 'favicon.ico');
  fs.writeFileSync(icoPath, icoBuffer);

  console.log(`Generated valid favicon.ico - Size: ${fs.statSync(icoPath).size} bytes`);
  console.log('Favicon magic header check:', fs.readFileSync(icoPath).slice(0, 4));
}

buildIcons().catch(err => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
