#!/bin/bash
set -e

docker build -f Dockerfile-test -t server-app .
docker run --rm -v $(pwd)/publish:/usr/src/server-app/publish server-app