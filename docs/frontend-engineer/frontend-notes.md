# 前端开发说明文档

**项目名称**: 待办事项列表应用 (To-Do List App)
**技术栈**: Vue 3 + Vite + TypeScript + Pinia
**版本**: v1.0
**创建日期**: 2026-03-31

---

## 1. 环境要求

- **Node.js**: >= 18.0.0
- **包管理器**: npm 或 pnpm

## 2. 本地启动

### 2.1 安装依赖

```bash
cd src/frontend
npm install
```

### 2.2 配置环境变量

```bash
cp .env.example .env
```

当前版本无需修改环境变量，使用默认配置即可。

### 2.3 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动并自动打开浏览器。

### 2.4 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 2.5 预览生产构建

```bash
npm run preview
```

## 3. 目录说明

```
src/frontend/
├── index.html              # HTML 入口文件
├── vite.config.ts          # Vite 配置文件
├── tsconfig.json           # TypeScript 配置文件
├── package.json            # 项目依赖和脚本
├── .env.example            # 环境变量示例
│
└── src/
    ├── main.ts              # 应用入口
    ├── App.vue              # 根组件
    │
    ├── components/          # Vue 组件
    │   ├── TaskInput.vue    # 任务输入框组件
    │   ├── TaskItem.vue     # 单个任务卡片组件
    │   ├── TaskList.vue     # 任务列表容器组件
    │   ├── FilterTabs.vue   # 过滤器 Tab 组件
    │   └── EmptyState.vue   # 空状态提示组件
    │
    ├── stores/              # Pinia 状态管理
    │   ├── task.ts          # 任务状态 Store
    │   └── filter.ts        # 过滤器状态 Store
    │
    ├── types/               # TypeScript 类型定义
    │   ├── task.types.ts    # 任务相关类型
    │   └── storage.types.ts # 存储相关类型
    │
    ├── utils/               # 工具函数
    │   ├── storage.ts       # LocalStorage 封装
    │   ├── validation.ts    # 输入验证
    │   └── constants.ts     # 常量定义
    │
    └── assets/styles/       # 样式文件
        ├── variables.css    # CSS 变量（设计系统）
        ├── reset.css        # 样式重置
        └── global.css       # 全局样式
```

## 4. 环境变量说明

| 变量名 | 说明 | 示例 | 默认值 |
|--------|------|------|--------|
| VITE_APP_TITLE | 应用标题 | 我的待办事项 | - |
| VITE_API_BASE_URL | 后端 API 地址（预留） | http://localhost:8000 | - |

**注意**: 当前版本为纯前端应用，不使用后端 API，所有数据存储在浏览器 LocalStorage 中。

## 5. 已实现页面清单

| 页面 | 路由 | 对应线框图 | 状态 |
|------|------|------------|------|
| 主页 | / | wireframes/main-view.excalidraw | ✅ 完成 |

## 6. 已实现功能清单

### 6.1 核心功能 (MVP v1.0)

- ✅ **创建任务**: 输入任务描述，点击添加或按回车键创建
- ✅ **查看任务列表**: 按创建时间倒序显示所有任务
- ✅ **标记任务完成/未完成**: 点击复选框切换状态
- ✅ **编辑任务**: 点击编辑按钮修改任务内容
- ✅ **删除任务**: 点击删除按钮移除任务
- ✅ **设置优先级**: 创建任务时可设置优先级（高/中/低）
- ✅ **过滤任务**: 按状态过滤（全部/未完成/已完成）
- ✅ **数据持久化**: 所有操作自动保存到 LocalStorage

### 6.2 交互特性

- ✅ **响应式设计**: 支持桌面端和移动端
- ✅ **平滑动画**: 任务添加、删除、状态切换动画
- ✅ **骨架屏**: 首次加载时显示骨架屏
- ✅ **空状态**: 无任务时显示友好提示
- ✅ **错误处理**: 输入验证和错误提示
- ✅ **键盘快捷键**: 回车提交、ESC 取消编辑
- ✅ **无障碍**: ARIA 标签和键盘导航支持

### 6.3 安全特性

- ✅ **XSS 防护**: 不使用 `v-html`，Vue 自动转义用户输入
- ✅ **输入验证**: 任务内容长度限制（1-200 字符）
- ✅ **数据隐私**: 数据仅存储在用户本地，不上传服务器

## 7. 技术实现说明

### 7.1 状态管理 (Pinia)

**任务 Store (useTaskStore)**:
- `state`: tasks, loading, error
- `actions`: loadTasks, addTask, updateTask, deleteTask, toggleTaskStatus
- `getters`: completedTasks, uncompletedTasks, taskCount

**过滤器 Store (useFilterStore)**:
- `state`: currentFilter
- `actions`: loadFilter, setFilter
- `getters`: filterLabel

### 7.2 数据持久化

**LocalStorage Keys**:
- `todo_app_tasks`: 任务列表数据
- `todo_app_filter`: 过滤器状态
- `todo_app_version`: Schema 版本号

**数据结构**:
```typescript
{
  tasks: Task[],
  version: string
}
```

### 7.3 样式系统

**CSS Variables** (按设计规范定义):
- 色彩: 主色、辅助色、中性色、语义色
- 字体: 字号、字重、行高
- 间距: XS (4px) ~ XXL (48px)
- 圆角: XS (2px) ~ Full (9999px)
- 阴影: Level 1 ~ Level 3
- 动画: 快速 (100ms) ~ 慢速 (300ms)

### 7.4 响应式断点

- **Mobile**: < 768px
- **Desktop**: >= 768px

### 7.5 性能优化

- 使用 Vue 3 Composition API 减少响应式开销
- 使用 `computed` 缓存计算结果
- 使用 `TransitionGroup` 优化列表动画
- 本地存储同步 API，无网络延迟

## 8. 开发注意事项

### 8.1 代码规范

- 使用 TypeScript 类型定义
- 组件使用 `<script setup>` 语法
- 样式使用 Scoped CSS
- 遵循 Vue 3 官方风格指南

### 8.2 安全要求

- ❌ **禁止使用 `v-html`**: 防止 XSS 攻击
- ✅ **所有用户输入必须验证**: 使用 `validateTaskInput`
- ✅ **数据自动转义**: Vue 3 默认行为

### 8.3 浏览器兼容性

支持主流浏览器的最新版本：
- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 9. 部署指南

### 9.1 构建生产版本

```bash
npm run build
```

### 9.2 部署平台选项

**Vercel** (推荐):
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
cd src/frontend
vercel
```

**Netlify**:
```bash
# 拖拽 dist/ 目录到 Netlify 部署页面
```

**GitHub Pages**:
```bash
# 构建后推送 dist/ 目录到 gh-pages 分支
```

**传统服务器 + Nginx**:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 10. 故障排查

### 10.1 LocalStorage 不可用

**现象**: 任务无法保存

**原因**: 浏览器禁用了 LocalStorage 或使用隐身模式

**解决方案**: 检查浏览器设置，允许 LocalStorage

### 10.2 存储空间不足

**现象**: 提示"存储空间不足"

**原因**: LocalStorage 容量限制（约 5-10MB）

**解决方案**: 删除一些旧任务

### 10.3 构建失败

**现象**: `npm run build` 报错

**原因**: TypeScript 类型错误或依赖问题

**解决方案**:
```bash
# 清理依赖和构建产物
rm -rf node_modules dist package-lock.json

# 重新安装依赖
npm install

# 再次构建
npm run build
```

## 11. 后续扩展计划

### v1.1 功能
- [ ] 任务搜索
- [ ] 任务分类/标签
- [ ] 任务截止日期
- [ ] 数据导出/导入
- [ ] 深色模式

### v1.2 功能
- [ ] 任务拖拽排序
- [ ] 任务统计/报表
- [ ] 快捷键支持增强
- [ ] 云端同步（需要后端）

## 12. 变更记录

### 2026-03-31 - v1.0 初始版本
- ✅ 完成 Vue 3 + Vite + TypeScript 项目初始化
- ✅ 实现 Pinia 状态管理
- ✅ 实现任务 CRUD 功能
- ✅ 实现过滤器功能
- ✅ 实现响应式设计
- ✅ 实现数据持久化（LocalStorage）
- ✅ 实现 XSS 防护
- ✅ 按设计规范实现完整的样式系统
- ✅ 实现平滑动画和交互效果
- ✅ 实现无障碍支持（ARIA 标签）

---

**文档结束**
