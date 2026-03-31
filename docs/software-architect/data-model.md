# 数据模型文档
**项目名称**: 待办事项列表应用 (To-Do List App)
**文档版本**: v0.1.1
**创建日期**: 2026-03-31
**架构师**: 小虾米

---

## 1. 数据模型概述

本应用使用 LocalStorage 存储所有数据,数据结构设计遵循以下原则:
- **简单性**: 数据结构扁平,易于理解和维护
- **扩展性**: 预留扩展字段,方便未来迭代
- **性能**: 支持快速查询和更新
- **类型安全**: 使用 TypeScript 定义严格的类型

---

## 2. Task 数据结构

### 2.1 TypeScript 类型定义

```typescript
/**
 * 任务优先级
 */
export type TaskPriority = 'high' | 'medium' | 'low'

/**
 * 任务完成状态
 */
export type TaskStatus = 'completed' | 'uncompleted'

/**
 * 任务数据结构
 */
export interface Task {
  /**
   * 任务唯一标识符 (UUID v4)
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string

  /**
   * 任务描述内容
   * @example "完成项目文档"
   */
  text: string

  /**
   * 任务完成状态
   * @default "uncompleted"
   */
  status: TaskStatus

  /**
   * 任务优先级
   * @default "medium"
   */
  priority: TaskPriority

  /**
   * 任务创建时间 (Unix timestamp, 毫秒)
   * @example 1711862400000
   */
  createdAt: number

  /**
   * 任务最后更新时间 (Unix timestamp, 毫秒)
   * @example 1711862500000
   */
  updatedAt: number

  /**
   * 任务完成时间 (Unix timestamp, 毫秒, 可选)
   * @example 1711862600000
   */
  completedAt?: number
}

/**
 * 创建任务时的输入数据 (不包含 id 和时间戳)
 */
export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>

/**
 * 更新任务时的输入数据 (所有字段可选)
 */
export type UpdateTaskInput = Partial<Pick<Task, 'text' | 'status' | 'priority' | 'completedAt'>>
```

### 2.2 数据示例

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "text": "完成项目文档",
  "status": "uncompleted",
  "priority": "high",
  "createdAt": 1711862400000,
  "updatedAt": 1711862400000,
  "completedAt": null
}
```

### 2.3 字段说明

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | string | 是 | 自动生成 | UUID v4 格式,确保唯一性 |
| text | string | 是 | - | 任务描述,1-200 字符 |
| status | string | 是 | "uncompleted" | "completed" 或 "uncompleted" |
| priority | string | 是 | "medium" | "high" / "medium" / "low" |
| createdAt | number | 是 | 自动生成 | 创建时间的 Unix timestamp (毫秒) |
| updatedAt | number | 是 | 自动生成 | 最后更新时间的 Unix timestamp (毫秒) |
| completedAt | number \| null | 否 | null | 完成时间的 Unix timestamp (毫秒) |

### 2.4 数据约束

- **text**: 1-200 字符,不能为空,不能只包含空格
- **id**: 必须是有效的 UUID v4 格式
- **status**: 只能是 "completed" 或 "uncompleted"
- **priority**: 只能是 "high"、"medium" 或 "low"
- **createdAt**: 必须 <= updatedAt
- **completedAt**: 当 status 为 "completed" 时必须有值

---

## 3. LocalStorage Schema

### 3.1 Storage Keys

```typescript
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
   * 数据 Schema 版本号 (用于数据迁移)
   * 类型: string
   * @example "1.0.0"
   */
  VERSION: 'todo_app_version'
} as const
```

### 3.2 Storage 数据结构

#### `todo_app_tasks`

存储所有任务数据的数组。

```typescript
// 类型定义
type TasksStorage = Task[]

// 数据示例
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "text": "完成项目文档",
    "status": "uncompleted",
    "priority": "high",
    "createdAt": 1711862400000,
    "updatedAt": 1711862400000,
    "completedAt": null
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "text": "代码审查",
    "status": "completed",
    "priority": "medium",
    "createdAt": 1711862300000,
    "updatedAt": 1711862600000,
    "completedAt": 1711862600000
  }
]
```

#### `todo_app_filter`

存储当前的过滤状态。

```typescript
// 类型定义
type FilterStorage = 'all' | 'uncompleted' | 'completed'

// 数据示例
"all"
```

#### `todo_app_version`

存储数据 Schema 版本号,用于未来的数据迁移。

```typescript
// 类型定义
type VersionStorage = string

// 数据示例
"1.0.0"
```

---

## 4. 数据操作

### 4.1 读取数据

```typescript
/**
 * 从 LocalStorage 读取任务列表
 */
function loadTasks(): Task[] {
  const data = localStorage.getItem(STORAGE_KEYS.TASKS)
  if (!data) return []

  try {
    const tasks = JSON.parse(data) as Task[]
    // 验证数据格式
    return tasks.filter(isValidTask)
  } catch (error) {
    console.error('Failed to parse tasks:', error)
    return []
  }
}

/**
 * 验证 Task 数据格式
 */
function isValidTask(task: any): task is Task {
  return (
    typeof task === 'object' &&
    typeof task.id === 'string' &&
    typeof task.text === 'string' &&
    typeof task.status === 'string' &&
    typeof task.priority === 'string' &&
    typeof task.createdAt === 'number' &&
    typeof task.updatedAt === 'number' &&
    (task.completedAt === null || typeof task.completedAt === 'number')
  )
}
```

### 4.2 保存数据

```typescript
/**
 * 保存任务列表到 LocalStorage
 */
function saveTasks(tasks: Task[]): void {
  try {
    const data = JSON.stringify(tasks)
    localStorage.setItem(STORAGE_KEYS.TASKS, data)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded')
      // 处理存储空间不足
    } else {
      console.error('Failed to save tasks:', error)
    }
  }
}
```

### 4.3 创建任务

```typescript
/**
 * 创建新任务
 */
function createTask(input: CreateTaskInput): Task {
  const now = Date.now()

  const task: Task = {
    id: generateUUID(), // 生成 UUID v4
    text: input.text.trim(),
    status: input.status ?? 'uncompleted',
    priority: input.priority ?? 'medium',
    createdAt: now,
    updatedAt: now,
    completedAt: null
  }

  return task
}

/**
 * 生成 UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
```

### 4.4 更新任务

```typescript
/**
 * 更新任务
 */
function updateTask(tasks: Task[], id: string, updates: UpdateTaskInput): Task[] {
  return tasks.map((task) => {
    if (task.id !== id) return task

    const updatedTask: Task = {
      ...task,
      ...updates,
      updatedAt: Date.now()
    }

    // 如果状态变为完成,记录完成时间
    if (updates.status === 'completed' && task.status !== 'completed') {
      updatedTask.completedAt = Date.now()
    }

    // 如果状态变为未完成,清除完成时间
    if (updates.status === 'uncompleted') {
      updatedTask.completedAt = null
    }

    return updatedTask
  })
}
```

### 4.5 删除任务

```typescript
/**
 * 删除任务
 */
function deleteTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id)
}
```

### 4.6 切换任务状态

```typescript
/**
 * 切换任务完成状态
 */
function toggleTaskStatus(tasks: Task[], id: string): Task[] {
  return tasks.map((task) => {
    if (task.id !== id) return task

    const newStatus = task.status === 'completed' ? 'uncompleted' : 'completed'

    return {
      ...task,
      status: newStatus,
      updatedAt: Date.now(),
      completedAt: newStatus === 'completed' ? Date.now() : null
    }
  })
}
```

---

## 5. 数据验证

### 5.1 输入验证

```typescript
/**
 * 验证任务输入
 */
export function validateTaskInput(text: string): { valid: boolean; error?: string } {
  // 检查是否为空
  if (!text || text.trim().length === 0) {
    return { valid: false, error: '任务内容不能为空' }
  }

  // 检查长度
  if (text.length > 200) {
    return { valid: false, error: '任务内容不能超过 200 字符' }
  }

  // 检查是否只包含空格
  if (text.trim().length === 0) {
    return { valid: false, error: '任务内容不能只包含空格' }
  }

  return { valid: true }
}
```

### 5.2 数据完整性验证

```typescript
/**
 * 验证 Task 数据完整性
 */
export function validateTask(task: any): task is Task {
  const requiredFields = ['id', 'text', 'status', 'priority', 'createdAt', 'updatedAt']

  // 检查必填字段
  for (const field of requiredFields) {
    if (!(field in task)) {
      console.error(`Missing required field: ${field}`)
      return false
    }
  }

  // 检查 id 格式
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(task.id)) {
    console.error('Invalid UUID format')
    return false
  }

  // 检查 status 枚举
  if (!['completed', 'uncompleted'].includes(task.status)) {
    console.error('Invalid status value')
    return false
  }

  // 检查 priority 枚举
  if (!['high', 'medium', 'low'].includes(task.priority)) {
    console.error('Invalid priority value')
    return false
  }

  // 检查时间戳逻辑
  if (task.createdAt > task.updatedAt) {
    console.error('createdAt cannot be greater than updatedAt')
    return false
  }

  // 检查 completedAt 逻辑
  if (task.status === 'completed' && !task.completedAt) {
    console.error('completedAt is required when status is completed')
    return false
  }

  return true
}
```

---

## 6. 数据迁移策略

### 6.1 版本控制

当前 Schema 版本: **v1.0.0**

LocalStorage 中存储版本号:
```typescript
localStorage.setItem(STORAGE_KEYS.VERSION, '1.0.0')
```

### 6.2 迁移流程

```typescript
/**
 * 数据迁移主函数
 */
function migrateData(): void {
  const currentVersion = localStorage.getItem(STORAGE_KEYS.VERSION) || '0.0.0'

  // 按版本顺序执行迁移
  if (currentVersion < '1.0.0') {
    migrateTo_v1_0_0()
  }

  // 更新版本号
  localStorage.setItem(STORAGE_KEYS.VERSION, '1.0.0')
}

/**
 * 迁移到 v1.0.0
 * 示例: 添加 priority 字段
 */
function migrateTo_v1_0_0(): void {
  const tasks = loadTasks()

  const migratedTasks = tasks.map((task) => ({
    ...task,
    priority: task.priority ?? 'medium' // 添加默认值
  }))

  saveTasks(migratedTasks)
}
```

### 6.3 未来迁移场景

**场景 1: 添加截止日期字段**
- 读取现有数据
- 为每个任务添加 `dueDate: null` 默认值
- 保存更新后的数据

**场景 2: 添加标签字段**
- 读取现有数据
- 为每个任务添加 `tags: []` 默认值
- 保存更新后的数据

**场景 3: 数据结构重构**
- 读取旧格式数据
- 转换为新格式
- 保存新格式数据
- 删除旧 key (可选)

---

## 7. 性能优化

### 7.1 索引策略

虽然 LocalStorage 不支持真正的索引,但可以在内存中构建索引:

```typescript
/**
 * 构建任务 ID 索引 (Map)
 */
function buildTaskIndex(tasks: Task[]): Map<string, Task> {
  const index = new Map<string, Task>()
  for (const task of tasks) {
    index.set(task.id, task)
  }
  return index
}

/**
 * 快速查找任务
 */
const taskIndex = buildTaskIndex(tasks)
const task = taskIndex.get('550e8400-e29b-41d4-a716-446655440000')
```

### 7.2 查询优化

```typescript
/**
 * 按状态过滤任务
 */
function filterByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((task) => task.status === status)
}

/**
 * 按优先级排序任务
 */
function sortByPriority(tasks: Task[]): Task[] {
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
}

/**
 * 按创建时间排序任务 (倒序)
 */
function sortByCreatedAt(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => b.createdAt - a.createdAt)
}
```

### 7.3 数据分层

**热数据 (Hot Data):**
- 当前显示的任务列表 (按过滤条件)
- 存储在内存中,快速访问

**冷数据 (Cold Data):**
- 所有任务数据
- 存储在 LocalStorage 中,按需加载

**缓存策略:**
```typescript
// Store 中缓存当前过滤后的任务
const filteredTasks = computed(() => {
  let tasks = taskStore.tasks

  // 应用过滤器
  if (filterStore.currentFilter === 'uncompleted') {
    tasks = tasks.filter((t) => t.status === 'uncompleted')
  } else if (filterStore.currentFilter === 'completed') {
    tasks = tasks.filter((t) => t.status === 'completed')
  }

  // 应用排序
  return tasks.sort((a, b) => b.createdAt - a.createdAt)
})
```

---

## 8. 错误处理

### 8.1 LocalStorage 不可用

```typescript
/**
 * 检测 LocalStorage 可用性
 */
function isLocalStorageAvailable(): boolean {
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
 * 降级处理: 使用 Memory Storage
 */
class MemoryStorage {
  private data: Record<string, string> = {}

  setItem(key: string, value: string): void {
    this.data[key] = value
  }

  getItem(key: string): string | null {
    return this.data[key] ?? null
  }

  removeItem(key: string): void {
    delete this.data[key]
  }
}

// 使用示例
const storage = isLocalStorageAvailable() ? localStorage : new MemoryStorage()
```

### 8.2 存储空间不足

```typescript
/**
 * 处理 QuotaExceededError
 */
function handleQuotaExceeded(): void {
  // 方案 1: 提示用户清理旧任务
  alert('存储空间不足,请删除一些旧任务')

  // 方案 2: 自动清理最旧的已完成任务
  const tasks = loadTasks()
  const completedTasks = tasks.filter((t) => t.status === 'completed')
  const sortedCompletedTasks = completedTasks.sort((a, b) => a.completedAt! - b.completedAt!)

  // 删除最旧的 10% 已完成任务
  const deleteCount = Math.floor(sortedCompletedTasks.length * 0.1)
  const tasksToDelete = sortedCompletedTasks.slice(0, deleteCount)

  const updatedTasks = tasks.filter(
    (task) => !tasksToDelete.some((t) => t.id === task.id)
  )

  saveTasks(updatedTasks)
}
```

---

## 9. 数据安全

### 9.1 XSS 防护

- Vue 3 自动转义 HTML,防止 XSS 攻击
- 不要使用 `v-html` 指令渲染用户输入
- 所有用户输入都作为文本处理

### 9.2 数据备份

虽然不在 MVP 范围内,但未来可以提供:
- 导出数据为 JSON 文件
- 导入 JSON 文件恢复数据
- 定期自动备份到云端 (需要后端)

---

## 10. 测试数据

### 10.1 测试用例数据

```typescript
/**
 * 生成测试任务数据
 */
export function generateMockTasks(count: number): Task[] {
  const tasks: Task[] = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    tasks.push({
      id: generateUUID(),
      text: `测试任务 ${i + 1}`,
      status: i % 3 === 0 ? 'completed' : 'uncompleted',
      priority: ['high', 'medium', 'low'][i % 3] as TaskPriority,
      createdAt: now - i * 1000 * 60 * 60, // 每个任务间隔 1 小时
      updatedAt: now - i * 1000 * 60 * 60,
      completedAt: i % 3 === 0 ? now - i * 1000 * 60 * 60 : null
    })
  }

  return tasks
}
```

### 10.2 边界测试数据

```typescript
/**
 * 边界测试数据
 */
export const boundaryTestCases = {
  // 空任务列表
  empty: [],

  // 单个任务
  single: [
    {
      id: generateUUID(),
      text: '唯一的任务',
      status: 'uncompleted' as const,
      priority: 'medium' as const,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ],

  // 最长文本 (200 字符)
  longText: [
    {
      id: generateUUID(),
      text: 'a'.repeat(200),
      status: 'uncompleted' as const,
      priority: 'medium' as const,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ],

  // 特殊字符
  specialChars: [
    {
      id: generateUUID(),
      text: '<script>alert("XSS")</script>',
      status: 'uncompleted' as const,
      priority: 'medium' as const,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ]
}
```

---

## 11. 数据流示例

### 11.1 完整的创建任务流程

```typescript
// 1. 用户输入
const userInput = "完成项目文档"

// 2. 验证输入
const validation = validateTaskInput(userInput)
if (!validation.valid) {
  alert(validation.error)
  return
}

// 3. 创建任务对象
const newTask = createTask({
  text: userInput,
  priority: 'medium'
})

// 4. 添加到任务列表
const tasks = loadTasks()
const updatedTasks = [newTask, ...tasks]

// 5. 保存到 LocalStorage
saveTasks(updatedTasks)

// 6. 更新 UI (Pinia Store 自动触发)
taskStore.tasks = updatedTasks
```

### 11.2 完整的切换任务状态流程

```typescript
// 1. 用户点击复选框
const taskId = "550e8400-e29b-41d4-a716-446655440000"

// 2. 加载当前任务列表
const tasks = loadTasks()

// 3. 切换任务状态
const updatedTasks = toggleTaskStatus(tasks, taskId)

// 4. 保存到 LocalStorage
saveTasks(updatedTasks)

// 5. 更新 UI
taskStore.tasks = updatedTasks
```

---

## 12. 总结

### 12.1 数据模型特点

- ✅ **简单直观**: 扁平化结构,易于理解
- ✅ **类型安全**: TypeScript 完整类型定义
- ✅ **扩展性强**: 预留扩展字段,支持未来迭代
- ✅ **性能优化**: 支持快速查询和索引
- ✅ **数据验证**: 完整的输入验证和完整性检查
- ✅ **错误处理**: LocalStorage 降级方案
- ✅ **迁移策略**: 版本控制和数据迁移机制

### 12.2 使用建议

- **创建任务**: 始终使用 `createTask()` 函数,确保数据一致性
- **更新任务**: 使用 `updateTask()` 函数,自动更新 `updatedAt`
- **删除任务**: 使用 `deleteTask()` 函数,保持数组操作的一致性
- **验证数据**: 在保存前调用 `validateTask()` 验证数据完整性
- **错误处理**: 始终捕获 LocalStorage 异常,提供友好的错误提示

---

**文档结束**
