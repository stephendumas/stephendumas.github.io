#!/usr/bin/env bash
# Export the approved artwork without redrawing or changing its colors.
# Optional maintainer tool; ImageMagick is not needed to build the Jekyll site.
set -euo pipefail

favicon_source_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
favicon_master="$favicon_source_root/assets/icons/favicon-master.png"

if command -v magick >/dev/null 2>&1; then
  favicon_converter=magick
elif command -v convert >/dev/null 2>&1; then
  favicon_converter=convert
else
  printf '%s\n' 'ImageMagick is required to regenerate the favicon exports.' >&2
  exit 1
fi

for favicon_size in 16 32 48; do
  "$favicon_converter" "$favicon_master" -filter Lanczos \
    -resize "${favicon_size}x${favicon_size}" -strip \
    "$favicon_source_root/assets/icons/favicon-${favicon_size}.png"
done

"$favicon_converter" \
  "$favicon_source_root/assets/icons/favicon-16.png" \
  "$favicon_source_root/assets/icons/favicon-32.png" \
  "$favicon_source_root/assets/icons/favicon-48.png" \
  "$favicon_source_root/favicon.ico"

"$favicon_converter" "$favicon_master" -filter Lanczos -resize 180x180 \
  -strip "$favicon_source_root/assets/icons/apple-touch-icon.png"

printf '%s\n' 'Exported favicon.ico, 16/32/48px PNGs, and the 180px touch icon.'
