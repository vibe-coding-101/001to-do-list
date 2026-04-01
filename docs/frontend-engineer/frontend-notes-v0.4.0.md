# 前端开发说明文档 v0.4.0

**项目名称**: 待办事项列表应用 (To-Do List App)
**技术栈**: Vue 3 + Vite + TypeScript + Pinia + @tanstack/vue-virtual
**版本**: v0.4.0
**创建日期**: 2026-04-01
**前端工程师**: 小虾米

---

## 1. 版本概述

v0.4.0 聚焦于 **性能优化 + v0.3.0 视觉收尾**，不新增核心功能。

**核心目标**：
- 虚拟滚动支持 10000+ 任务流畅运行
- 搜索/过滤响应 < 100ms
- 补齐 v0.3.0 遗留的滑块动画和视觉增强

---

## 2. 环境要求

- **Node.js**: >= 18.0.0
- **包管理器**: npm 或 pnpm

## 3. 本地启动

```bash
# 安装依赖
cd src/frontend
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 4. 新增依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `@tanstack/vue-virtual` | `^3.13.23` | 虚拟滚动核心库 |

## 5. 实现任务清单

### 5.1 P0 必须完成

| 任务 ID | 任务描述 | 状态 |
|---------|---------|------|
| FE-401 | 集成虚拟滚动组件（@tanstack/vue-virtual） | ✅ 完成 |
| FE-402 | 搜索/过滤性能优化（debounce + computed 缓存） | ✅ 完成 |
| FE-403 | 滚动位置记忆（sessionStorage） | ✅ 完成 |

### 5.2 P1 重要

| 任务 ID | 任务描述 | 状态 |
|---------|---------|------|
| FE-404 | 过滤器 Tab 滑块动画 | ✅ 完成 |
| FE-405 | 优先级选择器滑块动画 | ✅ 完成 |

### 5.3 P2 可选

| 任务 ID | 任务描述 | 状态 |
|---------|---------|------|
| FE-406 | 优先级指示小圆点 | ✅ 完成 |
| FE-407 | 空状态 SVG 配色更新 | ✅ 完成（v0.3.0 已完成） |

### 5.4 安全加固

| 任务 ID | 任务描述 | 状态 |
|---------|---------|------|
| SR-004 | `isValidTask()` 枚举值验证 | ✅ 完成 |

---

## 6. 技术实现说明

### 6.1 虚拟滚动（FE-401）

**实现文件**: `src/frontend/src/components/TaskList.vue`

**核心参数**:
- 任务项固定高度: `72px`
- 缓冲区大小: `5` 条（上下各 5 条）
- 虚拟滚动阈值: `50` 条（少于 50 条使用普通列表）

**降级策略**:
- 任务数 < 50：使用 `TransitionGroup` 全量渲染（保留动画）
- 任务数 >= 50：使用 `@tanstack/vue-virtual` 虚拟滚动

**关键代码**:
```typescript
const TASK_ITEM_HEIGHT = 72
const OVERSCAN = 5
const VIRTUAL_THRESHOLD = 50

const useVirtualScroll = computed(() => filteredTasks.value.length >= VIRTUAL_THRESHOLD)

const virtualizer = useVirtualizer(computed(() => ({
  count: filteredTasks.value.length,
  getScrollElement: () => scrollContainerRef.value,
  estimateSize: () => TASK_ITEM_HEIGHT,
  overscan: OVERSCAN,
  getItemKey: (index: number) => filteredTasks.value[index]?.id ?? index
})))
```

### 6.2 搜索/过滤性能优化（FE-402）

**实现**:
- 搜索防抖：`SearchBox.vue` 中使用 `setTimeout` 实现 200ms 防抖
- `filteredTasks` 使用 `computed` 缓存，依赖不变不重算
- 搜索过滤优先于状态过滤（先缩小数据集）

### 6.3 滚动位置记忆（FE-403）

**实现文件**: `src/frontend/src/components/TaskList.vue`

**核心逻辑**:
- 存储时机：滚动停止后 200ms，记录首个可见任务索引
- 存储位置：`sessionStorage`（key: `todo-scroll-index`）
- 恢复时机：虚拟滚动激活后，通过 `scrollToIndex` 定位
- 过滤切换：自动重置到列表顶部

**关键代码**:
```typescript
const SCROLL_INDEX_KEY = 'todo-scroll-index'

function handleScrollSave(): void {
  if (!scrollContainerRef.value || !useVirtualScroll.value) return
  if (scrollSaveTimer) clearTimeout(scrollSaveTimer)
  scrollSaveTimer = setTimeout(() => {
    const range = virtualizer.value?.range
    if (range) {
      try {
        sessionStorage.setItem(SCROLL_INDEX_KEY, String(range.startIndex))
      } catch {
        // 静默降级
      }
    }
  }, 200)
}
```

### 6.4 过滤器 Tab 滑块动画（FE-404）

**实现文件**: `src/frontend/src/components/FilterTabs.vue`

**滑块属性**:
- 背景: `var(--color-surface)` (#FFFFFF)
- 圆角: `var(--radius-sm)` (6px)
- 阴影: `var(--shadow-1)`
- 高度: 30px（桌面）/ 28px（移动端）

**动画参数**:
- 时长: 200ms
- 缓动: `var(--easing-standard)` (ease-in-out)

**prefers-reduced-motion 降级**:
```css
@media (prefers-reduced-motion: reduce) {
  .filter-tabs__slider {
    transition: none;
  }
}
```

### 6.5 优先级选择器滑块动画（FE-405）

**实现文件**: `src/frontend/src/components/PrioritySelector.vue`

**滑块属性**:
- 背景色跟随优先级：高=红底、中=橙底、低=绿底
- 边框色跟随优先级边框色
- 圆角: `var(--radius-sm)`
- 阴影: `var(--shadow-1)`

**动画参数**:
- 时长: 200ms
- 缓动: `var(--easing-standard)`

**颜色映射**:
| 优先级 | 背景色变量 | 边框色变量 |
|--------|-----------|-----------|
| 高 | `var(--priority-high-bg)` | `var(--priority-high-border)` |
| 中 | `var(--priority-medium-bg)` | `var(--priority-medium-border)` |
| 低 | `var(--priority-low-bg)` | `var(--priority-low-border)` |

### 6.6 优先级指示小圆点（FE-406）

**实现文件**: `src/frontend/src/components/TaskItem.vue`

**圆点属性**:
- 尺寸: 6px × 6px
- 圆角: 50%
- 位置: 复选框右侧、文字左侧
- 间距: 由 flex gap 控制（8px）

**颜色映射**:
| 优先级 | 颜色变量 | 色值 |
|--------|---------|------|
| 高 | `var(--priority-high-color)` | #DC2626 |
| 中 | `var(--priority-medium-color)` | #D97706 |
| 低 | `var(--priority-low-color)` | #059669 |

**完成态样式**:
- 颜色: `var(--color-text-disabled)` (#94A3B8)

### 6.7 空状态 SVG 配色（FE-407）

**实现文件**: `src/frontend/src/components/EmptyState.vue`

**色值映射**:
| 角色 | 色值 | 用途 |
|------|------|------|
| 主线条 | #4F46E5 (Indigo 600) | 对勾等核心视觉元素 |
| 辅助线条 | #C7D2FE (Indigo 200) | 矩形描边、装饰横线 |
| 填充区域 | #EEF2FF (Indigo 50) | 矩形背景填充 |

### 6.8 安全加固（SR-004）

**实现文件**: `src/frontend/src/utils/storage.ts`

**变更内容**:
- 新增 `VALID_STATUSES` 常量：`['completed', 'uncompleted']`
- 新增 `VALID_PRIORITIES` 常量：`['high', 'medium', 'low']`
- `isValidTask()` 增加枚举值验证，防止非法数据注入

---

## 7. 文件变更清单

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `package.json` | 修改 | 新增 `@tanstack/vue-virtual` 依赖 |
| `src/components/TaskList.vue` | 重构 | 集成虚拟滚动，保留降级模式 |
| `src/components/FilterTabs.vue` | 修改 | 增加滑块 div + JS 位置计算 |
| `src/components/PrioritySelector.vue` | 修改 | 增加滑块 div + JS 位置计算 |
| `src/components/TaskItem.vue` | 修改 | 增加优先级小圆点 |
| `src/components/EmptyState.vue` | 确认 | SVG 配色已符合规范 |
| `src/App.vue` | 微调 | 调整布局配合虚拟滚动容器 |
| `src/utils/storage.ts` | 修改 | 增加枚举值验证 |

---

## 8. 性能指标

| 指标 | 目标值 | 实现方式 |
|------|--------|---------|
| 首屏加载（10000 条） | < 2s | 虚拟滚动，仅渲染可视区域 |
| 滚动帧率（10000 条） | >= 55fps | 虚拟滚动减少 DOM 节点 |
| 搜索/过滤响应 | < 100ms | computed 缓存 + 防抖 |

---

## 9. 验收检查清单

### 9.1 虚拟滚动

- [ ] 10000 条任务首屏加载 < 2s
- [ ] 滚动流畅，无卡顿
- [ ] 任务增删改后列表正确更新
- [ ] 过滤切换后滚动位置重置
- [ ] 刷新后滚动位置恢复

### 9.2 滑块动画

- [ ] 过滤器滑块切换动画流畅
- [ ] 优先级选择器滑块切换动画流畅
- [ ] 滑块颜色正确
- [ ] prefers-reduced-motion 下降级正确

### 9.3 视觉增强

- [ ] 优先级小圆点位置和颜色正确
- [ ] 已完成任务圆点变灰
- [ ] 空状态 SVG 配色与 Indigo 主题协调

---

## 10. 变更记录

### 2026-04-01 - v0.4.0 性能与体验完善

**虚拟滚动**:
- ✅ FE-401: 集成 @tanstack/vue-virtual
  - 实现自动降级策略（< 50 条使用普通列表）
  - 任务项固定高度 62px，虚拟滚动 estimateSize 72px（含 10px 间距）
  - 虚拟滚动模式下显式 paddingBottom 实现间距
  - 编辑模式高度固定 62px，内部 overflow-y: auto 滚动
  - 过滤/搜索切换时重置滚动位置

- ✅ FE-402: 搜索/过滤性能优化
  - 搜索防抖 200ms
  - computed 缓存优化
  - 搜索过滤优先于状态过滤

- ✅ FE-403: 滚动位置记忆
  - sessionStorage 存储首个可见任务索引
  - 恢复时通过 scrollToIndex 定位
  - 过滤切换自动重置

**滑块动画**:
- ✅ FE-404: 过滤器 Tab 滑块动画
  - transform: translateX() 实现平滑滑动
  - ResizeObserver 监听容器宽度变化
  - prefers-reduced-motion 降级

- ✅ FE-405: 优先级选择器滑块动画
  - 滑块背景色跟随优先级
  - 边框色跟随优先级
  - prefers-reduced-motion 降级

**视觉增强**:
- ✅ FE-406: 优先级指示小圆点
  - 6px 圆点，颜色跟随优先级
  - 已完成态变灰

- ✅ FE-407: 空状态 SVG 配色（v0.3.0 已完成）
  - 主线条 #4F46E5
  - 辅助线 #C7D2FE
  - 填充 #EEF2FF

**安全加固**:
- ✅ SR-004: isValidTask() 枚举值验证
  - 增加 VALID_STATUSES 常量
  - 增加 VALID_PRIORITIES 常量
  - 防止非法数据注入

### 2026-04-01 - v0.4.0 Bug 修复

- ✅ B001 [P0]: TaskItem 高度不固定导致虚拟滚动位置计算错误
  - TaskItem 正常模式固定 height: 62px，overflow: hidden
  - 编辑模式固定 height: 62px，overflow-y: auto，内容在固定高度内滚动
  - estimateSize 保持 72px（62px 高度 + 10px 间距）

- ✅ B002 [P0]: 虚拟滚动模式下任务项之间缺少间距
  - 在虚拟滚动 wrapper div 上添加 paddingBottom: 10px（最后一项除外）
  - 间距逻辑显式化，不依赖 estimateSize 与实际高度的隐式差值

- ✅ B003 [P1]: EmptyState float 动画未适配 prefers-reduced-motion
  - 添加 @media (prefers-reduced-motion: reduce) 规则
  - .empty-state 和 .empty-state__icon 的 animation 均设为 none

- ✅ B004 [P2]: FilterTabs reduced-motion 降级方式不符合设计规范
  - 将 transition: width 200ms 改为 transition: none
  - width 过渡会触发 reflow，在减弱动态效果模式下不合适

- ✅ B005 [P2]: PrioritySelector 选中态样式依赖 aria-label 硬编码
  - 模板中为按钮添加 priority-option--high/medium/low class
  - CSS 选择器从 [aria-label="X优先级"] 改为 .priority-option--X.priority-option--active
  - 消除对 aria-label 文案的依赖，支持国际化

---

**文档结束**
