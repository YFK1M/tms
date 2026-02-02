FROM node:20-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./
COPY packages ./packages
COPY apps/frontend ./apps/frontend

RUN yarn install --frozen-lockfile
RUN yarn workspace frontend build

FROM nginx:alpine
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
