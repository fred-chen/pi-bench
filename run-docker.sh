#!/bin/bash
set -e

# Build the docker image
echo "[INFO] Building pi-bench docker image..."
docker build -t pi-bench-runner .

# Ensure .pi exists in home directory to mount
mkdir -p ~/.pi

# Run the benchmark
# -v $(pwd):/pi-bench:z mounts the pi-bench directory
# -w /pi-bench sets the working directory to pi-bench
echo "[INFO] Running pi-bench inside docker..."
ENV_ARGS=""
if [ -f .env ]; then
    ENV_ARGS="--env-file .env"
fi

docker run --init --rm -it --network host $ENV_ARGS \
    -v "$(pwd):/pi-bench:z" \
    -w /pi-bench \
    pi-bench-runner \
    bun run src/index.ts "$@"
