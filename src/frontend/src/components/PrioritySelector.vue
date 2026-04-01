<template>
  <div
    class="priority-selector"
    role="radiogroup"
    :aria-label="ariaLabel"
  >
    <button
      v-for="option in priorityOptions"
      :key="option.value"
      class="priority-option"
      :class="{ 'priority-option--active': modelValue === option.value }"
      type="button"
      :aria-label="`${option.label}优先级`"
      :aria-checked="modelValue === option.value"
      role="radio"
      @click="handleSelect(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PRIORITY_CONFIG } from '@/utils/constants'

interface Props {
  modelValue: 'high' | 'medium' | 'low'
  ariaLabel?: string
}

interface Emits {
  (e: 'update:modelValue', value: 'high' | 'medium' | 'low'): void
}

defineProps<Props>()

const emit = defineEmits<Emits>()

// 优先级选项列表
const priorityOptions = computed(() => {
  return Object.entries(PRIORITY_CONFIG).map(([key, config]) => ({
    value: key as 'high' | 'medium' | 'low',
    label: config.label
  }))
})

// 处理选择事件，包含安全验证（SR-004）
const handleSelect = (value: 'high' | 'medium' | 'low') => {
  // 运行时验证：只接受合法的优先级值
  if (value === 'high' || value === 'medium' || value === 'low') {
    emit('update:modelValue', value)
  } else {
    console.error('[Security] Invalid priority value:', value)
  }
}
</script>

<style scoped>
.priority-selector {
  display: inline-flex;
  gap: var(--spacing-xs);
  padding: 2px;
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.priority-option {
  padding: 6px 12px;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--easing-standard);
  white-space: nowrap;
}

.priority-option:hover:not(.priority-option--active) {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.priority-option:active {
  transform: scale(0.98);
}

.priority-option:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* 高优先级选中态 */
.priority-option--active[aria-checked="true"] {
  background: var(--priority-high-bg);
  color: var(--priority-high-color);
  border: 1px solid var(--priority-high-border);
}

/* 中优先级选中态 - 通过 aria-label 区分 */
.priority-option[aria-label="中优先级"].priority-option--active {
  background: var(--priority-medium-bg);
  color: var(--priority-medium-color);
  border: 1px solid var(--priority-medium-border);
}

/* 低优先级选中态 */
.priority-option[aria-label="低优先级"].priority-option--active {
  background: var(--priority-low-bg);
  color: var(--priority-low-color);
  border: 1px solid var(--priority-low-border);
}

/* 移动端适配 */
@media (max-width: 767px) {
  .priority-selector {
    width: 100%;
    justify-content: space-between;
  }

  .priority-option {
    flex: 1;
    padding: 8px 12px;
    font-size: var(--font-size-body);
    min-height: 36px;
  }
}
</style>
