---
name: v0.4.0 威胁建模
description: v0.4.0 版本安全需求分析和 STRIDE 威胁建模结果
type: project
---

完成 v0.4.0 版本的 STRIDE 威胁建模，输出 `docs/security-engineer/security-requirements-v0.4.0.md`。

**Why**: v0.4.0 引入 @tanstack/vue-virtual 虚拟滚动库，需评估第三方依赖安全和数据完整性风险。

**How to apply**:
- 核心发现：应用整体安全风险低，P0 级需增强 `isValidTask()` 枚举值验证
- XSS 防护：Vue 插值语法已满足，无 `v-html` 使用
- 存储配额：`storage.ts` 已捕获 `QuotaExceededError`
- 第三方库：@tanstack/vue-virtual 安全评估通过，建议锁定版本
