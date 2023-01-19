FROM node:16 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Update npm | Install pnpm | Set PNPM_HOME | Install global packages
RUN npm i -g npm@latest; \
    # Install pnpm
    npm install -g pnpm; \
    pnpm --version; \
    pnpm setup; \
    mkdir -p /usr/local/share/pnpm &&\
    export PNPM_HOME="/usr/local/share/pnpm" &&\
    export PATH="$PNPM_HOME:$PATH"; \
    pnpm bin -g &&\
    # Install dependencies
    pnpm add -g @nestjs/cli &&\
    pnpm install &&\
    pnpm dlx prisma generate 

COPY . .
    

# Build
RUN pnpm run build

FROM node:16

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]