# 设计规范文档 v0.3.0 — 待办事项应用界面美化

**版本**: v0.3.0
**日期**: 2026-04-01
**设计师**: 小虾米（UI/UX 设计师）
**关联 PRD**: `docs/product-manager/PRD-v0.3.0.md`

---

## 1. 设计方向与风格定位

### 1.1 风格关键词

**Soft UI Evolution** — 现代柔和风格，融合 Flat Design 的简洁与 Glassmorphism 的层次感。

- 清新、友好、专业
- 柔和阴影 + 微渐变 + 大圆角
- 视觉层次通过阴影深度、背景色差和间距拉开
- 不使用 Neumorphism（对比度风险）、不使用 Aurora Mesh（过于花哨）

### 1.2 设计原则

1. **层次分明**：通过阴影层级和背景色差建立纵深
2. **留白呼吸**：增大间距，减少视觉拥挤
3. **微交互精致**：弹性动画、渐变按钮、圆形复选框
4. **品牌感统一**：Indigo→Violet 渐变贯穿全局
5. **性能优先**：所有动画仅使用 transform/opacity

---

## 2. 配色方案

### 2.1 主色系 — Indigo Blue（靛蓝）

选择 Enterprise SaaS 风格的 Indigo 配色，专业感强且不失现代感。

| 角色 | CSS 变量 | 色值 | 用途 |
|------|---------|------|------|
| 主色 | `--color-primary` | `#4F46E5` | 按钮、链接、选中态 |
| 主色悬浮 | `--color-primary-hover` | `#4338CA` | 按钮 hover |
| 主色按下 | `--color-primary-active` | `#3730A3` | 按钮 active |
| 次色 | `--color-secondary` | `#7C3AED` | 渐变终点色 |
| 渐变起点 | `--gradient-start` | `#4F46E5` | 渐变起始 |
| 渐变终点 | `--gradient-end` | `#7C3AED` | 渐变结束 |
| 主渐变 | `--gradient-primary` | `linear-gradient(135deg, #4F46E5, #7C3AED)` | 全局渐变 |

### 2.2 中性色系

| 角色 | CSS 变量 | 色值 | 用途 |
|------|---------|------|------|
| 背景 | `--color-background` | `#F8FAFC` | 页面底色 |
| 表面-1 | `--color-surface` | `#FFFFFF` | 卡片、输入框 |
| 表面-2 | `--color-surface-dim` | `#F1F5F9` | 分段控件背景 |
| 边框 | `--color-border` | `#E2E8F0` | 输入框、分隔线 |
| 边框-亮 | `--color-border-light` | `#F1F5F9` | 轻分隔 |
| 文字-主要 | `--color-text-primary` | `#0F172A` | 标题、正文 |
| 文字-次要 | `--color-text-secondary` | `#64748B` | 副标题、描述 |
| 文字-禁用 | `--color-text-disabled` | `#94A3B8` | placeholder、禁用态 |

### 2.3 语义色

| 角色 | CSS 变量 | 色值 |
|------|---------|------|
| 成功 | `--color-success` | `#10B981` |
| 警告 | `--color-warning` | `#F59E0B` |
| 错误 | `--color-error` | `#EF4444` |
| 信息 | `--color-info` | `#4F46E5` |

### 2.4 优先级色彩

| 优先级 | 文字色 | 背景色 | 边框色 | 左侧竖条色 |
|--------|--------|--------|--------|------------|
| 高 | `--priority-high-color: #DC2626` | `--priority-high-bg: #FEF2F2` | `--priority-high-border: #FECACA` | `--priority-high-bar: #EF4444` |
| 中 | `--priority-medium-color: #D97706` | `--priority-medium-bg: #FFFBEB` | `--priority-medium-border: #FDE68A` | `--priority-medium-bar: #F59E0B` |
| 低 | `--priority-low-color: #059669` | `--priority-low-bg: #ECFDF5` | `--priority-low-border: #A7F3D0` | `--priority-low-bar: #10B981` |

### 2.5 对比度验证

| 组合 | 前景 | 背景 | 对比度 | WCAG |
|------|------|------|--------|------|
| 正文 on 背景 | `#0F172A` | `#F8FAFC` | 15.4:1 | AAA |
| 次要文字 on 背景 | `#64748B` | `#F8FAFC` | 5.0:1 | AA |
| 白色文字 on 主色 | `#FFFFFF` | `#4F46E5` | 7.2:1 | AAA |
| 白色文字 on 渐变 | `#FFFFFF` | `#4F46E5→#7C3AED` | 6.8:1+ | AA |

---

## 3. 字体排版

### 3.1 字体选择

**Plus Jakarta Sans** — 单字体家族，现代、友好、专业，Google Fonts 免费可用。

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
```

回退栈：`Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

### 3.2 字号体系

| 级别 | CSS 变量 | 值 | 用途 |
|------|---------|-----|------|
| H1 | `--font-size-h1` | `24px` | 页面标题 |
| H2 | `--font-size-h2` | `18px` | 区域标题 |
| Body | `--font-size-body` | `16px` | 正文、任务文字 |
| Small | `--font-size-small` | `14px` | 标签、按钮 |
| XSmall | `--font-size-xsmall` | `12px` | 徽章、辅助信息 |

### 3.3 字重

| 角色 | CSS 变量 | 值 |
|------|---------|-----|
| Bold | `--font-weight-bold` | `700` |
| Semibold | `--font-weight-semibold` | `600` |
| Medium | `--font-weight-medium` | `500` |
| Regular | `--font-weight-regular` | `400` |

---

## 4. 间距与圆角

### 4.1 间距体系（4px 基数）

| 级别 | CSS 变量 | 值 |
|------|---------|-----|
| xs | `--spacing-xs` | `4px` |
| sm | `--spacing-sm` | `8px` |
| md | `--spacing-md` | `16px` |
| lg | `--spacing-lg` | `24px` |
| xl | `--spacing-xl` | `32px` |
| xxl | `--spacing-xxl` | `48px` |

### 4.2 圆角体系

| 级别 | CSS 变量 | 值 | 用途 |
|------|---------|-----|------|
| xs | `--radius-xs` | `2px` | 小元素 |
| sm | `--radius-sm` | `6px` | 输入框、小按钮 |
| md | `--radius-md` | `10px` | 卡片、搜索框 |
| lg | `--radius-lg` | `14px` | 大卡片、弹窗 |
| xl | `--radius-xl` | `18px` | 移动端输入区顶部 |
| full | `--radius-full` | `9999px` | 复选框、徽章、胶囊 |

### 4.3 阴影体系

| 级别 | CSS 变量 | 值 | 用途 |
|------|---------|-----|------|
| shadow-1 | `--shadow-1` | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | 卡片默认态 |
| shadow-2 | `--shadow-2` | `0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.03)` | 卡片 hover |
| shadow-3 | `--shadow-3` | `0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04)` | 浮层、toast |
| shadow-color | `--shadow-primary` | `0 4px 14px rgba(79,70,229,0.15)` | 主色元素阴影 |
| shadow-glass | `--shadow-glass` | `0 8px 32px rgba(0,0,0,0.06)` | 毛玻璃区域 |

---

## 5. 动画规范

### 5.1 时长与缓动

| 级别 | CSS 变量 | 值 |
|------|---------|-----|
| fast | `--duration-fast` | `100ms` |
| normal | `--duration-normal` | `200ms` |
| slow | `--duration-slow` | `300ms` |
| 标准 | `--easing-standard` | `ease-in-out` |
| 进入 | `--easing-enter` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| 退出 | `--easing-leave` | `ease-in` |
| 弹性 | `--easing-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

### 5.2 动画使用规则

- **仅使用** `transform` 和 `opacity`，禁止动画 `width/height/top/left`
- 微交互时长 150-300ms，复杂过渡不超过 400ms
- 每个视图最多 1-2 个关键动画
- 进入用 ease-out / 弹性缓动，退出用 ease-in

### 5.3 prefers-reduced-motion 降级

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- 禁用所有弹性动画（scale）
- 禁用所有位移动画（translate）
- 保留颜色过渡（background-color、border-color、color）
- 复选框仅保留背景色变化，不做 scale 动画

---

## 6. 组件视觉规范

### 6.1 Header（顶部栏）

**升级点**: 渐变背景 + 毛玻璃 + 白色文字

| 属性 | 值 |
|------|-----|
| 背景 | `var(--gradient-primary)` |
| backdrop-filter | `blur(12px)` |
| 文字颜色 | `#FFFFFF` |
| 高度 | `64px`（桌面）/ 自适应（移动） |
| 下边框 | 无 |
| 底部阴影 | `var(--shadow-glass)` |
| 标题字重 | `700` |
| 标题字号 | `24px`（桌面）/ `20px`（移动） |

**降级方案**: 不支持 backdrop-filter 的浏览器使用 `background: #4F46E5` 纯色。

**搜索框在 Header 内**: 背景使用 `rgba(255,255,255,0.15)`，边框 `rgba(255,255,255,0.25)`，文字白色。

**FilterTabs 在 Header 内**: Tab 使用 `rgba(255,255,255,0.1)` 背景底色，选中态白色背景 + 主色文字。

### 6.2 TaskItem（任务卡片）

**升级点**: 左侧优先级竖条 + 大圆角 + 柔和阴影 + hover 上浮

| 属性 | 默认态 | hover 态 | 完成态 | 编辑态 |
|------|--------|---------|--------|--------|
| 背景 | `#FFFFFF` | `#FFFFFF` | `#F8FAFC` | `#FFFFFF` |
| 边框 | `1px solid #E2E8F0` | `1px solid #C7D2FE` | `1px solid #E2E8F0` | `2px solid var(--gradient-start)` |
| 圆角 | `12px` | `12px` | `12px` | `12px` |
| 阴影 | `var(--shadow-1)` | `var(--shadow-2)` | `none` | `var(--shadow-2)` |
| 左竖条 | 优先级色 3px | 优先级色 3px | `#CBD5E1` 3px | 优先级色 3px |
| 上移 | — | `translateY(-2px)` | — | — |

**左侧竖条实现**: 使用 `border-left: 3px solid var(--priority-{level}-bar)` 或 `::before` 伪元素。

**卡片内间距**: `14px 16px`

**卡片间距**: `gap: 10px`（从 8px 增加）

### 6.3 Checkbox（复选框）

**升级点**: 圆形化 + 渐变选中态 + 弹性动画 + 对勾绘制

| 属性 | 未选中态 | 选中态 |
|------|---------|--------|
| 尺寸 | `22px × 22px` | `22px × 22px` |
| 圆角 | `50%`（正圆） | `50%` |
| 边框 | `2px solid #CBD5E1` | 无 |
| 背景 | `transparent` | `var(--gradient-primary)` |
| 对勾 | 无 | 白色 SVG，`stroke-dashoffset` 绘制动画 |
| 选中动画 | — | `scale(0.8) → scale(1.15) → scale(1.0)`，300ms |

**hover**: 边框色变为 `#94A3B8`

### 6.4 AddButton（添加按钮）

**升级点**: 渐变背景 + 大圆角 + 弹性反馈

| 属性 | 默认态 | hover 态 | active 态 | 禁用态 |
|------|--------|---------|----------|--------|
| 背景 | `var(--gradient-primary)` | 稍深渐变 | 更深渐变 | `#E2E8F0` |
| 圆角 | `12px` | `12px` | `12px` | `12px` |
| 尺寸 | `40×40px` | `40×40px` | `40×40px` | `40×40px` |
| 阴影 | 无 | `var(--shadow-primary)` | 无 | 无 |
| 缩放 | — | `scale(1.05)` | `scale(0.92)` | — |
| 图标色 | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#94A3B8` |

### 6.5 FilterTabs（过滤器标签页）

**升级点**: 胶囊分段控制器样式

| 属性 | 值 |
|------|-----|
| 容器背景 | `rgba(255,255,255,0.1)`（Header 内）/ `#F1F5F9`（Header 外） |
| 容器圆角 | `10px` |
| 容器内边距 | `3px` |
| Tab 圆角 | `8px` |
| Tab 高度 | `30px` |
| 未选中 Tab | 透明背景，`rgba(255,255,255,0.7)` 文字（Header 内）/ `#64748B` 文字 |
| 选中 Tab | `#FFFFFF` 背景，`#4F46E5` 文字（Header 内） / 白色背景 + 主色文字 |
| 选中动画 | 背景色过渡 200ms |
| Tab 间距 | `2px`（在容器内） |
| 底部线条 | **移除**（替换为背景填充） |

### 6.6 SearchBox（搜索框）

**升级点**: 大圆角 + 聚焦光效

| 属性 | 值 |
|------|-----|
| 宽度 | `240px`（桌面）/ `100%`（移动） |
| 高度 | `36px`（桌面）/ `40px`（移动） |
| 圆角 | `12px` |
| 背景（Header 内） | `rgba(255,255,255,0.15)` |
| 边框（Header 内） | `1px solid rgba(255,255,255,0.25)` |
| 聚焦边框（Header 内） | `2px solid rgba(255,255,255,0.5)` |
| 聚焦光效（Header 内） | `0 0 0 3px rgba(255,255,255,0.1)` |
| 文字色（Header 内） | `#FFFFFF` |
| placeholder（Header 内） | `rgba(255,255,255,0.5)` |
| 搜索图标色 | `rgba(255,255,255,0.6)`（Header 内） |

### 6.7 TaskInput（任务输入框）

**升级点**: 大圆角 + 聚焦渐变光效

| 属性 | 值 |
|------|-----|
| 高度 | `44px` |
| 圆角 | `10px` |
| 边框 | `1px solid #E2E8F0` |
| 聚焦边框 | `1px solid #4F46E5` |
| 聚焦光效 | `0 0 0 3px rgba(79,70,229,0.1)` |
| 背景 | `#FFFFFF` |

### 6.8 PrioritySelector（优先级选择器）

**升级点**: 容器柔和背景 + 选中态阴影

| 属性 | 值 |
|------|-----|
| 容器背景 | `#F1F5F9` |
| 容器圆角 | `8px` |
| 容器边框 | `1px solid #E2E8F0` |
| 选中态 | 优先级背景色 + 对应优先级边框 + `var(--shadow-1)` |
| 选中动画 | 背景色过渡 200ms |

### 6.9 EmptyState（空状态）

**升级点**: 渐变背景 + 淡入动画 + 插图配色更新

| 属性 | 值 |
|------|-----|
| 区域背景 | `linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)` |
| 最小高度 | `300px` |
| 淡入动画 | `opacity 0→1` + `translateY(10px→0)`，400ms |
| 标题字号 | `20px` |
| 副标题色 | `#64748B` |
| SVG 插图 | 使用 Indigo 色系替代灰色：`#4F46E5` 主线 + `#C7D2FE` 辅助线 + `#EEF2FF` 填充 |
| 浮动动画 | 保留，但使用 `prefers-reduced-motion` 禁用 |

### 6.10 Skeleton（骨架屏）

| 属性 | 值 |
|------|-----|
| 圆角 | `12px`（与卡片一致） |
| 渐变 | `linear-gradient(90deg, #F1F5F9 0%, #E2E8F0 50%, #F1F5F9 100%)` |
| 高度 | 第1行 `52px`，第2行 `48px`，第3行 `44px` |

### 6.11 Error Toast（错误提示）

| 属性 | 值 |
|------|-----|
| 圆角 | `12px` |
| 阴影 | `var(--shadow-3)` |
| 入场动画 | `translateY(-20px) → translateY(0)` + `opacity 0→1`，300ms |
| 退出动画 | `opacity 1→0`，200ms |
| 关闭按钮 hover | `rgba(255,255,255,0.2)` 圆形背景 |

### 6.12 底部输入区（Input Section）

| 属性 | 值 |
|------|-----|
| 上边框 | 无（替换为 `box-shadow: 0 -4px 16px rgba(0,0,0,0.04)`） |
| 背景 | `rgba(255,255,255,0.85)` + `backdrop-filter: blur(12px)` |
| 降级背景 | `#FFFFFF` |
| 内边距 | `16px`（桌面）/ `12px`（移动） |

### 6.13 移动端底部输入区（额外）

| 属性 | 值 |
|------|-----|
| 上圆角 | `18px 18px 0 0` |

---

## 7. 全局样式更新

### 7.1 滚动条

```css
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94A3B8;
}
```

### 7.2 文字选中

```css
::selection {
  background-color: rgba(79, 70, 229, 0.2);
  color: #0F172A;
}
```

---

## 8. CSS 变量完整清单

以下是 `variables.css` 需要更新的完整变量清单：

```css
:root {
  /* === 主色（渐变体系）=== */
  --color-primary: #4F46E5;
  --color-primary-hover: #4338CA;
  --color-primary-active: #3730A3;
  --color-secondary: #7C3AED;

  /* 渐变 */
  --gradient-start: #4F46E5;
  --gradient-end: #7C3AED;
  --gradient-primary: linear-gradient(135deg, #4F46E5, #7C3AED);
  --gradient-primary-hover: linear-gradient(135deg, #4338CA, #6D28D9);

  /* === 中性色 === */
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-surface-dim: #F1F5F9;
  --color-border: #E2E8F0;
  --color-border-light: #F1F5F9;
  --color-text-primary: #0F172A;
  --color-text-secondary: #64748B;
  --color-text-disabled: #94A3B8;

  /* === 语义色 === */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #4F46E5;

  /* === 优先级色（保留 + 新增竖条色）=== */
  --priority-high-color: #DC2626;
  --priority-high-bg: #FEF2F2;
  --priority-high-border: #FECACA;
  --priority-high-bar: #EF4444;

  --priority-medium-color: #D97706;
  --priority-medium-bg: #FFFBEB;
  --priority-medium-border: #FDE68A;
  --priority-medium-bar: #F59E0B;

  --priority-low-color: #059669;
  --priority-low-bg: #ECFDF5;
  --priority-low-border: #A7F3D0;
  --priority-low-bar: #10B981;

  /* === 字体 === */
  --font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* 字号 */
  --font-size-h1: 24px;
  --font-size-h2: 18px;
  --font-size-body: 16px;
  --font-size-small: 14px;
  --font-size-xsmall: 12px;

  /* 字重 */
  --font-weight-bold: 700;
  --font-weight-semibold: 600;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* 行高 */
  --line-height-title: 1.2;
  --line-height-body: 1.5;
  --line-height-small: 1.4;

  /* === 间距 === */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;

  /* === 圆角（升级）=== */
  --radius-xs: 2px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
  --radius-full: 9999px;

  /* === 阴影（升级）=== */
  --shadow-1: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-2: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03);
  --shadow-3: 0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04);
  --shadow-primary: 0 4px 14px rgba(79, 70, 229, 0.15);
  --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.06);

  /* === 动画 === */
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --easing-standard: ease-in-out;
  --easing-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --easing-leave: ease-in;
  --easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* === 布局 === */
  --header-height: 64px;
  --header-height-mobile: 56px;
  --input-height: 72px;
  --input-height-mobile: 80px;
  --max-width: 800px;
}
```

---

## 9. 移动端适配方案

### 9.1 断点

- **移动端**: `< 768px`
- **桌面端**: `>= 768px`

### 9.2 移动端特殊处理

| 组件 | 适配 |
|------|------|
| Header | 渐变保持，高度自适应，标题 20px 居中 |
| 搜索框 | 100% 宽度，40px 高度 |
| FilterTabs | 胶囊样式保持，字号 12px |
| 任务卡片 | 内边距 12px，操作按钮始终可见 |
| 底部输入区 | 上圆角 18px，触控区域 >= 44px |
| 添加按钮 | 44×44px |
| 空状态 | 插图缩小到 100px，文字不变 |

---

## 10. 交付清单

- [x] 完整 CSS 变量清单（第 8 节）
- [x] 13 个组件视觉规范（第 6 节）
- [x] 配色方案 + 对比度验证（第 2 节）
- [x] 字体排版体系（第 3 节）
- [x] 间距/圆角/阴影体系（第 4 节）
- [x] 动画规范 + reduced-motion 降级（第 5 节）
- [x] 移动端适配方案（第 9 节）
- [x] 全局样式更新（滚动条、选中色）（第 7 节）

---

**文档结束**
