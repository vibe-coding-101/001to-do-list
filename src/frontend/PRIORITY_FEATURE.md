# 优先级选择功能实现说明

**版本**: v0.2.0
**日期**: 2026-04-01
**工程师**: 小虾米

## 功能概述

实现了任务优先级选择功能，用户可以在创建任务和编辑任务时设置优先级（高/中/低）。

## 实现文件

### 新增文件

1. **`src/components/PrioritySelector.vue`**
   - 优先级选择器组件
   - 使用分段控制器（Segmented Control）样式
   - 支持键盘导航和无障碍访问
   - 包含安全验证（SR-004）

### 修改文件

2. **`src/components/TaskInput.vue`**
   - 添加 `PrioritySelector` 组件
   - 新增 `selectedPriority` 状态（默认 'medium'）
   - 提交时使用选中的优先级
   - 布局优化：支持 flex-wrap 换行

3. **`src/components/TaskItem.vue`**
   - 编辑模式中添加 `PrioritySelector` 组件
   - 新增 `editPriority` 状态
   - 保存时同时更新文本和优先级

4. **`src/types/task.types.ts`**
   - 导出 `Priority` 类型别名

5. **`docs/frontend-engineer/frontend-notes.md`**
   - 更新开发说明文档
   - 添加 v0.2.0 变更记录

## 技术特性

### 1. 组件设计

**Props**:
- `modelValue`: 当前选中的优先级 ('high' | 'medium' | 'low')
- `ariaLabel`: 无障碍标签（默认 '选择优先级'）

**Events**:
- `update:modelValue`: 优先级变化时触发

**样式**:
- 桌面端：内联布局，36px 高度
- 移动端：全宽度，44px 高度，均匀分布
- 颜色方案符合设计规范

### 2. 安全验证（SR-004）

```typescript
// 运行时验证优先级值
const handleSelect = (value: 'high' | 'medium' | 'low') => {
  if (value === 'high' || value === 'medium' || value === 'low') {
    emit('update:modelValue', value)
  } else {
    console.error('[Security] Invalid priority value:', value)
  }
}
```

### 3. 无障碍支持

- `role="radiogroup"`: 优先级选择器容器
- `role="radio"`: 每个优先级选项
- `aria-label`: 描述性标签
- `aria-checked`: 当前选中状态
- 键盘导航：Tab 切换，Enter 选中

### 4. 响应式设计

**断点**:
- Mobile (< 768px): 全宽度布局
- Desktop (>= 768px): 内联布局

**触摸优化**:
- 移动端最小触摸区域 36px × 36px
- 按钮间距符合人体工学

## 设计规范遵循

参考 `docs/ux-ui-designer/design-spec.md` 第 5.6 节：

### 优先级选择器样式

**默认态**:
- 容器背景: `#F3F4F6`
- 边框: `#E5E7EB`
- 内边距: 2px
- 圆角: 4px

**按钮选中态**:
- 高优先级: 红色主题 (`#DC2626`)
- 中优先级: 橙色主题 (`#D97706`)
- 低优先级: 绿色主题 (`#059669`)

**交互动画**:
- 悬停: 背景变化 150ms
- 点击: 缩放 0.98
- 焦点: 外发光效果

## 测试清单

- [x] TypeScript 类型检查通过
- [x] 生产构建成功
- [ ] 创建任务时优先级正确保存
- [ ] 编辑任务时优先级正确更新
- [ ] 优先级选择器键盘导航正常
- [ ] 移动端响应式布局正常
- [ ] 无障碍屏幕阅读器支持
- [ ] 安全验证（非法值被拒绝）

## 使用示例

### 在 TaskInput 中使用

```vue
<template>
  <div class="input-wrapper">
    <input v-model="inputText" type="text" />
    <PrioritySelector
      v-model="selectedPriority"
      aria-label="选择新任务优先级"
    />
    <button @click="handleSubmit">添加</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PrioritySelector from './PrioritySelector.vue'
import type { Priority } from '@/types/task.types'

const selectedPriority = ref<Priority>('medium')
</script>
```

### 在 TaskItem 中使用

```vue
<template>
  <div class="edit-mode">
    <input v-model="editText" type="text" />
    <PrioritySelector
      v-model="editPriority"
      aria-label="选择任务优先级"
    />
    <button @click="saveEdit">保存</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PrioritySelector from './PrioritySelector.vue'
import type { Priority } from '@/types/task.types'

const editPriority = ref<Priority>('medium')
</script>
```

## 后续优化建议

1. **动画优化**: 添加优先级切换时的过渡动画
2. **快捷键**: 支持数字键 1/2/3 快速选择优先级
3. **自定义颜色**: 允许用户自定义优先级颜色
4. **批量操作**: 支持批量修改任务优先级

## 相关文档

- 设计规范: `docs/ux-ui-designer/design-spec.md`
- 安全需求: `docs/security-engineer/security-requirements.md`
- 前端说明: `docs/frontend-engineer/frontend-notes.md`

---

**实现完成**: 2026-04-01
**构建状态**: ✅ 成功
**TypeScript 检查**: ✅ 通过
