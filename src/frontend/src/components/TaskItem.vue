<template>
  <Transition name="list">
    <div
      v-if="!isDeleting"
      class="task-item"
      :class="{
        'task-item--completed': task.status === 'completed',
        'task-item--editing': isEditing
      }"
    >
      <!-- 正常显示模式 -->
      <div
        v-if="!isEditing"
        class="task-item__view"
      >
        <button
          class="checkbox"
          type="button"
          :aria-label="task.status === 'completed' ? '标记为未完成' : '标记为已完成'"
          :aria-checked="task.status === 'completed'"
          role="checkbox"
          @click="handleToggle"
        >
          <svg
            v-if="task.status === 'completed'"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="check-icon"
          >
            <path
              d="M2 6L4.5 8.5L10 3"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <span
          class="task-text"
          :title="task.text"
        >
          {{ task.text }}
        </span>

        <!-- 优先级标签 -->
        <span
          class="priority-badge"
          :class="`priority-badge--${task.priority}`"
        >
          {{ PRIORITY_CONFIG[task.priority].label }}
        </span>

        <!-- 操作按钮 -->
        <div class="actions">
          <button
            class="action-button"
            type="button"
            aria-label="编辑任务"
            @click="startEdit"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.66663 12.6667H4.66663L11.3333 6L10 4.66667L3.33329 11.3333V13.3333H2.66663V12.6667ZM13.3333 4L14.6666 2.66667L13.3333 1.33333L12 2.66667L13.3333 4Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            class="action-button action-button--danger"
            type="button"
            aria-label="删除任务"
            @click="handleDelete"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.66663 4.66667V13.3333H11.3333V4.66667H4.66663ZM3.33329 3.33333H12.6666V4.66667H3.33329V3.33333ZM5.99996 2H9.99996V3.33333H5.99996V2Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 编辑模式 -->
      <div
        v-else
        class="task-item__edit"
      >
        <input
          ref="editInputRef"
          v-model="editText"
          type="text"
          class="edit-input"
          @keydown.enter="saveEdit"
          @keydown.escape="cancelEdit"
        >
        <div class="edit-actions">
          <button
            class="save-button"
            type="button"
            :disabled="!editText.trim()"
            @click="saveEdit"
          >
            保存
          </button>
          <button
            class="cancel-button"
            type="button"
            @click="cancelEdit"
          >
            取消
          </button>
        </div>
        <div
          v-if="editError"
          class="error-message"
          role="alert"
        >
          {{ editError }}
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { Task } from '@/types/task.types'
import { useTaskStore } from '@/stores/task'
import { PRIORITY_CONFIG } from '@/utils/constants'

interface Props {
  task: Task
}

const props = defineProps<Props>()

const taskStore = useTaskStore()

const isEditing = ref(false)
const isDeleting = ref(false)
const editText = ref('')
const editError = ref('')
const editInputRef = ref<HTMLInputElement>()

const startEdit = async () => {
  isEditing.value = true
  editText.value = props.task.text
  editError.value = ''

  await nextTick()
  editInputRef.value?.focus()
}

const saveEdit = async () => {
  if (!editText.value.trim()) {
    editError.value = '任务内容不能为空'
    return
  }

  try {
    await taskStore.updateTask(props.task.id, {
      text: editText.value
    })
    isEditing.value = false
    editError.value = ''
  } catch (err) {
    editError.value = err instanceof Error ? err.message : '保存失败'
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editText.value = ''
  editError.value = ''
}

const handleToggle = async () => {
  try {
    await taskStore.toggleTaskStatus(props.task.id)
  } catch (err) {
    console.error('Failed to toggle task status:', err)
  }
}

const handleDelete = async () => {
  try {
    isDeleting.value = true
    // 等待动画完成
    await new Promise((resolve) => setTimeout(resolve, 200))
    await taskStore.deleteTask(props.task.id)
  } catch (err) {
    console.error('Failed to delete task:', err)
    isDeleting.value = false
  }
}
</script>

<style scoped>
.task-item {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  box-shadow: var(--shadow-1);
  transition: all var(--duration-normal) var(--easing-standard);
}

.task-item:hover:not(.task-item--editing) {
  box-shadow: var(--shadow-2);
  transform: translateY(-2px);
}

.task-item--completed {
  background: var(--color-surface);
  opacity: 0.8;
}

.task-item--completed .task-text {
  text-decoration: line-through;
  color: var(--color-text-disabled);
}

.task-item--editing {
  border-color: var(--color-primary);
  border-width: 2px;
  padding: 11px 15px;
}

/* 正常显示模式 */
.task-item__view {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  cursor: pointer;
  transition: all var(--duration-fast) var(--easing-standard);
  flex-shrink: 0;
}

.checkbox:hover {
  border-color: var(--color-secondary);
}

.checkbox:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.task-item--completed .checkbox {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.task-text {
  flex: 1;
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.priority-badge {
  padding: 2px 8px;
  font-size: var(--font-size-xsmall);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-full);
  white-space: nowrap;
  flex-shrink: 0;
}

.priority-badge--high {
  color: var(--priority-high-color);
  background: var(--priority-high-bg);
  border: 1px solid var(--priority-high-border);
}

.priority-badge--medium {
  color: var(--priority-medium-color);
  background: var(--priority-medium-bg);
  border: 1px solid var(--priority-medium-border);
}

.priority-badge--low {
  color: var(--priority-low-color);
  background: var(--priority-low-bg);
  border: 1px solid var(--priority-low-border);
}

.actions {
  display: flex;
  gap: var(--spacing-xs);
  opacity: 0;
  transition: opacity var(--duration-normal) var(--easing-standard);
}

.task-item:hover .actions {
  opacity: 1;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--color-secondary);
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--easing-standard);
}

.action-button:hover {
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.action-button--danger:hover {
  background: var(--priority-high-bg);
  color: var(--priority-high-color);
}

/* 编辑模式 */
.task-item__edit {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.edit-input {
  width: 100%;
  height: 36px;
  padding: 8px 12px;
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: all var(--duration-normal) var(--easing-standard);
}

.edit-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.edit-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
}

.save-button {
  height: 32px;
  padding: 0 16px;
  font-size: var(--font-size-small);
  color: white;
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--easing-standard);
}

.save-button:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.save-button:disabled {
  background: var(--color-border);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.cancel-button {
  height: 32px;
  padding: 0 16px;
  font-size: var(--font-size-small);
  color: var(--color-text-primary);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--easing-standard);
}

.cancel-button:hover {
  background: var(--color-surface);
}

.error-message {
  font-size: var(--font-size-xsmall);
  color: var(--color-error);
}

/* 移动端适配 */
@media (max-width: 767px) {
  .task-item {
    padding: 12px;
  }

  .actions {
    opacity: 1;
  }

  .action-button {
    width: 36px;
    height: 36px;
  }
}

/* 移动端始终显示操作按钮 */
@media (hover: none) {
  .actions {
    opacity: 1;
  }
}
</style>
