# 设计规范文档 v0.4.0 — 性能与体验完善（视觉收尾部分）

**版本**: v0.4.0
**日期**: 2026-04-01
**设计师**: 小虾米（UI/UX 设计师）
**关联 PRD**: `docs/product-manager/PRD-v0.4.0.md`
**基于**: `docs/ux-ui-designer/design-spec-v0.3.0.md`（CSS 变量体系沿用，不新增变量）

---

## 1. 概述

v0.4.0 设计任务聚焦于 v0.3.0 遗留的 **视觉收尾** 工作，包括：

| 设计任务 ID | 内容 | 优先级 |
|-------------|------|--------|
| DES-401 | 过滤器 Tab 滑块动画 | P1 |
| DES-402 | 优先级选择器滑块动画 | P1 |
| DES-403 | 优先级小圆点视觉规范 | P2 |
| DES-404 | 空状态 SVG 配色方案 | P2 |

**设计原则**：
- 所有动画仅使用 `transform` / `opacity`，不触发 layout/paint
- 复用 v0.3.0 已建立的 CSS 变量体系，不新增 CSS 变量
- 所有动画遵循 `prefers-reduced-motion` 媒体查询

---

## 2. DES-401: 过滤器 Tab 滑块动画

### 2.1 现状分析

当前 `FilterTabs.vue` 的选中态通过 `.filter-tab--active` 类直接切换 `background` 和 `box-shadow`，切换时无位移动画，只有 CSS `transition: all` 的颜色过渡。需要在容器内增加一个绝对定位的滑块元素，实现 Tab 间的滑动效果。

### 2.2 滑块元素定义

| 属性 | 值 | 说明 |
|------|-----|------|
| 定位方式 | `position: absolute` | 相对于 `.filter-tabs` 容器 |
| 背景色 | `var(--color-surface)` 即 `#FFFFFF` | 白色，与 Header 渐变背景形成对比 |
| 圆角 | `var(--radius-sm)` 即 `6px` | 与 Tab 按钮圆角一致 |
| 阴影 | `var(--shadow-1)` | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` |
| 高度 | `30px`（桌面）/ `28px`（移动端） | 与 `.filter-tab` 高度完全一致 |
| 宽度 | 动态计算，等于目标 Tab 按钮的实际宽度 | 通过 JS 获取 `el.offsetWidth` |
| z-index | `0` | 位于 Tab 文字下方 |
| 上边距 | `3px` | 等于容器 padding-top |

### 2.3 滑块定位计算

滑块使用 `transform: translateX()` 定位，不使用 `left` 属性（避免触发 layout）。

```
translateX 值 = 目标 Tab 元素的 offsetLeft - 容器 padding-left
```

具体实现思路：
1. 容器 `.filter-tabs` 设置 `position: relative`
2. 滑块 div 设置 `position: absolute; top: 3px; left: 3px; height: 30px`
3. 滑块初始 `width` 和 `translateX` 通过 JS 在 `onMounted` 和 `watch(modelValue)` 时计算
4. 三个 Tab 按等宽分配或按实际文字宽度计算（当前代码中 Tab 文字长度不同，建议按实际宽度计算）

### 2.4 动画参数

| 参数 | 值 | CSS 变量引用 |
|------|-----|-------------|
| 过渡属性 | `transform` | 仅对 transform 做过渡 |
| 时长 | `200ms` | `var(--duration-normal)` |
| 缓动函数 | `ease-in-out` | `var(--easing-standard)` |
| 宽度变化过渡 | `200ms ease-in-out` | 宽度变化时同样平滑过渡 |

CSS 声明：

```css
.filter-tabs__slider {
  position: absolute;
  top: 3px;
  height: 30px;
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-1);
  transition: transform 200ms var(--easing-standard),
              width 200ms var(--easing-standard);
  z-index: 0;
  /* pointer-events: none 确保不阻挡点击 */
  pointer-events: none;
}
```

### 2.5 Tab 按钮样式调整

选中态 Tab 需要去掉原有的 `background` 和 `box-shadow`（这些由滑块承担），仅保留文字颜色变化：

```css
/* 修改前 */
.filter-tab--active {
  color: var(--color-primary);
  background: var(--color-surface);
  box-shadow: var(--shadow-1);
}

/* 修改后 */
.filter-tab--active {
  color: var(--color-primary);
  background: transparent; /* 背景由滑块提供 */
  box-shadow: none;
}
```

Tab 按钮需增加 `position: relative; z-index: 1`，确保文字在滑块之上。

### 2.6 prefers-reduced-motion 降级方案

```css
@media (prefers-reduced-motion: reduce) {
  .filter-tabs__slider {
    /* 禁用 transform 位移动画，仅保留宽度变化 */
    transition: width 200ms var(--easing-standard);
    /* transform 瞬时跳转 */
  }
}
```

降级行为说明：
- 滑块位移变为瞬时跳转（无滑动动画）
- 保留宽度过渡（视觉不突兀）
- 不影响 Tab 的 `background-color` 过渡

---

## 3. DES-402: 优先级选择器滑块动画

### 3.1 现状分析

当前 `PrioritySelector.vue` 的选中态通过 CSS 属性选择器 `[aria-label="X优先级"]` 分别设置不同背景色。切换时仅有 `transition: all 100ms ease-in-out` 的颜色过渡。需要增加绝对定位滑块，实现与 FilterTabs 类似的滑动效果。

### 3.2 滑块元素定义

| 属性 | 值 | 说明 |
|------|-----|------|
| 定位方式 | `position: absolute` | 相对于 `.priority-selector` 容器 |
| 圆角 | `var(--radius-sm)` 即 `6px` | 与按钮圆角一致 |
| 阴影 | `var(--shadow-1)` | 与 FilterTabs 滑块一致 |
| 高度 | `calc(100% - 4px)` | 容器高度减去上下各 2px padding |
| 宽度 | 动态计算，等于目标按钮实际宽度 | 通过 JS 获取 |
| z-index | `0` | 位于按钮文字下方 |
| 上边距 | `2px` | 等于容器 padding-top |
| 左边距 | `2px` | 等于容器 padding-left |

### 3.3 滑块背景色映射

滑块背景色 **跟随目标优先级** 的背景色变量，而非固定白色：

| 优先级 | 滑块背景色 | CSS 变量 |
|--------|-----------|---------|
| 高 | `#FEF2F2` | `var(--priority-high-bg)` |
| 中 | `#FFFBEB` | `var(--priority-medium-bg)` |
| 低 | `#ECFDF5` | `var(--priority-low-bg)` |

滑块同时需要对应优先级的边框色：

| 优先级 | 滑块边框色 | CSS 变量 |
|--------|-----------|---------|
| 高 | `#FECACA` | `var(--priority-high-border)` |
| 中 | `#FDE68A` | `var(--priority-medium-border)` |
| 低 | `#A7F3D0` | `var(--priority-low-border)` |

### 3.4 滑块定位计算

与 FilterTabs 相同的原理：

```
translateX 值 = 目标按钮的 offsetLeft - 容器 padding-left
```

由于三个按钮（高/中/低）的文字宽度不同（"高" 比 "低" 宽度不同），必须按实际 `offsetWidth` 计算。

### 3.5 动画参数

| 参数 | 值 | CSS 变量引用 |
|------|-----|-------------|
| 过渡属性 | `transform, width, background-color, border-color` | 位移 + 尺寸 + 颜色均需过渡 |
| 位移时长 | `200ms` | `var(--duration-normal)` |
| 宽度时长 | `200ms` | `var(--duration-normal)` |
| 颜色时长 | `200ms` | `var(--duration-normal)` |
| 缓动函数 | `ease-in-out` | `var(--easing-standard)` |

CSS 声明：

```css
.priority-selector__slider {
  position: absolute;
  top: 2px;
  height: calc(100% - 4px);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-1);
  border: 1px solid transparent;
  transition: transform 200ms var(--easing-standard),
              width 200ms var(--easing-standard),
              background-color 200ms var(--easing-standard),
              border-color 200ms var(--easing-standard);
  z-index: 0;
  pointer-events: none;
}
```

### 3.6 按钮样式调整

选中态按钮需去掉原有的 `background`、`border`、`box-shadow`，这些由滑块承担：

```css
/* 修改前 — 三个优先级各自设置背景 */
.priority-option--active {
  background: var(--priority-high-bg);
  color: var(--priority-high-color);
  border: 1px solid var(--priority-high-border);
  box-shadow: var(--shadow-1);
}

/* 修改后 — 选中态仅保留文字色 */
.priority-option--active {
  background: transparent;
  border: 1px solid transparent;
  box-shadow: none;
}
```

按钮需增加 `position: relative; z-index: 1`，确保文字在滑块之上。

### 3.7 prefers-reduced-motion 降级方案

```css
@media (prefers-reduced-motion: reduce) {
  .priority-selector__slider {
    /* 禁用 transform 位移动画 */
    transition: width 200ms var(--easing-standard),
                background-color 200ms var(--easing-standard),
                border-color 200ms var(--easing-standard);
  }
}
```

降级行为：滑块位置瞬时跳转，但颜色过渡保留，确保用户仍能感知选中状态变化。

---

## 4. DES-403: 优先级小圆点视觉规范

### 4.1 圆点元素定义

在 `TaskItem.vue` 的 `.task-item__view` 中，在 checkbox 和 `.task-text` 之间插入一个小圆点 `<span>`。

| 属性 | 值 | 说明 |
|------|-----|------|
| 尺寸 | `6px × 6px` | `width: 6px; height: 6px` |
| 圆角 | `50%` | 正圆 |
| 定位 | flex 行内元素 | 与 checkbox、text 同行 flex 排列 |
| 垂直对齐 | `align-self: center` | 与文字垂直居中（已有 `align-items: center`） |
| flex-shrink | `0` | 防止被压缩 |

### 4.2 优先级颜色映射

| 优先级 | 圆点颜色 | 色值 | 来源 |
|--------|---------|------|------|
| 高 | 红色 | `var(--priority-high-color)` = `#DC2626` | 与优先级标签文字色一致 |
| 中 | 橙色 | `var(--priority-medium-color)` = `#D97706` | 与优先级标签文字色一致 |
| 低 | 绿色 | `var(--priority-low-color)` = `#059669` | 与优先级标签文字色一致 |

### 4.3 完成态样式

任务已完成时（`task.status === 'completed'`），圆点变灰：

| 属性 | 值 | 说明 |
|------|-----|------|
| 颜色 | `var(--color-text-disabled)` = `#94A3B8` | 与完成态文字色一致 |

### 4.4 间距规范

圆点在 flex 布局中的间距由父容器 `.task-item__view` 的 `gap: var(--spacing-sm)` (8px) 统一控制，无需额外 margin。

DOM 结构（在 `.task-item__view` 内）：

```
[checkbox] [圆点] [task-text] [priority-badge] [actions]
```

圆点位于复选框右侧、文字左侧，与两者各保持 8px 间距（由 gap 提供）。

### 4.5 CSS 声明

```css
.priority-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.priority-dot--high {
  background: var(--priority-high-color);
}

.priority-dot--medium {
  background: var(--priority-medium-color);
}

.priority-dot--low {
  background: var(--priority-low-color);
}

.task-item--completed .priority-dot {
  background: var(--color-text-disabled);
}
```

### 4.6 可访问性说明

- 小圆点仅提供 **视觉辅助** 标识，不承载独立语义
- 优先级信息仍由左侧竖条 + 右侧优先级标签（badge）双重传达
- 不需要为圆点添加 `aria-label` 或 `role`（装饰性元素）
- 满足 WCAG 要求：不依赖颜色作为唯一区分手段

---

## 5. DES-404: 空状态 SVG 配色方案

### 5.1 现状分析

当前 `EmptyState.vue` 中的 SVG 已经使用了 Indigo 色系配色（v0.3.0 已更新）。以下是当前 SVG 中所有元素的色值映射。

### 5.2 SVG 元素色值映射表

当前 SVG 结构包含 4 个路径元素，色值映射如下：

| 序号 | SVG 元素 | 类型 | 属性 | 当前色值 | 说明 |
|------|---------|------|------|---------|------|
| 1 | `<rect>` (背景矩形) | 填充 | `fill` | `#EEF2FF` | Indigo 50，浅色底 |
| 1 | `<rect>` (背景矩形) | 描边 | `stroke` | `#C7D2FE` | Indigo 200，辅助线 |
| 2 | `<path>` (对勾路径) | 描边 | `stroke` | `#4F46E5` | 主色，主线 |
| 2 | `<path>` (对勾路径) | 线宽 | `stroke-width` | `3` | 主线宽度 |
| 3 | `<path>` (横线1) | 描边 | `stroke` | `#C7D2FE` | Indigo 200，辅助线 |
| 3 | `<path>` (横线1) | 线宽 | `stroke-width` | `2` | 辅助线宽度 |
| 4 | `<path>` (横线2) | 描边 | `stroke` | `#C7D2FE` | Indigo 200，辅助线 |
| 4 | `<path>` (横线2) | 线宽 | `stroke-width` | `2` | 辅助线宽度 |

### 5.3 色值规则总结

| 角色 | 色值 | 用途 |
|------|------|------|
| 主线条 | `#4F46E5` (Indigo 600) | 对勾等核心视觉元素 |
| 辅助线条 | `#C7D2FE` (Indigo 200) | 矩形描边、装饰横线 |
| 填充区域 | `#EEF2FF` (Indigo 50) | 矩形背景填充 |

### 5.4 对比度验证

| 组合 | 前景 | 背景 | 对比度 | 结论 |
|------|------|------|--------|------|
| 主线 on 填充 | `#4F46E5` | `#EEF2FF` | 5.8:1 | AA 通过 |
| 辅助线 on 填充 | `#C7D2FE` | `#EEF2FF` | 1.5:1 | 装饰性，无文字无需达标 |
| 主线 on 页面背景 | `#4F46E5` | `#F8FAFC` | 6.2:1 | AA 通过 |

### 5.5 浮动动画保持

当前 SVG 浮动动画保持不变：

```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animation: float 3s ease-in-out infinite;
```

`prefers-reduced-motion: reduce` 下已通过全局规则禁用（`animation-duration: 0.01ms`）。

---

## 6. 实现技术要点

### 6.1 滑块位置计算的 JS 逻辑

FilterTabs 和 PrioritySelector 的滑块定位逻辑一致，核心步骤：

```typescript
// 伪代码
function updateSlider(sliderEl: HTMLElement, targetTabEl: HTMLElement, containerEl: HTMLElement) {
  const containerPadding = parseFloat(getComputedStyle(containerEl).paddingLeft)
  const offsetX = targetTabEl.offsetLeft - containerPadding
  sliderEl.style.width = `${targetTabEl.offsetWidth}px`
  sliderEl.style.transform = `translateX(${offsetX}px)`
}
```

需在以下时机调用：
1. `onMounted` — 初始化滑块位置
2. `watch(modelValue)` — 切换时更新位置
3. `ResizeObserver` 监听容器宽度变化 — 响应式适配

### 6.2 ResizeObserver 响应式适配

```typescript
const resizeObserver = new ResizeObserver(() => {
  updateSlider(sliderRef.value, activeTabRef.value, containerRef.value)
})
onMounted(() => {
  resizeObserver.observe(containerRef.value)
})
onUnmounted(() => {
  resizeObserver.disconnect()
})
```

### 6.3 移动端适配

**FilterTabs 移动端**：
- 滑块高度从 `30px` 调整为 `28px`（与移动端 Tab 高度一致）
- 容器 padding 保持 `3px`
- `@media (max-width: 767px)` 中同步调整

**PrioritySelector 移动端**：
- 按钮变为 `flex: 1` 等宽分布
- 滑块宽度跟随按钮宽度（由 `offsetWidth` 自动获取）

---

## 7. 涉及文件清单

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/frontend/src/components/FilterTabs.vue` | 修改 | 增加滑块 div + JS 位置计算 + CSS 调整 |
| `src/frontend/src/components/PrioritySelector.vue` | 修改 | 增加滑块 div + JS 位置计算 + CSS 调整 |
| `src/frontend/src/components/TaskItem.vue` | 修改 | 增加优先级小圆点 span |
| `src/frontend/src/components/EmptyState.vue` | 确认 | SVG 配色已符合规范（v0.3.0 已更新） |
| `src/frontend/src/assets/styles/variables.css` | 不变更 | 无需新增 CSS 变量 |

---

## 8. 验收检查清单

### DES-401 过滤器 Tab 滑块

- [ ] 切换 Tab 时滑块平滑滑动到目标位置
- [ ] 滑动方向正确（左到右 / 右到左）
- [ ] 滑块背景白色 + `shadow-1` 阴影
- [ ] 滑块尺寸与目标 Tab 完全吻合
- [ ] 动画时长 200ms，缓动 ease-in-out
- [ ] `prefers-reduced-motion` 下降级为瞬时跳转 + 颜色过渡
- [ ] 不影响 `v-model`、`role="tab"`、`aria-selected` 等功能属性
- [ ] 移动端滑块高度 28px，位置计算正确
- [ ] 窗口 resize 时滑块位置自适应

### DES-402 优先级选择器滑块

- [ ] 切换优先级时滑块平滑滑动到目标位置
- [ ] 滑块背景色跟随目标优先级色（高=红底/中=橙底/低=绿底）
- [ ] 滑块边框色跟随目标优先级边框色
- [ ] 动画时长 200ms，缓动 ease-in-out
- [ ] `prefers-reduced-motion` 下降级为瞬时跳转 + 颜色过渡
- [ ] 不影响 `role="radiogroup"`、`role="radio"`、`aria-checked` 语义
- [ ] 移动端三个按钮等宽，滑块跟随正确
- [ ] 不影响键盘导航

### DES-403 优先级小圆点

- [ ] 圆点尺寸 6px，正圆
- [ ] 高优先级=红色(#DC2626)，中=橙色(#D97706)，低=绿色(#059669)
- [ ] 已完成任务圆点变灰(#94A3B8)
- [ ] 圆点位于复选框右侧、文字左侧
- [ ] 与相邻元素间距 8px（由 flex gap 提供）
- [ ] 移动端圆点清晰可见

### DES-404 空状态 SVG 配色

- [ ] SVG 主线条 stroke 为 `#4F46E5`
- [ ] SVG 辅助线 stroke 为 `#C7D2FE`
- [ ] SVG 填充 fill 为 `#EEF2FF`
- [ ] 浮动动画正常工作
- [ ] `prefers-reduced-motion` 下浮动动画禁用
- [ ] 移动端缩小后仍清晰可辨

---

## 9. 待确认项

无。所有设计参数已在 PRD 和 v0.3.0 设计规范中明确定义。

---

**文档结束**
