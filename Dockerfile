FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY tsconfig.json ./
COPY src ./src

# Install tsx for running TypeScript directly
RUN npm install -g tsx

EXPOSE 3010

CMD ["tsx", "src/index.ts"]
