#!/bin/bash
set -e

echo "[INFO] Creating temporary Python environment..."
python3 -m venv .venv
source .venv/bin/activate

echo "[INFO] Installing datasets library..."
pip install datasets > /dev/null 2>&1

echo "[INFO] Downloading SWE-bench-verified-mini from HuggingFace..."
python3 -c "import datasets; ds = datasets.load_dataset('mariushobbhahn/SWE-bench-verified-mini', split='test'); ds.to_json('swe-bench-verified-mini.json')"

echo "[INFO] Deactivating and cleaning up environment..."
deactivate
rm -rf .venv

echo "[INFO] Running importer script..."
bun run scripts/import-swe-mini.ts swe-bench-verified-mini.json

echo "[INFO] Done! Tasks are located in tasks/verified-mini/"
