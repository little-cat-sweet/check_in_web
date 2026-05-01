# 构建阶段：用 Node 打包 React 项目
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段：用 Nginx 托管静态文件
FROM nginx:alpine
# 复制打包好的前端文件到 Nginx 网站目录
COPY --from=build /app/build /usr/share/nginx/html

# 直接在镜像里写入 nginx.conf（100% 不会再报文件找不到）
RUN cat > /etc/nginx/nginx.conf << 'EOF'
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    # HTTP 服务
    server {
        listen       80;
        server_name  124.223.187.91 www.checkapp.asia;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        location /api/ {
            client_max_body_size 5M;
            rewrite ^/api/(.*) /$1 break;
            proxy_pass http://check-backend:8080/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # HTTPS 服务
    server {
        listen       443 ssl;
        server_name  www.checkapp.asia;

        ssl_certificate     /usr/local/nginx/https/checkapp.asia_bundle.pem;
        ssl_certificate_key /usr/local/nginx/https/checkapp.asia.key;

        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;
        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        location /api/ {
            client_max_body_size 5M;
            proxy_pass http://check-backend:8080/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

# 暴露 80 和 443 端口
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]