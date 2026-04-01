/**
 * LocalStorage Key 定义
 */
export const STORAGE_KEYS = {
  /**
   * 任务列表数据
   * 类型: Task[]
   */
  TASKS: 'todo_app_tasks',

  /**
   * 当前过滤器状态
   * 类型: 'all' | 'uncompleted' | 'completed'
   */
  FILTER: 'todo_app_filter',

  /**
   * 滚动位置像素值
   * 类型: number
   */
  SCROLL_TOP: 'todo_app_scroll_top',

  /**
   * 数据 Schema 版本号 (用于数据迁移)
   * 类型: string
   */
  VERSION: 'todo_app_version'
} as const

/**
 * LocalStorage 数据结构
 */
export type TasksStorage = {
  tasks: import('./task.types').Task[]
  version: string
}

/**
 * 过滤器存储类型
 */
export type FilterStorage = 'all' | 'uncompleted' | 'completed'
