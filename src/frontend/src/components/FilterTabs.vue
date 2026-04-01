<template>
  <div
    ref="containerRef"
    class="filter-tabs"
    role="tablist"
  >
    <!-- 滑块背景 -->
    <div
      ref="sliderRef"
      class="filter-tabs__slider"
      aria-hidden="true"
    />

    <button
      v-for="filter in filters"
      :key="filter.value"
      ref="tabRefs"
      class="filter-tab"
      :class="{ 'filter-tab--active': modelValue === filter.value }"
      type="button"
      :aria-selected="modelValue === filter.value"
      :aria-controls="`tabpanel-${filter.value}`"
      role="tab"
      @click="$emit('update:modelValue', filter.value)"
    >
      {{ filter.label }}
      <span class="filter-tab__count">{{ counts[filter.value] }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { FilterType } from '@/types/task.types'

interface Props {
  modelValue: FilterType
  totalCount?: number
  uncompletedCount?: number
  completedCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  totalCount: 0,
  uncompletedCount: 0,
  completedCount: 0
})

defineEmits<{
  (e: 'update:modelValue', value: FilterType): void
}>()

const counts = computed(() => ({
  all: props.totalCount,
  uncompleted: props.uncompletedCount,
  completed: props.completedCount
}))

const filters: Array<{ value: FilterType; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'uncompleted', label: '未完成' },
  { value: 'completed', label: '已完成' }
]

const containerRef = ref<HTMLElement>()
const sliderRef = ref<HTMLElement>()
const tabRefs = ref<HTMLElement[]>([])

/** 更新滑块位置和宽度 */
function updateSlider(): void {
  if (!containerRef.value || !sliderRef.value) return

  const activeIndex = filters.findIndex((f) => f.value === props.modelValue)
  const activeTab = tabRefs.value[activeIndex]
  if (!activeTab) return

  const containerPadding = parseFloat(getComputedStyle(containerRef.value).paddingLeft)
  const offsetX = activeTab.offsetLeft - containerPadding

  sliderRef.value.style.width = `${activeTab.offsetWidth}px`
  sliderRef.value.style.transform = `translateX(${offsetX}px)`
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  nextTick(() => updateSlider())

  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => updateSlider())
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

watch(
  () => props.modelValue,
  () => nextTick(() => updateSlider())
)
</script>

<style scoped>
.filter-tabs {
  position: relative;
  display: flex;
  gap: 2px;
  background: var(--color-surface-dim);
  border-radius: var(--radius-md);
  padding: 3px;
}

/* 滑块 */
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
  pointer-events: none;
}

.filter-tab {
  position: relative;
  z-index: 1;
  height: 30px;
  padding: 0 16px;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: color var(--duration-normal) var(--easing-standard);
  white-space: nowrap;
}

.filter-tab__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  margin-left: 4px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  color: var(--color-text-disabled);
  background: var(--color-surface-dim);
  border-radius: var(--radius-full);
}

.filter-tab--active .filter-tab__count {
  color: var(--color-primary);
  background: rgba(79, 70, 229, 0.1);
}

.filter-tab:hover {
  color: var(--color-text-primary);
}

.filter-tab--active {
  color: var(--color-primary);
  background: transparent;
}

.filter-tab:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* prefers-reduced-motion 降级 */
@media (prefers-reduced-motion: reduce) {
  .filter-tabs__slider {
    transition: none;
  }
}

/* 移动端适配 */
@media (max-width: 767px) {
  .filter-tabs {
    gap: 2px;
  }

  .filter-tabs__slider {
    height: 28px;
  }

  .filter-tab {
    height: 28px;
    padding: 0 12px;
    font-size: var(--font-size-xsmall);
  }
}
</style>
