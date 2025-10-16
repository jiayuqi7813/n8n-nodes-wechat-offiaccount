# 使用官方 n8n 镜像作为基础
FROM n8nio/n8n:latest

# 设置工作目录
WORKDIR /data

# 复制构建好的 dist 目录
COPY dist/ ./custom-nodes/

# 设置环境变量
ENV N8N_CUSTOM_EXTENSIONS=/data/custom-nodes

# 暴露端口
EXPOSE 5678

# 启动 n8n
CMD ["n8n", "start"]
