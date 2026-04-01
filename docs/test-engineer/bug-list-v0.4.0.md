# Bug 清单 v0.4.0

**版本**: v0.4.0
**测试日期**: 2026-04-01
**测试工程师**: 小虾米
**测试方法**: 静态代码审查（TypeScript 编译 + 源码逐行审查）

---

## Bug 清单

| ID | 标题 | 优先级 | 状态 | 负责角色 |
|----|------|--------|------|----------|
| B001 | TaskItem 高度不固定导致虚拟滚动位置计算错误 | P0 | 已验证 | 前端工程师 |
| B002 | 虚拟滚动模式下任务项之间缺少间距 | P0 | 已验证 | 前端工程师 |
| B003 | EmptyState float 动画未适配 prefers-reduced-motion | P1 | 已验证 | 前端工程师 |
| B004 | FilterTabs reduced-motion 降级方式不符合设计规范 | P2 | 已验证 | 前端工程师 |
| B005 | PrioritySelector 选中态样式依赖 aria-label 硬编码 | P2 | 已验证 | 前端工程师 |

---

## Bug 详情

### B001 -- TaskItem 高度不固定导致虚拟滚动位置计算错误

- **优先级**: P0
- **负责角色**: 前端工程师
- **状态**: 已验证
- **关联任务**: QA-401, QA-402
- **复现步骤**:
  1. 准备 50 条以上任务数据（触发虚拟滚动模式）
  2. 滚动到列表中间位置
  3. 观察任务项之间是否出现重叠或过大间距
  4. 点击某个任务的编辑按钮，观察该任务项高度变化导致后续项位置偏移
- **期望行为**:
  - TaskItem 在正常显示模式下高度恒定为 `estimateSize` 指定的 72px
  - TaskItem 在编辑模式下高度仍保持 72px（或虚拟滚动器能正确感知高度变化）
  - 滚动到任意位置时，任务项之间无重叠或间隙
- **实际行为**:
  - `TaskList.vue` 第 89 行设置 `TASK_ITEM_HEIGHT = 72`，作为 `estimateSize` 传给虚拟滚动器
  - `TaskItem.vue` 没有设置固定高度（`height`/`min-height`/`max-height`），实际正常模式高度约 50px（14px padding * 2 + 22px checkbox = 50px），编辑模式高度约 120px+
  - 虚拟滚动器按 72px 间距排列，但每个 TaskItem 实际高度不一致，导致间距过大（正常模式）或重叠（编辑模式）
- **关联接口/页面**: TaskList.vue, TaskItem.vue
- **修复建议**:
  1. 给 `.task-item` 设置 `height: 62px`（72px - 10px gap），确保正常模式高度固定
  2. 给 `.task-item__edit` 设置 `overflow-y: auto` 和固定容器高度，编辑内容在固定高度内滚动
  3. 或者在 TaskItem 内部用 `isEditing` 状态控制整体高度不变

---

### B002 -- 虚拟滚动模式下任务项之间缺少间距

- **优先级**: P0
- **负责角色**: 前端工程师
- **状态**: 已验证
- **关联任务**: QA-401, QA-402
- **复现步骤**:
  1. 准备 50 条以上任务数据
  2. 观察虚拟滚动列表中任务项之间的间距
  3. 对比普通列表模式（< 50 条）下的间距
- **期望行为**: 虚拟滚动模式下的任务项间距与普通列表模式一致（10px gap）
- **实际行为**:
  - 普通列表模式使用 `gap: 10px`（TaskList.vue 第 232 行）
  - 虚拟滚动模式使用 absolute 定位，`estimateSize` 为 72px，但 TaskItem 实际高度约 50px，多出的 22px 作为间距
  - 然而，由于 B001 导致 TaskItem 高度不固定，间距的实际表现取决于 TaskItem 的真实高度
  - 即使 TaskItem 高度被修正为固定值，虚拟滚动模式也没有使用 CSS gap，间距完全依赖 `estimateSize - 实际高度` 的差值
  - 这种方式不够健壮，如果 TaskItem 高度或 gap 值调整，间距会失效
- **关联接口/页面**: TaskList.vue
- **修复建议**:
  1. 在虚拟滚动的每个 wrapper div 上添加 `padding-bottom: 10px` 或 `margin-bottom` 实现间距
  2. 或者在 `estimateSize` 中包含 gap 值，并确保 TaskItem 高度 = estimateSize - gap
  3. 建议将间距逻辑显式化，不依赖隐式差值

---

### B003 -- EmptyState float 动画未适配 prefers-reduced-motion

- **优先级**: P1
- **负责角色**: 前端工程师
- **状态**: 已验证
- **关联任务**: QA-403, QA-405
- **复现步骤**:
  1. 在操作系统设置中开启 "减弱动态效果" / "prefers-reduced-motion"
  2. 打开应用，清空所有任务或切换到一个无结果的过滤器
  3. 观察空状态图标的浮动动画
- **期望行为**: 在 `prefers-reduced-motion: reduce` 下，空状态图标不应有持续的浮动动画（`float` keyframe 动画应被禁用），可以有简单的淡入效果
- **实际行为**: `EmptyState.vue` 的 `.empty-state__icon` 始终播放 `float 3s ease-in-out infinite` 动画（第 93 行），没有 `@media (prefers-reduced-motion: reduce)` 降级规则
- **关联接口/页面**: EmptyState.vue
- **修复建议**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .empty-state__icon {
      animation: none;
    }
    .empty-state {
      animation: none;
    }
  }
  ```

---

### B004 -- FilterTabs reduced-motion 降级方式不符合设计规范

- **优先级**: P2
- **负责角色**: 前端工程师
- **状态**: 已验证
- **关联任务**: QA-403, QA-405
- **复现步骤**:
  1. 开启 `prefers-reduced-motion: reduce`
  2. 切换过滤器 Tab（全部 / 未完成 / 已完成）
  3. 观察滑块行为
- **期望行为**: 根据架构文档 DES-401 设计规范，`prefers-reduced-motion` 下降级为"仅 background-color 过渡"，禁用 translateX 位移动画
- **实际行为**: `FilterTabs.vue` 第 147-149 行降级为 `transition: width 200ms`，移除了 `transform` 但保留了 `width` 过渡。`width` 变化会导致布局重排（reflow），在减弱动态效果模式下仍可能造成不适
- **关联接口/页面**: FilterTabs.vue
- **修复建议**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .filter-tabs__slider {
      transition: none; /* 完全禁用动画 */
    }
  }
  ```
  或者按设计规范仅保留 background-color 过渡（但滑块本身背景色不变，所以可以直接 `transition: none`）

---

### B005 -- PrioritySelector 选中态样式依赖 aria-label 硬编码

- **优先级**: P2
- **负责角色**: 前端工程师
- **状态**: 已验证
- **关联任务**: QA-403
- **复现步骤**:
  1. 检查 PrioritySelector.vue 第 179-198 行的 CSS
  2. 注意到中和低优先级的选中态颜色通过 `aria-label` 属性选择器覆盖
- **期望行为**: 选中态文字颜色应通过统一的方式根据优先级动态设置，不依赖 aria-label 的具体文案
- **实际行为**:
  - 第 179 行 `.priority-option--active[aria-checked="true"]` 使用 `var(--priority-high-color)`（红色）
  - 第 186 行 `.priority-option[aria-label="中优先级"].priority-option--active` 覆盖为 `var(--priority-medium-color)`
  - 第 193 行 `.priority-option[aria-label="低优先级"].priority-option--active` 覆盖为 `var(--priority-low-color)`
  - 如果 aria-label 文案变更（如国际化），CSS 选择器将失效
- **关联接口/页面**: PrioritySelector.vue
- **修复建议**:
  使用优先级 class 替代 aria-label 选择器：
  ```css
  .priority-option--high.priority-option--active {
    color: var(--priority-high-color);
  }
  .priority-option--medium.priority-option--active {
    color: var(--priority-medium-color);
  }
  .priority-option--low.priority-option--active {
    color: var(--priority-low-color);
  }
  ```
  并在模板中添加对应的 class。

---

**文档结束**
