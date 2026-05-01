# 构建阶段：用 Node 打包 React 项目
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段：用 Nginx 托管静态文件
FROM nginx:alpine
# 复制构建产物到 Nginx
COPY --from=build /app/build /usr/share/nginx/html
# 复制自定义的 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]