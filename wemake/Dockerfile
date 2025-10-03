FROM node:20-alpine AS development-dependencies-env
COPY package.json package-lock.json /app/
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app

# Build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_API_TIMEOUT=30000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_TIMEOUT=${VITE_API_TIMEOUT}

RUN npm run build

FROM node:20-alpine
ENV NODE_ENV=production
ENV PORT=5173
COPY package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
EXPOSE 5173
CMD ["npm", "run", "start"]
