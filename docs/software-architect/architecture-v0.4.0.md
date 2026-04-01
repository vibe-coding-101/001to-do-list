# 系统架构文档 v0.4.0 -- 虚拟滚动技术选型与集成方案

**版本**: v0.4.0
**日期**: 2026-04-01
**架构师**: 小虾米（软件架构师）
**关联 PRD**: `docs/product-manager/PRD-v0.4.0.md`
**任务 ID**: ARCH-401

---

## 1. 需求分析

### 1.1 核心问题

当前 `TaskList.vue` 使用 `v-for` + `TransitionGroup` 全量渲染所有任务项。当任务量超过 500 条时：
- DOM 节点过多导致渲染阻塞，首屏加载约 9s（10000 条）
- 滚动帧率严重下降
- 搜索/过滤操作在大数据量下响应超过 500ms

### 1.2 目标

| 指标 | 当前值 | 目标值 |
|------|--------|--------|
| 首屏加载（10000 条） | ~9s | < 2s |
| 滚动帧率（10000 条） | 卡顿严重 | >= 55fps |
| 搜索/过滤响应 | > 500ms | < 100ms |

### 1.3 约束条件

- 纯前端应用，无后端，数据存储在 LocalStorage
- 任务项高度基本固定（单行文本），可采用固定高度模式
- 不改变现有 `Task` 数据模型
- 必须兼容 Vue 3 + TypeScript + Pinia + Vite
- 过滤、搜索、增删改操作需与虚拟滚动正确联动

---

## 2. 现有数据流分析

### 2.1 当前架构

```
App.vue
  +-- SearchBox.vue  (v-model --> filterStore.searchQuery)
  +-- FilterTabs.vue (v-model --> filterStore.currentFilter)
  +-- TaskList.vue
        +-- computed: filteredTasks
        |     (读取 taskStore.tasks + filterStore 状态)
        +-- TransitionGroup + v-for
              +-- TaskItem.vue (接收 task prop)
```

### 2.2 数据流路径

1. `App.vue` 在 `onMounted` 中调用 `taskStore.loadTasks()` 加载全量数据
2. `TaskList.vue` 的 `filteredTasks` computed 从 `taskStore.tasks`（Pinia）+ `filterStore`（搜索词 + 过滤器）派生
3. `filteredTasks` 直接传给 `v-for` 全量渲染
4. `TaskItem.vue` 通过 prop 接收单个 task，调用 `taskStore` 的 action 完成增删改

### 2.3 关键改造点

- `TaskList.vue`：将 `TransitionGroup + v-for` 替换为虚拟滚动容器
- `filteredTasks` computed 保持不变，作为虚拟滚动的**数据源**
- `TaskItem.vue` 无需改动，仍作为单个渲染单元被虚拟滚动复用
- 过滤/搜索切换时，需**重置虚拟滚动状态**（滚动位置归零）
- 搜索触发后，需支持**定位到首个匹配结果**（scrollToIndex）

---

## 3. 技术选型对比

### 3.1 候选方案

| 维度 | vue-virtual-scroller | @tanstack/vue-virtual | vue3-virtual-scroll-list | VueUse useVirtualList |
|------|---------------------|----------------------|--------------------------|----------------------|
| **最新版本** | 2.0.0-beta.10 | 3.13.23 | 0.2.1 | @vueuse/core 内置 |
| **最近更新** | ~2025 年活跃 | ~2026 年活跃（6天前） | 3 年前未更新 | 持续更新 |
| **维护状态** | Beta 阶段，Vue 3 支持仍在 beta | 稳定发布，活跃维护 | **停止维护** | 持续维护 |
| **GitHub Star** | ~9,000+ | ~4,000+（TanStack/virtual） | ~低 | VueUse 整体 20k+ |
| **周下载量** | ~400K | ~100K+ | ~低 | VueUse 整体 ~2M |
| **包体积 (gzip)** | ~6-8KB | ~2.5-3KB | ~3KB | ~1KB（tree-shake） |
| **Vue 3 Composition API** | Options API 风格组件 | 原生 Composition API | Options API 风格 | 原生 Composition API |
| **TypeScript 支持** | 社区类型定义，非原生 | 原生 TypeScript 编写 | 无 TS 支持 | 原生 TypeScript 编写 |
| **固定高度模式** | RecycleScroller + item-size prop | estimateSize 常量 | size prop | itemHeight 常量 |
| **scrollTo 支持** | scrollToItem(index) | scrollToIndex(index) | 无原生支持 | scrollTo(index) |
| **API 风格** | 组件式（模板为主） | Headless（composable） | 组件式 | Composable |
| **Pinia 兼容性** | 响应式数据需注意 key 管理 | 完全兼容响应式数据 | 未知 | 完全兼容 |
| **列表重置** | 需手动 forceUpdate 或改 key | 改变 count 即自动重置 | 未知 | 重新计算 |
| **社区/文档** | 社区最大，文档较全 | TanStack 官方文档优秀 | 文档少 | VueUse 文档全 |
| **学习曲线** | 低（组件即用） | 中（需手动构建 DOM） | 低 | 低 |

### 3.2 排除方案

**vue3-virtual-scroll-list**：最后更新于 3 年前，停止维护，无 TypeScript 原生支持，存在社区维护风险。**排除**。

### 3.3 对比分析

#### vue-virtual-scroller vs @tanstack/vue-virtual

| 对比维度 | vue-virtual-scroller | @tanstack/vue-virtual |
|---------|---------------------|----------------------|
| **API 易用性** | 提供 `<RecycleScroller>` 组件，模板直接使用，对 Vue 开发者最自然 | 提供 `useVirtualizer()` composable，需手动构建列表 DOM 结构 |
| **TypeScript** | 社区类型补丁，非原生 TS 编写，类型可能不完整 | 原生 TypeScript 编写，类型完整且精确 |
| **维护稳定性** | Vue 3 版本长期停留在 beta（2.0.0-beta.x 持续 2 年+），正式版迟迟未发布 | 稳定发布，持续迭代（v3.x），TanStack 团队背书 |
| **包体积** | ~6-8KB gzip，偏重 | ~2.5KB gzip，更轻量 |
| **灵活性** | 组件封装度高，定制性有限 | Headless 设计，完全控制 DOM 结构和样式 |
| **与现有组件兼容** | 需将 TaskItem 包装在 RecycleScroller slot 内，但 RecycleScroller 的 DOM 结构会改变现有布局 | 可在现有 flex 容器内直接集成，DOM 结构更可控 |
| **scrollToIndex** | `scrollToItem(index)` 直接可用 | `virtualizer.scrollToIndex(index)` 直接可用 |
| **过滤/搜索重置** | 需通过 `:key` 变更或 `reset()` 方法触发 | 数据源（items）变化后自动重新计算，天然支持 |
| **学习成本** | 低，文档和社区案例丰富 | 中，需理解 headless 模式和 absolute 定位渲染 |

#### 关键决策因素

1. **维护稳定性**：vue-virtual-scroller 的 Vue 3 版本长期 beta 是主要风险。@tanstack/vue-virtual 稳定发布，由 TanStack 团队（React Query 同团队）持续维护。

2. **TypeScript 原生支持**：本项目使用 TypeScript，@tanstack/vue-virtual 原生 TS 编写意味着更准确的类型推导和更少的类型断言。

3. **Headless 设计适配性**：当前 `TaskList.vue` 的 CSS 结构（`.task-list` flex 容器 + `.task-list__items` flex 列表 + 每项 `gap: 10px`）与 RecycleScroller 的 DOM 结构（RecycleScroller 自动生成 wrapper）会产生冲突，需要大量 CSS 重写。而 @tanstack/vue-virtual 的 headless 模式允许完全保留现有 DOM 结构。

4. **列表数据联动**：@tanstack/vue-virtual 的 composable 模式天然适配 Pinia 的响应式数据，`filteredTasks` computed 变化时 virtualizer 自动重新计算可见项，无需额外的 forceUpdate 或 key 变更。

---

## 4. 最终推荐方案

### 推荐：@tanstack/vue-virtual

**推荐理由**：

1. **维护保障**：稳定版本（v3.13.x），活跃更新（最近 6 天前），TanStack 团队有成熟的生态维护经验
2. **TypeScript 原生**：零类型补丁成本，与项目 TS 规范完全一致
3. **Headless 架构**：不侵入 DOM 结构，现有 CSS 可最大程度保留
4. **Composition API 原生**：与 Vue 3 `<script setup>` + Pinia 响应式系统无缝对接
5. **轻量**：~2.5KB gzip，是最轻量的方案之一
6. **scrollToIndex**：原生支持，满足搜索定位和滚动位置记忆需求

**取舍说明**：
- 放弃 vue-virtual-scroller 的开箱即用便利性，换取更好的类型安全和 DOM 控制力
- 需要前端工程师手动构建虚拟列表的 absolute 定位渲染层（约 20 行模板代码），但换来的是完全可控的组件结构

---

## 5. 集成方案

### 5.1 安装

```bash
npm install @tanstack/vue-virtual
```

### 5.2 TaskList.vue 改造方案

#### 改造前（当前代码结构）

```vue
<template>
  <div class="task-list">
    <TransitionGroup v-else tag="div" name="list" class="task-list__items">
      <TaskItem v-for="task in filteredTasks" :key="task.id" :task="task" />
    </TransitionGroup>
    <EmptyState v-if="!loading && filteredTasks.length === 0" ... />
  </div>
</template>
```

#### 改造后（伪代码）

```vue
<template>
  <div class="task-list">
    <!-- 虚拟滚动容器 -->
    <div
      v-if="!loading && filteredTasks.length > 0"
      ref="scrollContainerRef"
      class="task-list__scroll-container"
    >
      <div
        :style="{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }"
      >
        <div
          v-for="virtualItem in virtualizer.getVirtualItems()"
          :key="virtualItem.key"
          :style="{
            position: 'absolute',
            top: `${virtualItem.start}px`,
            left: 0,
            width: '100%',
            height: `${virtualItem.size}px`
          }"
        >
          <TaskItem
            :task="filteredTasks[virtualItem.index]"
            :aria-labelledby="`task-${filteredTasks[virtualItem.index].id}`"
          />
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <EmptyState
      v-if="!loading && filteredTasks.length === 0"
      :title="emptyStateTitle"
      :subtitle="emptyStateSubtitle"
    />

    <!-- 骨架屏保持不变 -->
    <div v-if="loading" class="task-list__skeleton">...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useVirtualizer } from '@tanstack/vue-virtual'
import TaskItem from './TaskItem.vue'
import EmptyState from './EmptyState.vue'
import { useTaskStore } from '@/stores/task'
import { useFilterStore } from '@/stores/filter'

const taskStore = useTaskStore()
const filterStore = useFilterStore()
const { loading } = storeToRefs(taskStore)

// 滚动容器 ref
const scrollContainerRef = ref<HTMLElement | null>(null)

// 任务项固定高度（px）-- 包含 gap 的等效高度
const TASK_ITEM_HEIGHT = 72 // 48px 内容 + 14px padding-top + 10px gap
const OVERSCAN = 5 // 上下各缓冲 5 条

// filteredTasks computed 保持原有逻辑不变
const filteredTasks = computed(() => {
  let tasks = taskStore.tasks
  if (filterStore.searchQuery.trim()) {
    const query = filterStore.searchQuery.toLowerCase().trim()
    tasks = tasks.filter((task) => task.text.toLowerCase().includes(query))
  }
  if (filterStore.currentFilter === 'uncompleted') {
    tasks = tasks.filter((t) => t.status === 'uncompleted')
  } else if (filterStore.currentFilter === 'completed') {
    tasks = tasks.filter((t) => t.status === 'completed')
  }
  return tasks.sort((a, b) => b.createdAt - a.createdAt)
})

// 虚拟滚动器
const virtualizer = useVirtualizer({
  count: () => filteredTasks.value.length,
  getScrollElement: () => scrollContainerRef.value,
  estimateSize: () => TASK_ITEM_HEIGHT,
  overscan: OVERSCAN,
  getItemKey: (index) => filteredTasks.value[index]?.id ?? index,
})

// 搜索/过滤切换时重置滚动位置
watch(
  () => [filterStore.currentFilter, filterStore.searchQuery],
  () => {
    virtualizer.value?.scrollToIndex(0, { align: 'start' })
  }
)

// emptyStateTitle / emptyStateSubtitle computed 保持不变...
</script>
```

### 5.3 关键改造点说明

#### 5.3.1 滚动容器

虚拟滚动需要一个有**固定高度**且 `overflow-y: auto` 的滚动容器。当前 `TaskList` 是 flex 列布局，需要让滚动容器占满可用空间：

```css
.task-list__scroll-container {
  flex: 1;
  overflow-y: auto;
  /* 使用 webkit 滚动条美化，与整体风格一致 */
}
```

由于 `App.vue` 的 `.main__content` 是 flex 列布局，`TaskList` 需要设置 `flex: 1; overflow: hidden`，让滚动发生在 `.task-list__scroll-container` 内。

#### 5.3.2 任务项高度

PRD 明确任务项高度固定。当前 `TaskItem` 的实际高度：
- `padding: 14px 16px` -> 上下 28px
- 内容区域（checkbox 22px + 文字行高）约 22px
- 加上 gap 10px
- 总计约 **60-72px**

建议定义 CSS 变量 `--task-item-height: 72px`，同时设置 `TaskItem` 的 `min-height` 和 `max-height` 为该值，确保高度恒定。注意：如果任务文字超长被截断（`text-overflow: ellipsis`），高度不会因内容变化。

#### 5.3.3 TransitionGroup 的取舍

虚拟滚动**无法使用** Vue 的 `<TransitionGroup>`，因为虚拟滚动通过 absolute 定位渲染，离开可视区域的 DOM 节点会被卸载，TransitionGroup 的 leave 动画无法正常工作。

**替代方案**：
- 任务项进入动画：在 `TaskItem` 内部用 `onMounted` + CSS transition 实现淡入效果
- 任务项删除动画：`TaskItem` 已有 `isDeleting` 状态控制（200ms 延迟后卸载），保持现有逻辑即可
- 列表排序变化：虚拟滚动天然处理重排，无需额外动画

#### 5.3.4 getItemKey 的重要性

```typescript
getItemKey: (index) => filteredTasks.value[index]?.id ?? index
```

使用 `task.id` 作为 key 而非 index，确保：
- 任务增删时虚拟滚动器正确复用 DOM
- 任务排序变化时不产生错乱
- 编辑状态切换时组件正确更新

#### 5.3.5 过滤/搜索切换重置

```typescript
watch(
  () => [filterStore.currentFilter, filterStore.searchQuery],
  () => {
    virtualizer.value?.scrollToIndex(0, { align: 'start' })
  }
)
```

过滤或搜索条件变化时，数据源 `filteredTasks` 自动更新（computed 响应式），virtualizer 的 `count` 会跟随变化。通过 `scrollToIndex(0)` 将视图重置到列表顶部，避免滚动位置指向已不存在的索引。

### 5.4 App.vue 布局适配

为了让虚拟滚动容器有固定的可视高度，需要调整 `App.vue` 和 `TaskList.vue` 的 CSS：

```css
/* App.vue 中 .main__content 需要确保高度约束 */
.main__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 关键：防止整个页面滚动 */
}

/* TaskList.vue */
.task-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 关键：约束高度 */
  min-height: 0; /* flex 子项收缩 */
}
```

### 5.5 数据流设计

```
App.vue
  +-- taskStore.loadTasks() --> tasks: Task[]
  +-- SearchBox  --> filterStore.searchQuery
  +-- FilterTabs --> filterStore.currentFilter
  +-- TaskList.vue
        +-- computed: filteredTasks
        |     (taskStore.tasks x filterStore)
        |     [响应式，虚拟滚动数据源]
        +-- useVirtualizer
        |     count: filteredTasks.length
        |     getItemKey: task.id
        |     [只渲染可视区域 + OVERSCAN 缓冲]
        +-- TaskItem.vue (每个可见项)
              +-- prop: task
              +-- action: taskStore.toggle/update/delete
```

### 5.6 滚动位置记忆方案（FE-403 参考）

使用 `sessionStorage` 记录**首个可见任务的索引**（而非像素偏移），恢复时通过 `scrollToIndex` 定位：

```typescript
// 存储滚动位置
watch(
  () => virtualizer.value?.range,
  (range) => {
    if (range) {
      try {
        sessionStorage.setItem('todo-scroll-index', String(range.startIndex))
      } catch { /* 静默降级 */ }
    }
  }
)

// 恢复滚动位置
onMounted(() => {
  try {
    const savedIndex = sessionStorage.getItem('todo-scroll-index')
    if (savedIndex) {
      const index = Math.min(Number(savedIndex), filteredTasks.value.length - 1)
      if (index >= 0) {
        nextTick(() => virtualizer.value?.scrollToIndex(index))
      }
    }
  } catch { /* 静默降级 */ }
})
```

---

## 6. 降级策略

当任务数量较少时（< 50 条），虚拟滚动的 absolute 定位计算反而增加开销。建议实现**自动降级**：

```typescript
const VIRTUAL_THRESHOLD = 50
const useVirtualScroll = computed(() => filteredTasks.value.length >= VIRTUAL_THRESHOLD)
```

- `useVirtualScroll === true`：使用虚拟滚动渲染
- `useVirtualScroll === false`：回退到当前的 `v-for` 全量渲染（保留 TransitionGroup 动画）

在模板中通过 `v-if / v-else` 切换两种渲染模式。

---

## 7. 注意事项与风险

### 7.1 高风险项

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 滚动容器高度约束失败 | 虚拟滚动不触发，显示异常 | 必须在 App.vue + TaskList.vue 中设置 `overflow: hidden; flex: 1; min-height: 0`，FE-401 验收时重点测试 |
| 任务项高度不固定 | 虚拟滚动位置计算错误，出现重叠或间隙 | TaskItem 必须设置固定 `height`，文字溢出用 `text-overflow: ellipsis` 截断，禁止高度自适应 |
| 移动端触摸滚动 | 部分虚拟滚动库在移动端滚动不流畅 | @tanstack/vue-virtual 基于原生滚动事件，移动端兼容性好；FE-401 需在 iOS Safari / Android Chrome 实测 |

### 7.2 中风险项

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| TransitionGroup 动画丢失 | 增删任务时无列表过渡效果 | 虚拟滚动模式下放弃 TransitionGroup，通过 TaskItem 内部动画补偿；降级模式下保留 TransitionGroup |
| 编辑模式展开高度变化 | 编辑模式下 TaskItem 高度增加（输入框 + 优先级选择器 + 按钮） | 编辑模式下仍固定容器高度，内部 overflow 处理；或编辑模式时让虚拟滚动器重算该行高度（复杂度高，建议用固定高度 + 内部滚动） |
| 搜索防抖后虚拟滚动位置跳动 | debounce 期间旧结果仍显示，debounce 结束后结果突变 | 搜索防抖在 SearchBox 组件已实现（200ms），TaskList 接收的 searchQuery 已经是防抖后的值 |

### 7.3 低风险项

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| overscan 值选择 | 过大浪费 DOM，过小快速滚动白屏 | 默认 5 条（约 360px 缓冲），可根据实际测试调整 |
| TaskItem 内部状态丢失 | 虚拟滚动卸载 TaskItem 时丢失编辑状态 | 编辑是临时状态（isEditing ref），卸载等同于取消编辑，用户体验可接受 |

---

## 8. 依赖管理

### 8.1 新增依赖

| 包名 | 版本约束 | 用途 |
|------|---------|------|
| `@tanstack/vue-virtual` | `^3.13.0` | 虚拟滚动核心 |

### 8.2 不变更依赖

- `vue` ^3.4.21 -- 不变
- `pinia` ^2.1.7 -- 不变
- 所有 devDependencies -- 不变

---

## 9. 性能预期

基于 @tanstack/vue-virtual 的固定高度模式，10000 条任务的预期表现：

| 指标 | 机制 | 预期值 |
|------|------|--------|
| DOM 节点数 | 仅渲染可视区域 + overscan | ~30-40 个 TaskItem（vs 10000） |
| 首屏渲染时间 | 无全量 DOM 创建 | < 500ms（虚拟滚动初始化 + 首屏渲染） |
| 滚动帧率 | 无 DOM 创建/销毁瓶颈 | >= 55fps |
| 内存占用 | 大幅减少 DOM 节点引用 | < 50MB（vs 当前 > 200MB） |
| 搜索响应 | computed 缓存 + debounce | < 100ms（过滤计算本身不涉及 DOM） |

---

## 10. 待确认项

| 编号 | 待确认内容 | 决策方 | 建议 |
|------|-----------|--------|------|
| 1 | TaskItem 编辑模式高度是否需要固定（当前编辑模式高度明显大于显示模式） | 前端工程师 + 设计师 | 建议固定编辑模式容器高度，内部内容溢出时滚动 |
| 2 | 虚拟滚动阈值（VIRTUAL_THRESHOLD）是否定为 50 条 | 前端工程师 | 50 条是保守值，可根据实际测试调整为 100 |
| 3 | 是否需要在降级模式下也支持列表动画（TransitionGroup） | 产品经理 | 建议 Must 级别功能使用虚拟滚动，降级模式保留 TransitionGroup 动画作为体验补偿 |
| 4 | App.vue 的 `.main__content` 布局调整为 `overflow: hidden` 是否影响底部输入区（`.input-section` sticky 定位） | 前端工程师 | 需要验证 sticky bottom 在 `overflow: hidden` 父容器内是否生效，可能需要将 input-section 移出 main |

---

## 11. 文件变更清单

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/frontend/package.json` | 修改 | 新增 `@tanstack/vue-virtual` 依赖 |
| `src/frontend/src/components/TaskList.vue` | 重构 | 核心改造对象：集成虚拟滚动，替换 TransitionGroup |
| `src/frontend/src/components/TaskItem.vue` | 微调 | 设置固定高度 CSS 变量，确保高度恒定 |
| `src/frontend/src/App.vue` | 微调 | 调整 `.main__content` overflow 属性，配合虚拟滚动容器 |

---

**文档结束**
