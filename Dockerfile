# =========================
# 构建阶段：React 打包
# =========================
FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# =========================
# 运行阶段：Nginx
# =========================
FROM nginx:1.27-alpine


# 删除默认 nginx 页面
RUN rm -rf /usr/share/nginx/html/*


# 复制 React 构建产物
COPY --from=build /app/build /usr/share/nginx/html


# 覆盖 nginx 配置
COPY nginx.conf.prod /etc/nginx/nginx.conf


# 创建运行目录
RUN mkdir -p \
    /usr/local/nginx/https \
    /var/cache/nginx \
    /var/log/nginx \
    /run/nginx


# 保证 nginx 可以写临时文件
RUN chmod 1777 /tmp


# 暴露端口
EXPOSE 80
EXPOSE 443


# 前台启动
CMD ["nginx", "-g", "daemon off;"]