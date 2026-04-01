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

    <!-- 虚拟滚动列表（大数据量） -->
    <div
      v-else-if="useVirtualScroll && filteredTasks.length > 0"
      ref="scrollContainerRef"
      class="task-list__scroll-container"
      @scroll="handleScrollSave"
    >
      <div
        :style="{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }"
      >
        <div
          v-for="virtualItem in virtualizer.getVirtualItems()"
          :key="String(virtualItem.key)"
          :style="{
            position: 'absolute',
            top: `${virtualItem.start}px`,
            left: 0,
            width: '100%',
            height: `${virtualItem.size}px`
          }"
        >
          <TaskItem
            :task="filteredTasks[virtualItem.index]"
            :aria-labelledby="`task-${filteredTasks[virtualItem.index].id}`"
          />
        </div>
      </div>
    </div>

    <!-- 普通列表（小数据量） -->
    <div
      v-else-if="!loading && !useVirtualScroll && filteredTasks.length > 0"
      ref="regularListRef"
      class="task-list__items"
      @scroll="handleRegularScrollSave"
    >
      <TransitionGroup
        tag="div"
        name="list"
        class="task-list__items-inner"
      >
        <TaskItem
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          :aria-labelledby="`task-${task.id}`"
        />
      </TransitionGroup>
    </div>

    <!-- 空状态 -->
    <EmptyState
      v-if="!loading && filteredTasks.length === 0"
      :title="emptyStateTitle"
      :subtitle="emptyStateSubtitle"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useVirtualizer } from '@tanstack/vue-virtual'
import TaskItem from './TaskItem.vue'
import EmptyState from './EmptyState.vue'
import { useTaskStore } from '@/stores/task'
import { useFilterStore } from '@/stores/filter'
import { STORAGE_KEYS } from '@/types/storage.types'
import { saveScrollPosition, loadScrollPosition } from '@/utils/storage'

const taskStore = useTaskStore()
const filterStore = useFilterStore()

const { loading } = storeToRefs(taskStore)

// 滚动容器 ref
const scrollContainerRef = ref<HTMLElement | null>(null)

// 任务项固定高度（px）- 包含 gap 的等效高度
const TASK_ITEM_HEIGHT = 72
const OVERSCAN = 5
const VIRTUAL_THRESHOLD = 50

// filteredTasks computed
const filteredTasks = computed(() => {
  let tasks = taskStore.tasks

  // 应用搜索过滤（优先级最高，先缩小数据集）
  if (filterStore.searchQuery.trim()) {
    const query = filterStore.searchQuery.toLowerCase().trim()
    tasks = tasks.filter((task) =>
      task.text.toLowerCase().includes(query)
    )
  }

  // 应用过滤器
  if (filterStore.currentFilter === 'uncompleted') {
    tasks = tasks.filter((t) => t.status === 'uncompleted')
  } else if (filterStore.currentFilter === 'completed') {
    tasks = tasks.filter((t) => t.status === 'completed')
  }

  // 按创建时间倒序排序
  return tasks.sort((a, b) => b.createdAt - a.createdAt)
})

// 是否使用虚拟滚动
const useVirtualScroll = computed(() => filteredTasks.value.length >= VIRTUAL_THRESHOLD)

// 虚拟滚动器（options 用 computed 包裹，确保 count 响应式更新）
const virtualizer = useVirtualizer(computed(() => ({
  count: filteredTasks.value.length,
  getScrollElement: () => scrollContainerRef.value,
  estimateSize: () => TASK_ITEM_HEIGHT,
  overscan: OVERSCAN,
  getItemKey: (index: number) => filteredTasks.value[index]?.id ?? index
})))

// 搜索/过滤切换时重置滚动位置
watch(
  () => [filterStore.currentFilter, filterStore.searchQuery],
  () => {
    if (useVirtualScroll.value) {
      nextTick(() => {
        virtualizer.value?.scrollToIndex(0, { align: 'start' })
      })
    }
  }
)

// 滚动位置记忆 — 按 filter tab 分别存储
function getScrollKey(): string {
  return `${STORAGE_KEYS.SCROLL_TOP}_${filterStore.currentFilter}`
}

// --- 虚拟滚动模式 ---
let scrollSaveTimer: ReturnType<typeof setTimeout> | null = null
function handleScrollSave(): void {
  if (!scrollContainerRef.value || !useVirtualScroll.value) return
  if (scrollSaveTimer) clearTimeout(scrollSaveTimer)
  scrollSaveTimer = setTimeout(() => {
    saveScrollPosition(getScrollKey(), scrollContainerRef.value!.scrollTop)
  }, 200)
}

// --- 普通列表模式 ---
const regularListRef = ref<HTMLElement | null>(null)

let regularScrollTimer: ReturnType<typeof setTimeout> | null = null
function handleRegularScrollSave(): void {
  if (regularScrollTimer) clearTimeout(regularScrollTimer)
  regularScrollTimer = setTimeout(() => {
    const el = regularListRef.value
    if (!el) return
    saveScrollPosition(getScrollKey(), el.scrollTop)
  }, 200)
}

// --- 恢复滚动位置 ---
function restoreScrollPosition(el: HTMLElement): void {
  const savedTop = loadScrollPosition(getScrollKey())
  if (savedTop !== null && savedTop > 0) {
    nextTick(() => {
      el.scrollTop = savedTop
    })
  }
}

watch(scrollContainerRef, (el) => {
  if (el && useVirtualScroll.value) restoreScrollPosition(el)
})

watch(regularListRef, (el) => {
  if (el) restoreScrollPosition(el)
})

// 切换 Tab 时恢复对应位置
watch(() => filterStore.currentFilter, () => {
  // 等列表内容更新 + DOM 渲染完成后再恢复
  nextTick(() => {
    setTimeout(() => {
      const el = scrollContainerRef.value || regularListRef.value
      if (el) restoreScrollPosition(el)
    }, 100)
  })
})

const emptyStateTitle = computed(() => {
  // 如果有搜索关键词，显示搜索相关提示
  if (filterStore.hasActiveSearch) {
    return '未找到匹配的任务'
  }

  if (filterStore.currentFilter === 'uncompleted') {
    return '没有未完成的任务'
  }
  if (filterStore.currentFilter === 'completed') {
    return '没有已完成的任务'
  }
  return '还没有任务'
})

const emptyStateSubtitle = computed(() => {
  // 如果有搜索关键词，显示搜索相关提示
  if (filterStore.hasActiveSearch) {
    return '尝试使用其他关键词搜索'
  }

  if (filterStore.currentFilter !== 'all') {
    return '切换过滤器查看其他任务'
  }
  return '创建一个吧!'
})
</script>

<style scoped>
.task-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

/* 虚拟滚动容器 */
.task-list__scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.task-list__items {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.task-list__items-inner {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 骨架屏 */
.task-list__skeleton {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-item {
  height: 48px;
  background: linear-gradient(
    90deg,
    var(--color-surface-dim) 0%,
    var(--color-border) 50%,
    var(--color-surface-dim) 100%
  );
  background-size: 200% 100%;
  border-radius: var(--radius-lg);
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
