#!/bin/bash

# 간단한 SSL 인증서 발급 스크립트 (이미 docker-compose가 실행 중인 경우)
# 사용법: ./scripts/init-letsencrypt-simple.sh your-email@example.com

set -e

if [ -z "$1" ]; then
  echo "사용법: $0 leehh0221@gmail.com"
  exit 1
fi

EMAIL=$1
STAGING=${2:-0}  # 두 번째 인자로 1을 주면 staging 모드

GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}=== SSL 인증서 발급 시작 ===${NC}"

if [ $STAGING = "1" ]; then
  STAGING_ARG="--staging"
  echo "테스트 모드 (Staging) 사용"
else
  STAGING_ARG=""
fi

# Frontend 도메인
echo -e "${GREEN}1. Frontend 인증서 발급 (shutter-heroes.site)${NC}"
docker-compose run --rm certbot \
  certonly --webroot -w /var/www/certbot \
  $STAGING_ARG \
  -d shutter-heroes.site \
  -d www.shutter-heroes.site \
  --email $EMAIL \
  --rsa-key-size 4096 \
  --agree-tos \
  --no-eff-email \
  --force-renewal

# API 도메인
echo -e "${GREEN}2. API 인증서 발급 (api.shutter-heroes.site)${NC}"
docker-compose run --rm certbot \
  certonly --webroot -w /var/www/certbot \
  $STAGING_ARG \
  -d api.shutter-heroes.site \
  --email $EMAIL \
  --rsa-key-size 4096 \
  --agree-tos \
  --no-eff-email \
  --force-renewal

# AI 도메인 (선택사항)
echo -e "${GREEN}3. AI 인증서 발급 (ai.shutter-heroes.site)${NC}"
docker-compose run --rm certbot \
  certonly --webroot -w /var/www/certbot \
  $STAGING_ARG \
  -d ai.shutter-heroes.site \
  --email $EMAIL \
  --rsa-key-size 4096 \
  --agree-tos \
  --no-eff-email \
  --force-renewal

# Nginx 재시작
echo -e "${GREEN}4. Nginx 재시작${NC}"
docker-compose exec nginx nginx -s reload

echo -e "${GREEN}=== 완료! ===${NC}"
echo "인증서 확인: docker-compose run --rm certbot certificates"
