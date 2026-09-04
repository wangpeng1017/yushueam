#!/bin/bash
# 宇树 EAM 部署脚本（Windows Git Bash 版，与 deploy.sh 同步骤）
# 用法: 在项目目录  bash deploy-win.sh          （默认先 build:mock）
#       bash deploy-win.sh --no-build            （dist 已是最新时跳过构建）
# 目标: 阿里云 8.130.182.148:3010  /var/www/yushu-eam

set -e
cd "$(dirname "$0")"
SERVER="root@8.130.182.148"
REMOTE_PATH="/var/www/yushu-eam"

if [ "$1" != "--no-build" ]; then
  echo "📦 [1/4] 本地构建 (mock 模式)..."
  pnpm build:mock
fi

echo "🗜  [2/4] 打包 dist..."
tar --force-local -czf eam-dist.tgz -C dist .
echo "    大小: $(du -sh eam-dist.tgz | cut -f1)"

echo "🚀 [3/4] 上传到服务器..."
scp -q eam-dist.tgz "$SERVER:/tmp/yushu-eam-dist.tar.gz"
rm -f eam-dist.tgz

echo "🔧 [4/4] 服务器备份 + 覆盖 + nginx reload..."
ssh "$SERVER" "
  set -e
  test -s /tmp/yushu-eam-dist.tar.gz
  BACKUP=${REMOTE_PATH}-backup-\$(date +%Y%m%d-%H%M%S)
  cp -r $REMOTE_PATH \$BACKUP && echo \"    已备份到 \$BACKUP\"
  rm -rf $REMOTE_PATH/assets $REMOTE_PATH/index.html $REMOTE_PATH/favicon.ico $REMOTE_PATH/logo.gif
  tar -xzf /tmp/yushu-eam-dist.tar.gz -C $REMOTE_PATH
  rm -f /tmp/yushu-eam-dist.tar.gz
  nginx -t && nginx -s reload
  ls $REMOTE_PATH
  node -e 'http=require(\"http\");http.get(\"http://127.0.0.1:3010/\",r=>console.log(\"    健康检查 HTTP\",r.statusCode))'
"

echo ""
echo "✅ 部署完成: http://8.130.182.148:3010/eam/npi/npiProject"
