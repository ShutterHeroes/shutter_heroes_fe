#!/bin/bash

# SSL 인증서 초기 발급 스크립트
# 사용법: ./scripts/init-letsencrypt.sh

set -e

# 설정
domains=(shutter-heroes.site www.shutter-heroes.site)
api_domains=(api.shutter-heroes.site)
ai_domains=(ai.shutter-heroes.site)
rsa_key_size=4096
data_path="./data/certbot"
email="leehh0221@gmail.com"  # ← 이메일 주소로 변경하세요
staging=0  # 1로 설정하면 테스트 모드 (staging)

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Let's Encrypt 초기 설정 시작 ===${NC}"

# 기존 인증서가 있는지 확인
if [ -d "$data_path/conf/live/${domains[0]}" ]; then
  echo -e "${YELLOW}경고: 기존 인증서가 존재합니다.${NC}"
  read -p "기존 인증서를 삭제하고 새로 발급하시겠습니까? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "작업이 취소되었습니다."
    exit 1
  fi
  echo -e "${YELLOW}기존 인증서 삭제 중...${NC}"
  sudo rm -rf "$data_path"
fi

# 필요한 디렉토리 생성
echo -e "${GREEN}디렉토리 구조 생성 중...${NC}"
mkdir -p "$data_path/conf/live/${domains[0]}"
mkdir -p "$data_path/www"

# 더미 인증서 생성 (Nginx 초기 구동용)
echo -e "${GREEN}더미 인증서 생성 중...${NC}"
path="/etc/letsencrypt/live/${domains[0]}"
docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1 \
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot

# API 도메인용 더미 인증서
path="/etc/letsencrypt/live/${api_domains[0]}"
mkdir -p "$data_path/conf/live/${api_domains[0]}"
docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1 \
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot

# AI 도메인용 더미 인증서 (선택사항)
path="/etc/letsencrypt/live/${ai_domains[0]}"
mkdir -p "$data_path/conf/live/${ai_domains[0]}"
docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1 \
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot

# TLS 파라미터 다운로드 (Let's Encrypt 권장 설정)
echo -e "${GREEN}TLS 파라미터 다운로드 중...${NC}"
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"

# Nginx 시작
echo -e "${GREEN}Nginx 컨테이너 시작 중...${NC}"
docker-compose up -d nginx

# 더미 인증서 삭제
echo -e "${GREEN}더미 인증서 삭제 중...${NC}"
docker-compose run --rm --entrypoint "\
  rm -rf /etc/letsencrypt/live/${domains[0]} && \
  rm -rf /etc/letsencrypt/archive/${domains[0]} && \
  rm -rf /etc/letsencrypt/renewal/${domains[0]}.conf" certbot

docker-compose run --rm --entrypoint "\
  rm -rf /etc/letsencrypt/live/${api_domains[0]} && \
  rm -rf /etc/letsencrypt/archive/${api_domains[0]} && \
  rm -rf /etc/letsencrypt/renewal/${api_domains[0]}.conf" certbot

docker-compose run --rm --entrypoint "\
  rm -rf /etc/letsencrypt/live/${ai_domains[0]} && \
  rm -rf /etc/letsencrypt/archive/${ai_domains[0]} && \
  rm -rf /etc/letsencrypt/renewal/${ai_domains[0]}.conf" certbot

# 실제 인증서 발급 - Frontend
echo -e "${GREEN}실제 인증서 발급 중 (Frontend)...${NC}"
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $domain_args \
    --email $email \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --no-eff-email \
    --force-renewal" certbot

# 실제 인증서 발급 - API
echo -e "${GREEN}실제 인증서 발급 중 (API)...${NC}"
domain_args=""
for domain in "${api_domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $domain_args \
    --email $email \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --no-eff-email \
    --force-renewal" certbot

# 실제 인증서 발급 - AI (선택사항)
echo -e "${GREEN}실제 인증서 발급 중 (AI)...${NC}"
domain_args=""
for domain in "${ai_domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $domain_args \
    --email $email \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --no-eff-email \
    --force-renewal" certbot

# Nginx 재시작
echo -e "${GREEN}Nginx 재시작 중...${NC}"
docker-compose exec nginx nginx -s reload

echo -e "${GREEN}=== SSL 인증서 발급 완료! ===${NC}"
echo -e "${YELLOW}다음 명령어로 인증서를 확인하세요:${NC}"
echo "docker-compose run --rm certbot certificates"
