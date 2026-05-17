#!/usr/bin/env bash
# Compresses oversized demo videos so they fit under GitHub's 100MB limit.
# Idempotent — only compresses files > 95MB.
#
# Requires ffmpeg:  brew install ffmpeg

set -euo pipefail

cd "$(dirname "$0")/.."

THRESHOLD_MB=95
# CRF 28 = good quality for screen-recorded demos at small filesize.
# Bump down to 26 for higher quality, up to 30 for smaller files.
CRF=28

compress_one() {
  local file="$1"
  local size_mb
  size_mb=$(stat -f%z "$file" 2>/dev/null | awk '{ printf "%.0f", $1/1024/1024 }')

  if [ "$size_mb" -le "$THRESHOLD_MB" ]; then
    echo "✓ $file is already $size_mb MB — skipping."
    return
  fi

  echo "⚙  Compressing $file ($size_mb MB)..."
  local tmp="${file%.mp4}.tmp.mp4"

  ffmpeg -hide_banner -loglevel error -y \
    -i "$file" \
    -c:v libx264 -crf "$CRF" -preset medium \
    -c:a aac -b:a 96k \
    -movflags +faststart \
    -pix_fmt yuv420p \
    "$tmp"

  mv "$tmp" "$file"
  local new_size_mb
  new_size_mb=$(stat -f%z "$file" | awk '{ printf "%.0f", $1/1024/1024 }')
  echo "✓ $file is now $new_size_mb MB."
}

for f in public/*.mp4; do
  compress_one "$f"
done

echo ""
echo "Done. Final sizes:"
ls -lah public/*.mp4
