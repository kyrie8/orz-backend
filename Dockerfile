FROM node:18-alpine

# 执行命令，创建文件夹
RUN mkdir -p /nestjs

WORKDIR /nestjs
COPY package*.json ./

RUN touch .env
RUN echo "DB_HOST=127.0.0.0\nDB_PORT=3306\nDB_USER=root\nDB_PASSWORD=123456\nDB_DATABASE=nest\nSECRET=test123456" >> .env
# 安装项目依赖包
COPY . ./
RUN npm ci
RUN npm run build

# 容器对外暴露的端口号
EXPOSE 3001

# 容器启动时执行的命令，类似npm run start
CMD ["node", "dist/main.js"]