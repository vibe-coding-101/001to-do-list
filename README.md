# 待办事项列表应用 (To-Do List App)

> 一个简单高效的待办事项列表应用,帮助您更好地管理日常任务。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.4.21-brightgreen)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.0-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1.6-646CFF)](https://vitejs.dev/)

---

## 项目简介

待办事项列表应用是一个基于 Vue 3 + TypeScript + Vite 构建的单页应用(SPA),具有以下特点:

- ✅ 简洁直观的用户界面
- ✅ 流畅的动画和交互体验
- ✅ 数据本地存储(LocalStorage)
- ✅ 响应式设计,支持移动端和桌面端
- ✅ 任务优先级、过滤、搜索等功能
- ✅ 无需后端服务,即开即用

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue 3 | 3.4.21 | 渐进式 JavaScript 框架 |
| TypeScript | 5.4.0 | JavaScript 的超集,提供类型安全 |
| Vite | 5.1.6 | 下一代前端构建工具 |
| Pinia | 2.1.7 | Vue 3 官方推荐的状态管理库 |
| ESLint | 8.57.0 | 代码检查工具 |
| Prettier | 3.2.5 | 代码格式化工具 |

---

## 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
cd src/frontend
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

---

## 部署

本项目支持多种部署方式,详见 [部署指南](docs/devops-engineer/deploy-guide.md)。

### 推荐部署方式

1. **Vercel**(推荐)
   - 零配置,自动 HTTPS
   - [部署教程](docs/devops-engineer/deploy-guide.md#31-方案一vercel-部署推荐)

2. **Netlify**
   - 拖拽部署,简单易用
   - [部署教程](docs/devops-engineer/deploy-guide.md#32-方案二netlify-部署)

3. **GitHub Pages**
   - 完全免费,适合开源项目
   - [部署教程](docs/devops-engineer/deploy-guide.md#33-方案三github-pages-部署)

4. **Docker**
   - 适合企业环境和自有服务器
   - [部署教程](docs/devops-engineer/deploy-guide.md#34-方案四docker-部署)

---

## 功能特性

### 核心功能

- ✅ 创建、编辑、删除任务
- ✅ 标记任务完成/未完成
- ✅ 设置任务优先级(高/中/低)
- ✅ 过滤任务(全部/未完成/已完成)
- ✅ 数据本地持久化
- ✅ 响应式设计

### 用户体验

- ✅ 流畅的动画效果
- ✅ 友好的空状态提示
- ✅ 键盘快捷键支持
- ✅ 无障碍访问(ARIA)
- ✅ 深色模式(计划中)

---

## 项目结构

```
.
├── docs/                          # 项目文档
│   ├── devops-engineer/          # 运维文档
│   ├── software-architect/       # 架构文档
│   ├── test-engineer/            # 测试文档
│   └── ui-ux-designer/           # 设计文档
├── src/
│   └── frontend/                 # 前端源代码
│       ├── components/           # Vue 组件
│       ├── stores/               # Pinia Store
│       ├── services/             # 业务逻辑
│       ├── types/                # TypeScript 类型
│       ├── utils/                # 工具函数
│       └── assets/               # 静态资源
├── .github/workflows/            # CI/CD 配置
├── Dockerfile                    # Docker 配置
├── docker-compose.yml            # Docker Compose 配置
└── README.md                     # 项目说明
```

---

## 文档

- [系统架构文档](docs/software-architect/architecture.md)
- [数据模型文档](docs/software-architect/data-model.md)
- [设计规范文档](docs/ui-ux-designer/design-spec.md)
- [测试报告](docs/test-engineer/test-report.md)
- [部署指南](docs/devops-engineer/deploy-guide.md)
- [部署日志](docs/devops-engineer/deploy-log.md)

---

## 开发指南

### 代码规范

本项目使用 ESLint 和 Prettier 保证代码质量:

```bash
# 代码检查
npm run lint

# 代码格式化
npm run format
```

### 类型检查

```bash
npm run type-check
```

---

## 贡献指南

欢迎贡献代码!请遵循以下步骤:

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 许可证

本项目采用 MIT 许可证,详见 [LICENSE](LICENSE) 文件。

---

## 联系方式

- 项目地址: https://github.com/vibe-coding-101/001to-do-list
- 问题反馈: https://github.com/vibe-coding-101/001to-do-list/issues

---

## 更新日志

### v0.2.0 (2026-04-01)

**新增功能**
- ✨ 任务搜索功能
  - 实时搜索任务描述（200ms 防抖）
  - 搜索关键词长度限制（50 字符）
  - ESC 键快速清空搜索框
  - 清除按钮（有内容时显示）
  - 不区分大小写的模糊匹配
  - 搜索无结果时显示友好提示

**用户体验优化**
- 🎨 搜索框响应式设计
  - 桌面端：240px 宽度，与标题和过滤器横向排列
  - 移动端：100% 宽度，独占一行，位于标题下方
- 🎯 搜索与过滤器集成
  - 搜索和状态过滤可以叠加使用
  - 先缩小搜索范围，再应用状态过滤
  - 搜索结果优先级标签正确显示

**安全增强**
- 🔒 XSS 防护加强
  - 禁止使用 `v-html` 渲染用户输入
  - 所有用户输入通过 Vue 自动转义
  - 搜索关键词长度验证（最大 50 字符）
  - 优先级值运行时验证（只接受高/中/低）

**测试覆盖**
- ✅ 14 个测试用例，100% 通过率
- ✅ 功能测试、集成测试、响应式测试全部通过
- ✅ 边界测试和安全验证通过
- ✅ 性能测试：首屏加载 ~632ms，搜索响应 ~50ms

**文档更新**
- 📝 更新测试报告至 v2.0
- 📝 完善前端开发说明文档
- 📝 添加安全验证报告

### v0.1.1 (2026-03-31)

**Bug 修复**
- 🐛 修复 Docker 容器 unhealthy 问题
  - 添加 HEALTHCHECK 指令到 Dockerfile
  - 使用 wget 检查 HTTP 服务健康状态（每 30 秒，超时 3 秒）
  - start-period 5 秒，retries 3 次
  - 容器状态现在正确显示为 healthy

**文档更新**
- 📝 统一所有文档版本号为 v0.1.1
- 📝 与 git 分支版本保持一致

### v0.1.0 (2026-03-31)

- ✅ 初始版本发布
- ✅ 实现核心任务管理功能
- ✅ 数据本地持久化
- ✅ 响应式设计
- ✅ 完整的文档和测试

---

**最后更新**: 2026-03-31
