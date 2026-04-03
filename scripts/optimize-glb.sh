#!/usr/bin/env bash
# optimize-glb.sh — Post-process a raw Blender GLB export for use in three-dreams.
#
# Usage:
#   ./scripts/optimize-glb.sh <input.glb> [output.glb]
#
# If output is omitted, strips any trailing resolution tag (-2k, -4k, -8k) from the name
# and writes to the same directory.
#
# Output settings:
#   - Textures: WebP, max 1024px (good quality at typical camera distances)
#   - Mesh/anim: meshopt compression (decompressed by Three.js MeshoptDecoder)
#   - Skipping join/flatten/simplify to preserve skinned-mesh hierarchy & animations
#
# KTX2 note (better VRAM efficiency, requires external binary):
#   Install KTX-Software 4.3.0+ from https://github.com/KhronosGroup/KTX-Software
#   then replace --texture-compress webp with --texture-compress ktx2
#
# Examples:
#   ./scripts/optimize-glb.sh ~/Downloads/npc-mother-35yo-4k.glb public/characters/npc/npc-mother-35yo.glb
#   ./scripts/optimize-glb.sh ~/Downloads/npc-elder-2k.glb          # auto-names → npc-elder.glb in same dir

set -euo pipefail

INPUT="${1:-}"
if [[ -z "$INPUT" ]]; then
  echo "Usage: $0 <input.glb> [output.glb]" >&2
  exit 1
fi

if [[ -n "${2:-}" ]]; then
  OUTPUT="$2"
else
  # Strip resolution tag: -2k -4k -8k -1k before .glb
  DIR="$(dirname "$INPUT")"
  BASENAME="$(basename "$INPUT" .glb)"
  STRIPPED="${BASENAME//-2k/}"
  STRIPPED="${STRIPPED//-4k/}"
  STRIPPED="${STRIPPED//-8k/}"
  STRIPPED="${STRIPPED//-1k/}"
  OUTPUT="$DIR/${STRIPPED}.glb"
fi

echo "Optimizing: $INPUT → $OUTPUT"

npx @gltf-transform/cli optimize "$INPUT" "$OUTPUT" \
  --compress meshopt \
  --texture-compress webp \
  --texture-size 1024 \
  --join false \
  --simplify false \
  --flatten false

echo "Done."
