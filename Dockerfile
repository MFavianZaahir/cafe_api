FROM node:22

WORKDIR /usr/src/app

COPY . .

RUN npm bun install

# RUN bun run build

EXPOSE 3001

CMD ["bun", "run", "start:dev"]