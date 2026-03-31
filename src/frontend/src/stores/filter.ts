import { defineStore } from 'pinia'
import type { FilterType } from '@/types/task.types'
import { loadFilter, saveFilter } from '@/utils/storage'

export const useFilterStore = defineStore('filter', {
  state: () => ({
    currentFilter: 'all' as FilterType
  }),

  getters: {
    /**
     * 当前过滤器显示名称
     */
    filterLabel(): string {
      const labels: Record<FilterType, string> = {
        all: '全部',
        uncompleted: '未完成',
        completed: '已完成'
      }
      return labels[this.currentFilter]
    }
  },

  actions: {
    /**
     * 加载过滤器状态
     */
    loadFilter() {
      this.currentFilter = loadFilter() as FilterType
    },

    /**
     * 设置过滤器
     */
    setFilter(filter: FilterType) {
      this.currentFilter = filter
      saveFilter(filter)
    }
  }
})
