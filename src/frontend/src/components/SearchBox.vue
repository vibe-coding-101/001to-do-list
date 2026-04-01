<template>
  <div class="search-box">
    <!-- 搜索图标 -->
    <svg
      class="search-box__icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11 11L14 14"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <!-- 搜索输入框 -->
    <input
      ref="inputRef"
      v-model="searchQuery"
      type="text"
      class="search-box__input"
      placeholder="搜索任务..."
      role="searchbox"
      :aria-label="`搜索任务${searchQuery ? '，当前搜索内容：' + searchQuery : ''}`"
      :maxlength="MAX_SEARCH_LENGTH"
      @input="handleInput"
      @keydown.escape="handleEscape"
    >

    <!-- 清除按钮 -->
    <Transition name="fade">
      <button
        v-if="searchQuery"
        class="search-box__clear"
        type="button"
        aria-label="清空搜索"
        @click="handleClear"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

/**
 * SearchBox 组件
 *
 * 安全特性：
 * - 限制搜索关键词最大长度为 50 字符（SR-003）
 * - 不使用 v-html 渲染用户输入（SR-002）
 * - 所有用户输入都经过 Vue 3 自动转义
 */

// Props
interface Props {
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// 常量
const MAX_SEARCH_LENGTH = 50 // 安全要求：搜索关键词长度限制（SR-003）
const DEBOUNCE_DELAY = 200 // 防抖延迟 200ms

// Refs
const inputRef = ref<HTMLInputElement>()
const searchQuery = ref(props.modelValue)

// 防抖函数实现
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  return (...args: Parameters<T>) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

// 监听外部 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue
})

// 防抖处理输入
const debouncedEmit = debounce((value: string) => {
  // 截断超长输入
  const truncatedValue = value.slice(0, MAX_SEARCH_LENGTH)
  if (truncatedValue !== value) {
    searchQuery.value = truncatedValue
  }
  emit('update:modelValue', truncatedValue)
}, DEBOUNCE_DELAY)

// 处理输入
const handleInput = () => {
  debouncedEmit(searchQuery.value)
}

// 处理清空
const handleClear = () => {
  searchQuery.value = ''
  emit('update:modelValue', '')
  inputRef.value?.focus()
}

// 处理 ESC 键
const handleEscape = () => {
  if (searchQuery.value) {
    handleClear()
  }
}

// 清理定时器
onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})

// 暴露方法
defineExpose({
  focus: () => inputRef.value?.focus()
})
</script>

<style scoped>
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 240px;
  height: 36px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0 12px;
  transition: all var(--duration-fast) var(--easing-standard);
}

.search-box:hover {
  border-color: #D1D5DB;
}

.search-box:focus-within {
  border: 2px solid var(--color-primary);
  padding: 0 11px; /* 补偿边框宽度变化 */
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-box__icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  color: var(--color-text-disabled);
  margin-right: 8px;
}

.search-box__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--font-size-small);
  color: var(--color-text-primary);
  line-height: 1.5;
}

.search-box__input::placeholder {
  color: var(--color-text-disabled);
}

.search-box__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-left: 8px;
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--easing-standard);
}

.search-box__clear:hover {
  background: var(--color-border);
  color: var(--color-text-primary);
}

.search-box__clear:active {
  transform: scale(0.95);
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration-fast) var(--easing-standard);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 767px) {
  .search-box {
    width: 100%;
    height: 44px;
    padding: 0 12px;
  }

  .search-box:focus-within {
    padding: 0 11px;
  }

  .search-box__clear {
    width: 24px;
    height: 24px;
  }
}
</style>
