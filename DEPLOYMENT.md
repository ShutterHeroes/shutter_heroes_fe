# Shutter Heroes Frontend 배포 가이드

## 목차
- [개요](#개요)
- [사전 요구사항](#사전-요구사항)
- [AWS ECR 설정](#aws-ecr-설정)
- [Docker 이미지 빌드 및 푸시](#docker-이미지-빌드-및-푸시)
- [EC2 환경 설정](#ec2-환경-설정)
- [Docker Compose 구성](#docker-compose-구성)
- [배포 자동화](#배포-자동화)

---

## 개요

이 프로젝트는 Docker를 사용하여 AWS ECR에 이미지를 업로드하고, EC2에서 docker-compose를 통해 배포합니다.

**배포 구성:**
- Frontend (React Router SSR)
- Backend (Spring Boot)
- PostgreSQL Database
- Nginx (리버스 프록시)
- Certbot (SSL 인증서)

**환경:**
- AWS EC2 (Amazon Linux 2)
- Docker & Docker Compose
- AWS ECR (Elastic Container Registry)

---

## 사전 요구사항

### 로컬 환경
- Docker 설치
- AWS CLI 설치 및 구성
- AWS 계정 및 적절한 IAM 권한 (ECR, EC2)

### AWS 정보
- AWS Account ID
- AWS Region (기본: ap-northeast-2)
- EC2 인스턴스 (Amazon Linux 2)

---

## AWS ECR 설정

### 1. ECR 리포지토리 생성

```bash
# AWS CLI로 ECR 리포지토리 생성
aws ecr create-repository --repository-name shutter-heroes-fe --region ap-northeast-2 --image-scanning-configuration scanOnPush=true
```

### 2. 리포지토리 URI 확인

```bash
aws ecr describe-repositories --repository-names shutter-heroes-fe --region ap-northeast-2
```

출력 예시:
```
<AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-2.amazonaws.com/shutter-heroes-fe
```

---

## Docker 이미지 빌드 및 푸시

### 1. 환경 변수 설정

```bash
# 변수 설정 (실제 값으로 변경)
export AWS_REGION=ap-northeast-2
export AWS_ACCOUNT_ID=<your-aws-account-id>
export ECR_REPOSITORY=shutter-heroes-fe
export IMAGE_TAG=latest
export VITE_API_BASE_URL=<your-api-url>  # 예: http://your-domain.com:8080
```

### 2. ECR 로그인

```bash
aws ecr get-login-password --region $AWS_REGION | \
docker login --username AWS --password-stdin \
$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
```

### 3. Docker 이미지 빌드

```bash
cd wemake

docker build \
  --build-arg VITE_API_BASE_URL=$VITE_API_BASE_URL \
  --build-arg VITE_API_TIMEOUT=10000 \
  -t $ECR_REPOSITORY:$IMAGE_TAG \
  -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG \
  .
```

### 4. ECR에 푸시

```bash
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG
```

---

## EC2 환경 설정

### 1. Docker 설치 (최초 1회)

```bash
# EC2 접속 후 실행
sudo yum update -y
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# 재로그인 필요 (또는 newgrp docker)
exit
```

### 2. Docker Compose 설치

```bash
# Docker Compose 설치
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 설치 확인
docker-compose --version
```

### 3. AWS CLI 설치 및 구성

```bash
# AWS CLI 설치
sudo yum install aws-cli -y

# AWS 자격 증명 구성
aws configure
```

### 4. ECR 로그인 (EC2에서)

```bash
AWS_REGION=ap-northeast-2
AWS_ACCOUNT_ID=<your-aws-account-id>

aws ecr get-login-password --region $AWS_REGION | \
sudo docker login --username AWS --password-stdin \
$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
```

### 5. 이미지 Pull

```bash
ECR_REPOSITORY=shutter-heroes-fe
IMAGE_TAG=latest

sudo docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG
```

---

## Docker Compose 구성

### docker-compose.yml 예시

```yaml
version: '3.8'

services:
  frontend:
    image: ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/shutter-heroes-fe:latest
    container_name: shutter-heroes-fe
    restart: unless-stopped
    ports:
      - "3000:3000"
    networks:
      - app-network
    depends_on:
      - backend
    environment:
      - NODE_ENV=production

  backend:
    image: ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/shutter-heroes-be:latest
    container_name: shutter-heroes-be
    restart: unless-stopped
    ports:
      - "8080:8080"
    networks:
      - app-network
    depends_on:
      - postgres
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/shutter_heroes
      - SPRING_DATASOURCE_USERNAME=postgres
      - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}

  postgres:
    image: postgres:15-alpine
    container_name: shutter-heroes-db
    restart: unless-stopped
    ports:
      - "5432:5432"
    networks:
      - app-network
    environment:
      - POSTGRES_DB=shutter_heroes
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data

  nginx:
    image: nginx:alpine
    container_name: nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    networks:
      - app-network
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - certbot-data:/var/www/certbot
    depends_on:
      - frontend
      - backend

  certbot:
    image: certbot/certbot
    container_name: certbot
    volumes:
      - ./nginx/ssl:/etc/letsencrypt
      - certbot-data:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

networks:
  app-network:
    driver: bridge

volumes:
  postgres-data:
  certbot-data:
```

### .env 파일 (EC2에서)

```bash
# .env
AWS_ACCOUNT_ID=<your-account-id>
AWS_REGION=ap-northeast-2
DB_PASSWORD=<your-database-password>
```

### 실행

```bash
# 환경 변수 로드 및 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 상태 확인
docker-compose ps
```

---

## 배포 자동화

### 1. 로컬 배포 스크립트 (deploy.sh)

```bash
#!/bin/bash
set -e

# 설정
AWS_REGION=ap-northeast-2
AWS_ACCOUNT_ID=<your-account-id>
ECR_REPOSITORY=shutter-heroes-fe
IMAGE_TAG=$(date +%Y%m%d-%H%M%S)
VITE_API_BASE_URL=<your-api-url>

echo "🔨 Building Docker image..."
cd wemake
docker build \
  --build-arg VITE_API_BASE_URL=$VITE_API_BASE_URL \
  --build-arg VITE_API_TIMEOUT=10000 \
  -t $ECR_REPOSITORY:$IMAGE_TAG \
  -t $ECR_REPOSITORY:latest \
  -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG \
  -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest \
  .

echo "🔐 Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | \
docker login --username AWS --password-stdin \
$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo "📤 Pushing to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest

echo "✅ Deploy completed! Image: $IMAGE_TAG"
```

**사용법:**

```bash
chmod +x deploy.sh
./deploy.sh
```

### 2. EC2 업데이트 스크립트 (update.sh)

```bash
#!/bin/bash
set -e

AWS_REGION=ap-northeast-2
AWS_ACCOUNT_ID=<your-account-id>
ECR_REPOSITORY=shutter-heroes-fe

echo "🔐 Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | \
sudo docker login --username AWS --password-stdin \
$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo "📥 Pulling latest image..."
sudo docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest

echo "🔄 Restarting services..."
sudo docker-compose down
sudo docker-compose up -d

echo "🧹 Cleaning up unused images..."
sudo docker image prune -f

echo "✅ Update completed!"
```

**사용법:**

```bash
chmod +x update.sh
./update.sh
```

### 3. 전체 배포 프로세스

```bash
# 1. 로컬에서 빌드 및 푸시
./deploy.sh

# 2. EC2에서 업데이트
ssh ec2-user@<ec2-ip>
cd /path/to/project
./update.sh
```

---

## 트러블슈팅

### ECR 로그인 만료
```bash
# 로그인 다시 시도
aws ecr get-login-password --region ap-northeast-2 | \
docker login --username AWS --password-stdin \
<account-id>.dkr.ecr.ap-northeast-2.amazonaws.com
```

### 이미지 빌드 실패
```bash
# 캐시 없이 빌드
docker build --no-cache -t shutter-heroes-fe .
```

### 컨테이너 로그 확인
```bash
# 특정 서비스 로그
docker-compose logs -f frontend

# 모든 로그
docker-compose logs -f
```

### 디스크 공간 정리
```bash
# 사용하지 않는 이미지 삭제
docker image prune -a

# 사용하지 않는 볼륨 삭제
docker volume prune

# 전체 정리
docker system prune -a
```

---

## 보안 고려사항

1. **환경 변수 관리**
   - `.env` 파일은 절대 커밋하지 않기
   - AWS Systems Manager Parameter Store 또는 Secrets Manager 사용 권장

2. **IAM 권한 최소화**
   - ECR 푸시/풀에 필요한 최소 권한만 부여

3. **포트 보안**
   - EC2 보안 그룹에서 필요한 포트만 개방
   - 80, 443 (Nginx), 필요시 SSH (22)

4. **SSL 인증서**
   - Certbot을 통한 Let's Encrypt SSL 인증서 자동 갱신

---

## 참고 자료

- [Docker 공식 문서](https://docs.docker.com/)
- [AWS ECR 문서](https://docs.aws.amazon.com/ecr/)
- [Docker Compose 문서](https://docs.docker.com/compose/)
- [React Router 배포 가이드](https://reactrouter.com/en/main/guides/deployment)
