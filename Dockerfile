FROM node:18-alpine

# 执行命令，创建文件夹
RUN mkdir -p /nestjs

# WORKDIR指令用于设置Dockerfile中的RUN、CMD和ENTRYPOINT指令执行命令的工作目录(默认为/目录)，该指令在Dockerfile文件中可以出现多次，如果使用相对路径则为相对于WORKDIR上一次的值，
# 例如WORKDIR /data，WORKDIR logs，RUN pwd最终输出的当前目录是/data/logs。
WORKDIR /nestjs
COPY package*.json ./

RUN touch .env
RUN echo "DB_HOST=127.0.0.0\nDB_PORT=3306\nDB_USER=root\nDB_PASSWORD=123456\nDB_DATABASE=nest\nSECRET=test123456" >> .env
# 安装项目依赖包
COPY . ./
RUN npm ci
RUN npm run build

# 配置环境变量
#ENV HOST 0.0.0.0
# ENV PORT 3000

# 容器对外暴露的端口号
EXPOSE 3001

# 容器启动时执行的命令，类似npm run start
CMD ["node", "dist/main.js"]