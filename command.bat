@echo off
docker build --pull --rm -f "server\Dockerfile" -t mat0108/poapi:prod "server"  
docker push mat0108/po-api:prod