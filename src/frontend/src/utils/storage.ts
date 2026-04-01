import type { Task } from '@/types/task.types'
import { STORAGE_KEYS } from '@/types/storage.types'

/**
 * 检测 LocalStorage 可用性
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}

/**
 * 生成 UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 从 LocalStorage 读取任务列表
 */
export function loadTasks(): Task[] {
  if (!isLocalStorageAvailable()) {
    console.warn('LocalStorage is not available')
    return []
  }

  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS)
    if (!data) return []

    const parsed = JSON.parse(data)
    const tasks = parsed.tasks || parsed // 兼容旧格式

    // 验证数据格式
    if (Array.isArray(tasks)) {
      return tasks.filter(isValidTask)
    }

    return []
  } catch (error) {
    console.error('Failed to parse tasks:', error)
    return []
  }
}

/**
 * 保存任务列表到 LocalStorage
 */
export function saveTasks(tasks: Task[]): void {
  if (!isLocalStorageAvailable()) {
    console.warn('LocalStorage is not available')
    return
  }

  try {
    const data = JSON.stringify({
      tasks,
      version: '1.0.0'
    })
    localStorage.setItem(STORAGE_KEYS.TASKS, data)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded')
      // TODO: 实现清理旧任务的逻辑
      throw new Error('存储空间不足，请删除一些旧任务')
    } else {
      console.error('Failed to save tasks:', error)
      throw error
    }
  }
}

/**
 * 从 LocalStorage 读取过滤器状态
 */
export function loadFilter(): string {
  if (!isLocalStorageAvailable()) {
    return 'all'
  }

  try {
    const filter = localStorage.getItem(STORAGE_KEYS.FILTER)
    return filter || 'all'
  } catch (error) {
    console.error('Failed to parse filter:', error)
    return 'all'
  }
}

/**
 * 保存过滤器状态到 LocalStorage
 */
export function saveFilter(filter: string): void {
  if (!isLocalStorageAvailable()) {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEYS.FILTER, filter)
  } catch (error) {
    console.error('Failed to save filter:', error)
  }
}

/**
 * 保存滚动位置
 */
export function saveScrollPosition(key: string, value: number): void {
  if (!isLocalStorageAvailable()) return
  try {
    localStorage.setItem(key, String(value))
  } catch {
    // 静默降级
  }
}

/**
 * 读取滚动位置
 */
export function loadScrollPosition(key: string): number | null {
  if (!isLocalStorageAvailable()) return null
  try {
    const value = localStorage.getItem(key)
    return value !== null ? Number(value) : null
  } catch {
    return null
  }
}

/**
 * 合法状态值（安全需求 SR-004）
 */
const VALID_STATUSES = ['completed', 'uncompleted'] as const

/**
 * 合法优先级值（安全需求 SR-004）
 */
const VALID_PRIORITIES = ['high', 'medium', 'low'] as const

/**
 * 验证 Task 数据格式
 * 包含枚举值验证，防止非法数据注入（安全需求 v0.4.0 P0）
 */
function isValidTask(task: any): task is Task {
  return (
    typeof task === 'object' &&
    task !== null &&
    typeof task.id === 'string' &&
    typeof task.text === 'string' &&
    typeof task.status === 'string' &&
    VALID_STATUSES.includes(task.status as typeof VALID_STATUSES[number]) &&
    typeof task.priority === 'string' &&
    VALID_PRIORITIES.includes(task.priority as typeof VALID_PRIORITIES[number]) &&
    typeof task.createdAt === 'number' &&
    typeof task.updatedAt === 'number' &&
    (task.completedAt === null ||
      task.completedAt === undefined ||
      typeof task.completedAt === 'number')
  )
}
