# 部署指南

**项目名称**: 待办事项列表应用 (To-Do List App)
**文档版本**: v0.1.1
**创建日期**: 2026-03-31
**运维工程师**: 小虾米

---

## 1. 部署方式选择

### 1.1 推荐方案对比

| 部署方式 | 难度 | 成本 | 优点 | 缺点 | 推荐场景 |
|---------|------|------|------|------|---------|
| **Vercel** | ⭐ 零配置 | 免费 | 自动 HTTPS、全球 CDN、零配置 | 需要连接 GitHub | 个人项目、快速上线 |
| **Netlify** | ⭐ 零配置 | 免费 | 拖拽部署、Form 处理 | 需要连接 GitHub | 个人项目、快速上线 |
| **GitHub Pages** | ⭐⭐ 低 | 免费 | 完全免费、集成 GitHub | 自定义域名需手动配置 | 开源项目 |
| **Docker + Nginx** | ⭐⭐⭐ 中 | 低(需服务器) | 完全控制、可扩展 | 需要服务器维护 | 企业环境、自有服务器 |
| **传统服务器 + Nginx** | ⭐⭐⭐ 中 | 低(需服务器) | 完全控制 | 需要手动构建部署 | 传统环境 |

### 1.2 推荐方案

**个人项目 / 快速上线**: Vercel
- 零配置,连接 GitHub 仓库即可自动部署
- 自动 HTTPS 和全球 CDN
- 免费额度充足

**开源项目**: GitHub Pages
- 完全免费
- 与 GitHub 深度集成

**企业环境 / 自有服务器**: Docker
- 完全控制部署环境
- 易于扩展和维护

---

## 2. 环境要求

### 2.1 开发环境

| 依赖 | 版本要求 | 说明 |
|------|---------|------|
| Node.js | >= 18.0.0 | JavaScript 运行时 |
| npm | >= 9.0.0 | 包管理器 |
| Git | >= 2.0 | 版本控制 |

### 2.2 Docker 部署环境

| 依赖 | 版本要求 | 说明 |
|------|---------|------|
| Docker | >= 20.10 | 容器运行时 |
| Docker Compose | >= 2.0 | 容器编排 |
| 服务器 | 1 CPU / 1GB RAM | 最低配置 |

### 2.3 传统服务器部署环境

| 依赖 | 版本要求 | 说明 |
|------|---------|------|
| Nginx | >= 1.18 | Web 服务器 |
| Node.js | >= 18.0.0 | 构建时需要 |

---

## 3. 部署步骤

### 3.1 方案一: Vercel 部署(推荐)

#### 3.1.1 前置准备

1. 注册 Vercel 账号: https://vercel.com
2. 安装 Vercel CLI(可选)
   ```bash
   npm install -g vercel
   ```

#### 3.1.2 部署步骤

**方式一: 通过 GitHub 连接(推荐)**

1. 登录 Vercel,点击 "Add New Project"
2. 导入 GitHub 仓库
3. 配置项目:
   - **Framework Preset**: Vite
   - **Root Directory**: src/frontend
   - **Build Command**: npm run build
   - **Output Directory**: dist
4. 点击 "Deploy"

**方式二: 通过 CLI 部署**

```bash
# 进入前端目录
cd src/frontend

# 首次部署
vercel

# 生产部署
vercel --prod
```

#### 3.1.3 环境变量配置

Vercel 无需配置环境变量(应用使用 LocalStorage,无后端)。

#### 3.1.4 自定义域名(可选)

1. 在 Vercel 项目设置中添加域名
2. 配置 DNS 记录:
   - 类型: CNAME
   - 名称: todo(或 your subdomain)
   - 值: cname.vercel-dns.com
3. 等待 SSL 证书自动生成

#### 3.1.5 验证部署

访问部署 URL,确认:
- ✅ 页面正常加载
- ✅ 可以创建任务
- ✅ 刷新页面数据不丢失
- ✅ HTTPS 正常工作

---

### 3.2 方案二: Netlify 部署

#### 3.2.1 前置准备

1. 注册 Netlify 账号: https://netlify.com
2. 安装 Netlify CLI(可选)
   ```bash
   npm install -g netlify-cli
   ```

#### 3.2.2 部署步骤

**方式一: 通过 GitHub 连接(推荐)**

1. 登录 Netlify,点击 "Add new site" → "Import an existing project"
2. 导入 GitHub 仓库
3. 配置构建设置:
   - **Build command**: npm run build
   - **Publish directory**: src/frontend/dist
   - **Base directory**: src/frontend (可选)
4. 点击 "Deploy site"

**方式二: 拖拽部署**

```bash
# 本地构建
cd src/frontend
npm install
npm run build

# 将 dist 目录拖拽到 Netlify 部署页面
```

#### 3.2.3 创建 netlify.toml 配置文件(可选)

在项目根目录创建 `netlify.toml`:

```toml
[build]
  base = "src/frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 3.2.4 验证部署

同 Vercel 验证步骤。

---

### 3.3 方案三: GitHub Pages 部署

#### 3.3.1 前置准备

1. 确保仓库为 Public(或 GitHub Pro)
2. 启用 GitHub Pages:
   - Settings → Pages
   - Source 选择 GitHub Actions

#### 3.3.2 配置 GitHub Actions

已在 `.github/workflows/deploy.yml` 中配置。

确保仓库配置:
- Settings → Secrets → 添加 `GITHUB_TOKEN`(自动可用)

#### 3.3.3 构建配置(可选)

在 `src/frontend/vite.config.ts` 中添加 base 配置:

```typescript
export default defineConfig({
  base: '/repo-name/', // 替换为你的仓库名
  plugins: [vue()],
})
```

#### 3.3.4 部署

推送到 main 分支后自动部署:
```bash
git add .
git commit -m "Update app"
git push origin main
```

#### 3.3.5 访问应用

访问地址: `https://username.github.io/repo-name/`

---

### 3.4 方案四: Docker 部署

#### 3.4.1 前置准备

1. 准备服务器(Ubuntu/CentOS/Debian)
2. 安装 Docker 和 Docker Compose
3. 确保防火墙开放 80 和 443 端口

#### 3.4.2 构建镜像

```bash
# 克隆仓库
git clone https://github.com/yourusername/todo-list-app.git
cd todo-list-app

# 构建镜像
docker build -t todo-list-app:latest .

# 或使用 docker-compose 构建
docker-compose build
```

#### 3.4.3 启动服务

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 3.4.4 配置 HTTPS(可选)

使用 Certbot 获取免费 SSL 证书:

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

更新 `nginx.conf` 以支持 HTTPS。

#### 3.4.5 验证部署

```bash
# 检查容器状态
docker-compose ps

# 检查健康状态
curl http://localhost/

# 查看日志
docker-compose logs frontend
```

---

### 3.5 方案五: 传统服务器 + Nginx 部署

#### 3.5.1 前置准备

1. 准备服务器
2. 安装 Nginx
3. 安装 Node.js(构建时使用)

#### 3.5.2 构建应用

```bash
# 克隆仓库
git clone https://github.com/yourusername/todo-list-app.git
cd todo-list-app/src/frontend

# 安装依赖
npm install

# 构建应用
npm run build
```

#### 3.5.3 配置 Nginx

创建 Nginx 配置文件 `/etc/nginx/sites-available/todo-app`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/todo-app;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Vue Router history 模式
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 3.5.4 部署文件

```bash
# 创建部署目录
sudo mkdir -p /var/www/todo-app

# 复制构建产物
sudo cp -r dist/* /var/www/todo-app/

# 设置权限
sudo chown -R www-data:www-data /var/www/todo-app

# 启用站点
sudo ln -s /etc/nginx/sites-available/todo-app /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 3.5.5 配置 HTTPS(可选)

使用 Certbot:

```bash
sudo certbot --nginx -d yourdomain.com
```

---

## 4. 验证方法

### 4.1 功能验证

| 验证项 | 验证方法 | 预期结果 |
|--------|---------|---------|
| 页面加载 | 访问首页 | 正常显示,无控制台错误 |
| 创建任务 | 输入任务并回车 | 任务出现在列表中 |
| 标记完成 | 点击复选框 | 任务状态切换,时间戳更新 |
| 编辑任务 | 点击编辑按钮 | 进入编辑模式,可保存 |
| 删除任务 | 点击删除按钮 | 任务从列表移除 |
| 数据持久化 | 刷新页面 | 任务数据不丢失 |
| 过滤功能 | 切换过滤器 | 任务列表按状态过滤 |
| 响应式 | 调整浏览器宽度 | 移动端/桌面端布局正常 |

### 4.2 性能验证

| 指标 | 工具 | 目标值 |
|------|------|--------|
| 首屏加载 | Chrome DevTools | < 2s |
| Lighthouse 性能 | Lighthouse | > 90 |
| 操作响应 | 手动测试 | < 100ms |

### 4.3 安全验证

| 验证项 | 验证方法 | 预期结果 |
|--------|---------|---------|
| HTTPS | 访问 https:// | 正常工作,无证书警告 |
| 安全头 | curl -I | 包含 X-Frame-Options 等头 |
| XSS 防护 | 输入 `<script>alert(1)</script>` | 被转义,不执行 |

---

## 5. 监控与告警

### 5.1 健康检查

**Docker 部署**:
```bash
# 检查容器状态
docker-compose ps

# 检查健康状态
curl http://localhost/
```

**传统部署**:
```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 检查站点响应
curl -I http://yourdomain.com
```

### 5.2 日志查看

**Docker 部署**:
```bash
# 查看实时日志
docker-compose logs -f frontend

# 查看最近 100 行
docker-compose logs --tail=100 frontend
```

**传统部署**:
```bash
# Nginx 访问日志
sudo tail -f /var/log/nginx/access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 5.3 告警配置

建议配置以下告警:
- 站点不可访问(HTTP 5xx/4xx)
- 响应时间超过 5s
- 服务器 CPU/内存使用率 > 80%

推荐工具:
- Uptime Robot(免费)
- Pingdom
- Cloudflare Analytics

---

## 6. 回滚方案

### 6.1 Vercel 回滚

1. 登录 Vercel 控制台
2. 进入项目 → Deployments
3. 找到要回滚的版本,点击 "Promote to Production"

### 6.2 Docker 回滚

```bash
# 停止当前服务
docker-compose down

# 切换到旧版本镜像
docker tag todo-list-app:v0.1.1 todo-list-app:latest

# 启动服务
docker-compose up -d
```

### 6.3 传统部署回滚

```bash
# 备份当前版本
sudo cp -r /var/www/todo-app /var/www/todo-app.backup

# 恢复旧版本
sudo cp -r /backups/todo-app-v0.1.1/* /var/www/todo-app/

# 重启 Nginx
sudo systemctl restart nginx
```

---

## 7. 常见问题

### 7.1 部署后页面空白

**原因**: 路由配置错误
**解决**: 检查 Nginx 配置中的 `try_files` 指令

### 7.2 静态资源 404

**原因**: Base 路径配置错误
**解决**: 检查 `vite.config.ts` 中的 `base` 配置

### 7.3 LocalStorage 数据丢失

**原因**: 浏览器隐私模式或存储限制
**解决**: 提示用户关闭隐私模式或清理存储

### 7.4 Docker 容器无法启动

**原因**: 端口被占用
**解决**:
```bash
# 检查端口占用
sudo lsof -i :80

# 停止占用进程
sudo systemctl stop nginx
```

---

## 8. 优化建议

### 8.1 性能优化

- 启用 CDN 加速
- 配置浏览器缓存
- 使用 Gzip/Brotli 压缩
- 图片懒加载

### 8.2 安全加固

- 强制 HTTPS
- 配置 CSP 头
- 定期更新依赖
- 启用 HSTS

### 8.3 CI/CD 优化

- 添加自动化测试
- 配置多环境部署
- 实现蓝绿部署
- 添加性能监控

---

## 9. 联系方式

如有部署问题,请联系:
- **运维工程师**: 小虾米
- **文档版本**: v0.1.1
- **最后更新**: 2026-03-31

---

**文档结束**
