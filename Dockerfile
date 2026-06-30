# Estágio 1: Build da aplicação
FROM node:24-alpine AS builder
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./
RUN npm ci

# Copia o restante dos arquivos do projeto
COPY . .

# Executa o build do Vite + esbuild (gerando a pasta dist/)
RUN npm run build

# Estágio 2: Execução leve em produção
FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
# Instala apenas dependências de produção para economizar espaço
RUN npm ci --only=production

# Copia os arquivos buildados do estágio anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/src/types.ts ./src/types.ts

# Expõe a porta 3000 (a mesma do seu server.ts)
EXPOSE 3000

# Define o ambiente como produção
ENV NODE_ENV=production

# Comando para iniciar o servidor Express
CMD ["npm", "run", "start"]
