# 构建阶段：用 Node 打包 React 项目
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段：用 Nginx 托管静态文件
FROM nginx:alpine
# 1. 复制构建产物
COPY --from=build /app/build /usr/share/nginx/html
# 2. 从构建阶段复制 nginx.conf（最关键的一步！）
COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]