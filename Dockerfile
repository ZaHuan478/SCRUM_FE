FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY index.html vite.config.ts tsconfig*.json postcss.config.cjs tailwind.config.cjs eslint.config.js ./
COPY public ./public
COPY src ./src

ARG VITE_API_BASE_URL=/api
ARG VITE_API_URL=/api
ARG VITE_BACKEND_URL=
ARG VITE_GOOGLE_CLIENT_ID=

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL} \
    VITE_API_URL=${VITE_API_URL} \
    VITE_BACKEND_URL=${VITE_BACKEND_URL} \
    VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}

RUN npm run build

FROM nginx:1.27-alpine

ENV SCRUM_BE_ORIGIN=http://host.docker.internal:3000

RUN rm /etc/nginx/conf.d/default.conf \
    && mkdir -p /etc/nginx/templates \
    && printf '%s\n' \
      'map $http_upgrade $connection_upgrade {' \
      '  default upgrade;' \
      "  '' close;" \
      '}' \
      '' \
      'server {' \
      '  listen 80;' \
      '  server_name _;' \
      '  root /usr/share/nginx/html;' \
      '  index index.html;' \
      '' \
      '  location /api/ {' \
      '    proxy_pass ${SCRUM_BE_ORIGIN};' \
      '    proxy_http_version 1.1;' \
      '    proxy_set_header Host $host;' \
      '    proxy_set_header X-Real-IP $remote_addr;' \
      '    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' \
      '    proxy_set_header X-Forwarded-Proto $scheme;' \
      '  }' \
      '' \
      '  location /socket.io/ {' \
      '    proxy_pass ${SCRUM_BE_ORIGIN};' \
      '    proxy_http_version 1.1;' \
      '    proxy_set_header Upgrade $http_upgrade;' \
      '    proxy_set_header Connection $connection_upgrade;' \
      '    proxy_set_header Host $host;' \
      '    proxy_set_header X-Real-IP $remote_addr;' \
      '    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' \
      '    proxy_set_header X-Forwarded-Proto $scheme;' \
      '  }' \
      '' \
      '  location / {' \
      '    try_files $uri $uri/ /index.html;' \
      '  }' \
      '}' \
      > /etc/nginx/templates/default.conf.template

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
