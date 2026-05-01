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
# 把你前端项目里的 nginx.conf 复制到容器内部
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露 80 和 443 端口（因为你用了 HTTPS）
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]