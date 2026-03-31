import type { TaskPriority } from '@/types/task.types'

/**
 * 优先级配置
 */
export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  high: {
    label: '高',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA'
  },
  medium: {
    label: '中',
    color: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A'
  },
  low: {
    label: '低',
    color: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0'
  }
}

/**
 * 动画时长 (ms)
 */
export const ANIMATION_DURATION = {
  fast: 100,
  normal: 200,
  slow: 300
} as const

/**
 * 键盘快捷键
 */
export const KEYBOARD_SHORTCUTS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' '
} as const
