FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY packages ./packages
COPY apps/backend ./apps/backend

RUN yarn install --frozen-lockfile

WORKDIR /app/apps/backend

RUN yarn prisma generate

CMD ["sh", "-c", "yarn prisma migrate deploy && yarn start"]
