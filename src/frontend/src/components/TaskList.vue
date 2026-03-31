<template>
  <div class="task-list">
    <!-- 骨架屏 -->
    <div
      v-if="loading"
      class="task-list__skeleton"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="skeleton-item"
      />
    </div>

    <!-- 任务列表 -->
    <TransitionGroup
      v-else
      tag="div"
      name="list"
      class="task-list__items"
    >
      <TaskItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        :aria-labelledby="`task-${task.id}`"
      />
    </TransitionGroup>

    <!-- 空状态 -->
    <EmptyState
      v-if="!loading && filteredTasks.length === 0"
      :title="emptyStateTitle"
      :subtitle="emptyStateSubtitle"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import TaskItem from './TaskItem.vue'
import EmptyState from './EmptyState.vue'
import { useTaskStore } from '@/stores/task'
import { useFilterStore } from '@/stores/filter'

const taskStore = useTaskStore()
const filterStore = useFilterStore()

const { loading } = storeToRefs(taskStore)

const filteredTasks = computed(() => {
  let tasks = taskStore.tasks

  // 应用过滤器
  if (filterStore.currentFilter === 'uncompleted') {
    tasks = tasks.filter((t) => t.status === 'uncompleted')
  } else if (filterStore.currentFilter === 'completed') {
    tasks = tasks.filter((t) => t.status === 'completed')
  }

  // 按创建时间倒序排序
  return tasks.sort((a, b) => b.createdAt - a.createdAt)
})

const emptyStateTitle = computed(() => {
  if (filterStore.currentFilter === 'uncompleted') {
    return '没有未完成的任务'
  }
  if (filterStore.currentFilter === 'completed') {
    return '没有已完成的任务'
  }
  return '还没有任务'
})

const emptyStateSubtitle = computed(() => {
  if (filterStore.currentFilter !== 'all') {
    return '切换过滤器查看其他任务'
  }
  return '创建一个吧!'
})
</script>

<style scoped>
.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.task-list__items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* 骨架屏 */
.task-list__skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.skeleton-item {
  height: 48px;
  background: linear-gradient(
    90deg,
    var(--color-surface) 0%,
    var(--color-border) 50%,
    var(--color-surface) 100%
  );
  background-size: 200% 100%;
  border-radius: var(--radius-md);
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 列表过渡动画 */
.list-enter-active,
.list-leave-active {
  transition: all var(--duration-slow) var(--easing-standard);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.list-move {
  transition: transform var(--duration-slow) var(--easing-standard);
}
</style>
