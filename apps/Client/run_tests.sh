#!/bin/bash
set -e

docker build -f Dockerfile-test -t client-app .
docker run --rm -v $(pwd)/coverage:/usr/src/client-app/coverage client-app