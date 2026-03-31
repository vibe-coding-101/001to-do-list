import { defineStore } from 'pinia'
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task.types'
import { loadTasks, saveTasks, generateUUID } from '@/utils/storage'
import { validateTaskInput } from '@/utils/validation'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    /**
     * 已完成的任务
     */
    completedTasks(): Task[] {
      return this.tasks.filter((task) => task.status === 'completed')
    },

    /**
     * 未完成的任务
     */
    uncompletedTasks(): Task[] {
      return this.tasks.filter((task) => task.status === 'uncompleted')
    },

    /**
     * 任务总数
     */
    taskCount(): number {
      return this.tasks.length
    },

    /**
     * 未完成任务数
     */
    uncompletedCount(): number {
      return this.uncompletedTasks.length
    }
  },

  actions: {
    /**
     * 加载任务列表
     */
    async loadTasks() {
      this.loading = true
      this.error = null

      try {
        // 模拟异步加载
        await new Promise((resolve) => setTimeout(resolve, 100))
        this.tasks = loadTasks()
      } catch (error) {
        this.error = '加载任务失败'
        console.error('Failed to load tasks:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * 创建新任务
     */
    async addTask(input: CreateTaskInput) {
      // 验证输入
      const validation = validateTaskInput(input.text)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      const now = Date.now()

      const newTask: Task = {
        id: generateUUID(),
        text: input.text.trim(),
        status: 'uncompleted',
        priority: input.priority || 'medium',
        createdAt: now,
        updatedAt: now
      }

      // 添加到列表顶部
      this.tasks = [newTask, ...this.tasks]

      // 持久化
      this.saveTasks()

      return newTask
    },

    /**
     * 更新任务
     */
    async updateTask(id: string, updates: UpdateTaskInput) {
      const taskIndex = this.tasks.findIndex((t) => t.id === id)

      if (taskIndex === -1) {
        throw new Error('任务不存在')
      }

      // 如果更新 text，验证输入
      if (updates.text !== undefined) {
        const validation = validateTaskInput(updates.text)
        if (!validation.valid) {
          throw new Error(validation.error)
        }
      }

      const updatedTask: Task = {
        ...this.tasks[taskIndex],
        ...updates,
        text: updates.text ? updates.text.trim() : this.tasks[taskIndex].text,
        updatedAt: Date.now()
      }

      // 如果状态变为完成，记录完成时间
      if (updates.status === 'completed' && this.tasks[taskIndex].status !== 'completed') {
        updatedTask.completedAt = Date.now()
      }

      // 如果状态变为未完成，清除完成时间
      if (updates.status === 'uncompleted') {
        updatedTask.completedAt = undefined
      }

      this.tasks[taskIndex] = updatedTask

      // 持久化
      this.saveTasks()

      return updatedTask
    },

    /**
     * 删除任务
     */
    async deleteTask(id: string) {
      this.tasks = this.tasks.filter((task) => task.id !== id)

      // 持久化
      this.saveTasks()
    },

    /**
     * 切换任务状态
     */
    async toggleTaskStatus(id: string) {
      const task = this.tasks.find((t) => t.id === id)

      if (!task) {
        throw new Error('任务不存在')
      }

      const newStatus = task.status === 'completed' ? 'uncompleted' : 'completed'

      return this.updateTask(id, { status: newStatus })
    },

    /**
     * 保存任务到 LocalStorage
     */
    saveTasks() {
      try {
        saveTasks(this.tasks)
      } catch (error) {
        this.error = '保存任务失败'
        console.error('Failed to save tasks:', error)
        throw error
      }
    },

    /**
     * 清空所有任务
     */
    async clearAllTasks() {
      this.tasks = []
      this.saveTasks()
    }
  }
})
