FROM node:16.14.0

# 执行命令，创建文件夹
RUN mkdir -p /home/nestjs

# 将根目录下的文件都copy到container（运行此镜像的容器）文件系统的文件夹下
COPY /nest /home/nestjs

# WORKDIR指令用于设置Dockerfile中的RUN、CMD和ENTRYPOINT指令执行命令的工作目录(默认为/目录)，该指令在Dockerfile文件中可以出现多次，如果使用相对路径则为相对于WORKDIR上一次的值，
# 例如WORKDIR /data，WORKDIR logs，RUN pwd最终输出的当前目录是/data/logs。
# cd到 /home/nodeNestjs
WORKDIR /home/nestjs

# 安装项目依赖包
RUN npm install
RUN npm run build

# 配置环境变量
ENV HOST 0.0.0.0
ENV PORT 3000

# 容器对外暴露的端口号(笔者的nestjs运行的端口号是3000)
EXPOSE 3000

# 容器启动时执行的命令，类似npm run start
CMD ["node", "/home/nestjs/dist/main.js"]

#这docker file写的不好，要重写的