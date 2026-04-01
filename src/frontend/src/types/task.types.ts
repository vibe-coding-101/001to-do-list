/**
 * 任务优先级
 */
export type TaskPriority = 'high' | 'medium' | 'low'

/**
 * 优先级类型别名（用于组件）
 */
export type Priority = TaskPriority

/**
 * 任务完成状态
 */
export type TaskStatus = 'completed' | 'uncompleted'

/**
 * 过滤器类型
 */
export type FilterType = 'all' | 'uncompleted' | 'completed'

/**
 * 任务数据结构
 */
export interface Task {
  /**
   * 任务唯一标识符 (UUID v4)
   */
  id: string

  /**
   * 任务描述内容
   */
  text: string

  /**
   * 任务完成状态
   */
  status: TaskStatus

  /**
   * 任务优先级
   */
  priority: TaskPriority

  /**
   * 任务创建时间 (Unix timestamp, 毫秒)
   */
  createdAt: number

  /**
   * 任务最后更新时间 (Unix timestamp, 毫秒)
   */
  updatedAt: number

  /**
   * 任务完成时间 (Unix timestamp, 毫秒, 可选)
   */
  completedAt?: number
}

/**
 * 创建任务时的输入数据
 */
export type CreateTaskInput = {
  text: string
  priority?: TaskPriority
}

/**
 * 更新任务时的输入数据
 */
export type UpdateTaskInput = Partial<Pick<Task, 'text' | 'status' | 'priority' | 'completedAt'>>
