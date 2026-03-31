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
