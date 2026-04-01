---
name: Project Context v0.4.0
description: v0.4.0 性能与体验完善版本的设计任务上下文
type: project
---

v0.4.0 设计任务已完成，输出文件为 `docs/ux-ui-designer/design-spec-v0.4.0.md`。

**设计范围**（DES-401 ~ DES-404）：
- DES-401: FilterTabs 滑块动画（绝对定位 + translateX，200ms ease-in-out，白色背景 + shadow-1）
- DES-402: PrioritySelector 滑块动画（同理，但滑块背景色跟随优先级）
- DES-403: 优先级小圆点（6px 圆点，高=红/中=橙/低=绿，完成态灰色 #94A3B8）
- DES-404: 空状态 SVG 配色（已确认 v0.3.0 已更新为 Indigo 色系，无需改动）

**Why:** v0.3.0 视觉升级遗留的动效和细节未完成，v0.4.0 补齐。

**How to apply:** 设计文档直接供前端工程师编码，无需反复确认。所有参数已具体到色值、尺寸、动画参数级别。CSS 变量体系沿用 v0.3.0，不新增变量。

**文档组织模式：** 增量文档模式 — 每个版本独立 design-spec-vX.X.X.md，主文件 design-spec.md 保留为 v0.2.0 初始版本。
