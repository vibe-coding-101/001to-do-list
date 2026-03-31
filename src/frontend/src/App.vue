<template>
  <div class="app">
    <!-- 顶部栏 -->
    <header class="header">
      <div class="container header__content">
        <h1 class="header__title">
          我的待办事项
        </h1>
        <FilterTabs v-model="filterStore.currentFilter" />
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main">
      <div class="container main__content">
        <!-- 任务列表 -->
        <TaskList />

        <!-- 底部输入区 -->
        <div class="input-section">
          <TaskInput ref="taskInputRef" />
        </div>
      </div>
    </main>

    <!-- 全局错误提示 -->
    <Transition name="fade">
      <div
        v-if="globalError"
        class="error-toast"
        role="alert"
      >
        <span>{{ globalError }}</span>
        <button
          class="error-toast__close"
          type="button"
          aria-label="关闭错误提示"
          @click="globalError = ''"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.66663 4.66667L11.3333 11.3333M11.3333 4.66667L4.66663 11.3333"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/task'
import { useFilterStore } from '@/stores/filter'
import TaskList from '@/components/TaskList.vue'
import TaskInput from '@/components/TaskInput.vue'
import FilterTabs from '@/components/FilterTabs.vue'

const taskStore = useTaskStore()
const filterStore = useFilterStore()

const taskInputRef = ref<InstanceType<typeof TaskInput>>()
const globalError = ref('')

onMounted(async () => {
  try {
    // 加载任务和过滤器状态
    await taskStore.loadTasks()
    filterStore.loadFilter()

    // 聚焦输入框
    taskInputRef.value?.focus()
  } catch (error) {
    globalError.value = '加载数据失败，请刷新页面重试'
    console.error('Failed to initialize app:', error)

    // 3秒后自动清除错误
    setTimeout(() => {
      globalError.value = ''
    }, 3000)
  }
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
}

/* 顶部栏 */
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-1);
}

.header__content {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.header__title {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: var(--line-height-title);
}

/* 主内容区 */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: var(--spacing-lg);
  padding-bottom: var(--spacing-xxl);
}

/* 输入区 */
.input-section {
  position: sticky;
  bottom: 0;
  margin-top: auto;
  padding: var(--spacing-md);
  background: var(--color-background);
  border-top: 1px solid var(--color-border);
  z-index: 5;
}

/* 全局错误提示 */
.error-toast {
  position: fixed;
  top: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-error);
  color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-3);
  z-index: 1000;
  min-width: 300px;
  max-width: 90%;
}

.error-toast__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-left: auto;
  color: white;
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--easing-standard);
}

.error-toast__close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration-normal) var(--easing-standard);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 767px) {
  .header__content {
    height: var(--header-height-mobile);
  }

  .header__title {
    font-size: var(--font-size-h2);
  }

  .main__content {
    padding-top: var(--spacing-md);
    padding-bottom: var(--spacing-lg);
  }

  .input-section {
    padding: var(--spacing-sm);
  }

  .error-toast {
    min-width: unset;
    width: calc(100% - var(--spacing-lg) * 2);
  }
}
</style>
