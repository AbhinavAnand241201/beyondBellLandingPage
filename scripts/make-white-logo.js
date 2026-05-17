/**
 * Creates a footer-friendly variant of the logo by recoloring black pixels white.
 * Yellow / orange / transparent pixels are left untouched.
 *
 * Reads:   public/logo.PNG  (the already chroma-keyed transparent logo)
 * Writes:  public/logo-white.PNG
 *
 * Run: node scripts/make-white-logo.js
 */

const path = require('path')
const sharp = require('sharp')

const SRC = path.join(__dirname, '..', 'public', 'logo.PNG')
const OUT = path.join(__dirname, '..', 'public', 'logo-white.PNG')

// Any pixel where every channel is below this threshold is considered "black-ish"
// text and gets repainted white. 70 catches both pure black and dark gray
// anti-aliased edges without disturbing the warm yellow tones.
const BLACK_THRESHOLD = 70

async function main() {
  const img = sharp(SRC).ensureAlpha()
  const { data, info } = await img
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  let recolored = 0

  for (let i = 0; i < data.length; i += channels) {
    // Skip fully-transparent pixels — leave them alone
    if (data[i + 3] === 0) continue

    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    if (r < BLACK_THRESHOLD && g < BLACK_THRESHOLD && b < BLACK_THRESHOLD) {
      data[i] = 255
      data[i + 1] = 255
      data[i + 2] = 255
      recolored++
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(OUT)

  const total = (width * height).toLocaleString()
  console.log(
    `✓ logo-white.PNG — ${width}×${height} (${total} px) · ${recolored.toLocaleString()} black pixels repainted white`
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
