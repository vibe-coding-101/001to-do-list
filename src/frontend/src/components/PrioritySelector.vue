<template>
  <div
    ref="containerRef"
    class="priority-selector"
    role="radiogroup"
    :aria-label="ariaLabel"
  >
    <!-- 滑块背景 -->
    <div
      ref="sliderRef"
      class="priority-selector__slider"
      :class="`priority-selector__slider--${modelValue}`"
      aria-hidden="true"
    />

    <button
      v-for="option in priorityOptions"
      :key="option.value"
      ref="optionRefs"
      class="priority-option"
      :class="[
        `priority-option--${option.value}`,
        { 'priority-option--active': modelValue === option.value }
      ]"
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
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { PRIORITY_CONFIG } from '@/utils/constants'

interface Props {
  modelValue: 'high' | 'medium' | 'low'
  ariaLabel?: string
}

interface Emits {
  (e: 'update:modelValue', value: 'high' | 'medium' | 'low'): void
}

const props = defineProps<Props>()
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

const containerRef = ref<HTMLElement>()
const sliderRef = ref<HTMLElement>()
const optionRefs = ref<HTMLElement[]>([])

/** 优先级色值映射 */
const priorityBgMap: Record<string, string> = {
  high: 'var(--priority-high-bg)',
  medium: 'var(--priority-medium-bg)',
  low: 'var(--priority-low-bg)'
}

const priorityBorderMap: Record<string, string> = {
  high: 'var(--priority-high-border)',
  medium: 'var(--priority-medium-border)',
  low: 'var(--priority-low-border)'
}

/** 更新滑块位置、宽度和颜色 */
function updateSlider(): void {
  if (!containerRef.value || !sliderRef.value) return

  const activeIndex = priorityOptions.value.findIndex((o) => o.value === props.modelValue)
  const activeOption = optionRefs.value[activeIndex]
  if (!activeOption) return

  const containerPadding = parseFloat(getComputedStyle(containerRef.value).paddingLeft)
  const offsetX = activeOption.offsetLeft - containerPadding

  sliderRef.value.style.width = `${activeOption.offsetWidth}px`
  sliderRef.value.style.transform = `translateX(${offsetX}px)`
  sliderRef.value.style.backgroundColor = priorityBgMap[props.modelValue]
  sliderRef.value.style.borderColor = priorityBorderMap[props.modelValue]
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
.priority-selector {
  position: relative;
  display: inline-flex;
  gap: var(--spacing-xs);
  padding: 2px;
  background: var(--color-surface-dim);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

/* 滑块 */
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

.priority-option {
  position: relative;
  z-index: 1;
  padding: 6px 12px;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: color var(--duration-fast) var(--easing-standard);
  white-space: nowrap;
}

.priority-option:hover:not(.priority-option--active) {
  color: var(--color-text-primary);
}

.priority-option:active {
  transform: scale(0.98);
}

.priority-option:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* 选中态 - 仅保留文字色变化 */
.priority-option--high.priority-option--active {
  background: transparent;
  color: var(--priority-high-color);
  border: none;
  box-shadow: none;
}

.priority-option--medium.priority-option--active {
  background: transparent;
  color: var(--priority-medium-color);
  border: none;
  box-shadow: none;
}

.priority-option--low.priority-option--active {
  background: transparent;
  color: var(--priority-low-color);
  border: none;
  box-shadow: none;
}

/* prefers-reduced-motion 降级 */
@media (prefers-reduced-motion: reduce) {
  .priority-selector__slider {
    transition: width 200ms var(--easing-standard),
                background-color 200ms var(--easing-standard),
                border-color 200ms var(--easing-standard);
  }
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
    text-align: center;
  }
}
</style>
