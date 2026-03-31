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
  gap: var(--spacing-sm);
}

.filter-tab {
  position: relative;
  height: 32px;
  padding: 0 16px;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--color-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-normal) var(--easing-standard);
}

.filter-tab:hover {
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.filter-tab--active {
  color: var(--color-primary);
  background: transparent;
}

.filter-tab--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
  border-radius: var(--radius-xs);
}

.filter-tab:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* 移动端适配 */
@media (max-width: 767px) {
  .filter-tabs {
    gap: var(--spacing-xs);
  }

  .filter-tab {
    height: 28px;
    padding: 0 12px;
    font-size: var(--font-size-xsmall);
  }
}
</style>
