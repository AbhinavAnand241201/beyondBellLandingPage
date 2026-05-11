/**
 * Strips the near-white background from each Bello PNG.
 * Reads the originals from _originals/ and writes the transparent
 * versions back to public/images/bello/ — so this is idempotent
 * (rerun anytime, it always reads the untouched originals).
 *
 * Run:  node scripts/remove-bello-bg.js
 */

const path = require('path')
const sharp = require('sharp')

const FILES = [
  'bello-hero',
  'bello-relaxed',
  'bello-reading',
  'bello-confident',
  'bello-happy',
]

const BELLO_DIR = path.join(__dirname, '..', 'public', 'images', 'bello')
const SRC_DIR = path.join(BELLO_DIR, '_originals')

// Distance from pure white below which a pixel is fully transparent.
const HARD = 18
// Distance above which alpha is fully preserved.
const SOFT = 55

async function processOne(name) {
  const src = path.join(SRC_DIR, `${name}.png`)
  const out = path.join(BELLO_DIR, `${name}.png`)

  const img = sharp(src).ensureAlpha()
  const { data, info } = await img
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info

  let transparent = 0
  let edge = 0
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const dist = Math.sqrt(
      (255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2
    )

    if (dist <= HARD) {
      data[i + 3] = 0
      transparent++
    } else if (dist < SOFT) {
      const t = (dist - HARD) / (SOFT - HARD)
      data[i + 3] = Math.round(data[i + 3] * t)
      edge++
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(out)

  const total = (width * height).toLocaleString()
  console.log(
    `✓ ${name}.png — ${width}×${height} (${total} px) · ${transparent.toLocaleString()} fully transparent · ${edge.toLocaleString()} edge-feathered`
  )
}

async function main() {
  console.log('Processing 5 Bello images...\n')
  for (const f of FILES) {
    await processOne(f)
  }
  console.log('\nDone.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
