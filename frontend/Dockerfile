# syntax=docker/dockerfile:1
# Multi-stage: build static assets, serve with nginx.
# For Render Static Site you typically run `npm run build` in CI and upload `dist/`;
# this image is useful when you want a containerized static host or a private registry image.
#
# Build args (set both when API is on another origin, e.g. Render Web Service URL):
#   VITE_API_BASE_URL=https://your-api.onrender.com/api
#   VITE_BACKEND_ORIGIN optional override for /uploads URLs (defaults to origin of VITE_API_BASE_URL)

FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=/api
ARG VITE_BACKEND_ORIGIN=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_BACKEND_ORIGIN=$VITE_BACKEND_ORIGIN

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
