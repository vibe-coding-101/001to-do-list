<template>
  <div class="task-input">
    <div class="input-wrapper">
      <input
        ref="inputRef"
        v-model="inputText"
        type="text"
        class="input-field"
        placeholder="添加新任务..."
        :disabled="disabled"
        @keydown.enter="handleSubmit"
        @keydown.escape="handleCancel"
      >
      <button
        class="add-button"
        type="button"
        :disabled="!canSubmit"
        :aria-label="`添加任务: ${inputText}`"
        @click="handleSubmit"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 5V15M5 10H15"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    <div
      v-if="error"
      class="error-message"
      role="alert"
    >
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useTaskStore } from '@/stores/task'

const taskStore = useTaskStore()

const inputText = ref('')
const error = ref('')
const disabled = ref(false)
const inputRef = ref<HTMLInputElement>()

const canSubmit = computed(() => {
  return inputText.value.trim().length > 0 && !disabled.value
})

const handleSubmit = async () => {
  // 清除错误
  error.value = ''

  // 验证输入
  if (!inputText.value.trim()) {
    error.value = '请输入任务内容'
    return
  }

  try {
    disabled.value = true

    // 添加任务
    await taskStore.addTask({
      text: inputText.value,
      priority: 'medium'
    })

    // 清空输入框
    inputText.value = ''

    // 聚焦回输入框
    await nextTick()
    inputRef.value?.focus()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '添加任务失败'
  } finally {
    disabled.value = false
  }
}

const handleCancel = () => {
  inputText.value = ''
  error.value = ''
}

const focus = () => {
  inputRef.value?.focus()
}

defineExpose({
  focus
})
</script>

<style scoped>
.task-input {
  position: relative;
}

.input-wrapper {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.input-field {
  flex: 1;
  height: 40px;
  padding: 10px 14px;
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: all var(--duration-normal) var(--easing-standard);
}

.input-field:hover:not(:disabled) {
  border-color: var(--color-secondary);
}

.input-field:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field:disabled {
  background: var(--color-surface);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.input-field::placeholder {
  color: var(--color-text-disabled);
}

.add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: white;
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--easing-standard);
  flex-shrink: 0;
}

.add-button:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: scale(1.02);
}

.add-button:active:not(:disabled) {
  background: var(--color-primary-active);
  transform: scale(0.98);
}

.add-button:disabled {
  background: var(--color-border);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.error-message {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-xsmall);
  color: var(--color-error);
}

/* 移动端适配 */
@media (max-width: 767px) {
  .input-field {
    height: 44px;
    font-size: var(--font-size-body);
  }

  .add-button {
    width: 44px;
    height: 44px;
  }
}
</style>
