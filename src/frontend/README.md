# 待办事项列表应用

一个简单高效的待办事项管理工具，使用 Vue 3 + Vite + TypeScript + Pinia 构建。

## 功能特性

- ✅ 创建、编辑、删除任务
- ✅ 标记任务完成/未完成
- ✅ 设置任务优先级（高/中/低）
- ✅ 按状态过滤任务（全部/未完成/已完成）
- ✅ 数据本地持久化（LocalStorage）
- ✅ 响应式设计（支持桌面端和移动端）
- ✅ 平滑动画和交互效果
- ✅ 无障碍支持

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 技术栈

- **Vue 3**: 渐进式 JavaScript 框架
- **Vite**: 下一代前端构建工具
- **TypeScript**: JavaScript 的超集
- **Pinia**: Vue 3 官方推荐的状态管理库
- **CSS Variables**: 原生 CSS 变量实现设计系统

## 项目结构

```
src/
├── components/          # Vue 组件
├── stores/             # Pinia 状态管理
├── types/              # TypeScript 类型定义
├── utils/              # 工具函数
└── assets/styles/      # 样式文件
```

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 许可证

MIT

## 作者

小虾米

---

**开发文档**: 查看 [docs/frontend-engineer/frontend-notes.md](../../docs/frontend-engineer/frontend-notes.md) 获取详细开发说明。
