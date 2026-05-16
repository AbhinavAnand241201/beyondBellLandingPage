/**
 * Strips the near-white background from public/logo.PNG.
 * Backs the original up to public/logo.original.PNG first.
 * Idempotent: rerun anytime, it always reads from the .original.
 *
 * Run:  node scripts/remove-logo-bg.js
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const PUBLIC = path.join(__dirname, '..', 'public')
const SRC = path.join(PUBLIC, 'logo.PNG')
const BACKUP = path.join(PUBLIC, 'logo.original.PNG')

// Logo has a soft cream background — wider tolerance than the mascot.
const HARD = 30
const SOFT = 72

async function main() {
  // Back up once (only if no backup exists).
  if (!fs.existsSync(BACKUP)) {
    fs.copyFileSync(SRC, BACKUP)
    console.log('Backed up original → logo.original.PNG')
  }

  const img = sharp(BACKUP).ensureAlpha()
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
    // Trim transparent margins so the logo's bounding box is tight.
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9 })
    .toFile(SRC)

  const total = (width * height).toLocaleString()
  console.log(
    `✓ logo.PNG — ${width}×${height} (${total} px) · ${transparent.toLocaleString()} fully transparent · ${edge.toLocaleString()} edge-feathered`
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
