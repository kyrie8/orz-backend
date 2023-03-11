FROM node:18-alpine

# 执行命令，创建文件夹
RUN mkdir -p /nestjs

WORKDIR /nestjs
COPY package*.json ./
# 安装项目依赖包
RUN npm install
COPY . ./
RUN npm run build
# 容器对外暴露的端口号
EXPOSE 3001

# 容器启动时执行的命令
CMD ["node", "dist/main.js"]