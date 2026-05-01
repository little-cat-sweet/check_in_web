# 构建阶段：用 Node 打包 React 项目
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段：用 Nginx 托管静态文件
FROM nginx:alpine

# 1. 复制打包好的前端文件到 Nginx 网站目录
COPY --from=build /app/build /usr/share/nginx/html

# 2. 复制你写好的 nginx.conf 到容器里（最稳妥的方式）
COPY nginx.conf.prod /etc/nginx/nginx.conf

# 3. 创建证书目录（避免启动报错）
RUN mkdir -p /usr/local/nginx/https

# 暴露 80 和 443 端口
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]