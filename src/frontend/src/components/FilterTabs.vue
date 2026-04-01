<template>
  <div
    class="filter-tabs"
    role="tablist"
  >
    <button
      v-for="filter in filters"
      :key="filter.value"
      class="filter-tab"
      :class="{ 'filter-tab--active': modelValue === filter.value }"
      type="button"
      :aria-selected="modelValue === filter.value"
      :aria-controls="`tabpanel-${filter.value}`"
      role="tab"
      @click="$emit('update:modelValue', filter.value)"
    >
      {{ filter.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { FilterType } from '@/types/task.types'

interface Props {
  modelValue: FilterType
}

defineProps<Props>()

defineEmits<{
  (e: 'update:modelValue', value: FilterType): void
}>()

const filters: Array<{ value: FilterType; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'uncompleted', label: '未完成' },
  { value: 'completed', label: '已完成' }
]
</script>

<style scoped>
.filter-tabs {
  display: flex;
  gap: 2px;
  background: var(--color-surface-dim);
  border-radius: var(--radius-md);
  padding: 3px;
}

.filter-tab {
  height: 30px;
  padding: 0 16px;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-normal) var(--easing-standard);
}

.filter-tab:hover {
  background: rgba(255, 255, 255, 0.6);
  color: var(--color-text-primary);
}

.filter-tab--active {
  color: var(--color-primary);
  background: var(--color-surface);
  box-shadow: var(--shadow-1);
}

.filter-tab:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* 移动端适配 */
@media (max-width: 767px) {
  .filter-tabs {
    gap: 2px;
  }

  .filter-tab {
    height: 28px;
    padding: 0 12px;
    font-size: var(--font-size-xsmall);
  }
}
</style>
