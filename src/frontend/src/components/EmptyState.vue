<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="20"
          y="20"
          width="80"
          height="80"
          rx="8"
          fill="#EEF2FF"
          stroke="#C7D2FE"
        />
        <path
          d="M40 50L55 65L80 40"
          stroke="#4F46E5"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M35 35H45"
          stroke="#C7D2FE"
          stroke-width="2"
          stroke-linecap="round"
        />
        <path
          d="M35 42H40"
          stroke="#C7D2FE"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </div>
    <h2 class="empty-state__title">
      {{ title }}
    </h2>
    <p
      v-if="subtitle"
      class="empty-state__subtitle"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  title: '还没有任务',
  subtitle: '创建一个吧!'
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl) var(--spacing-lg);
  text-align: center;
  min-height: 300px;
  background: linear-gradient(180deg, var(--color-background) 0%, #EEF2FF 100%);
  border-radius: var(--radius-lg);
  animation: empty-fade-in 400ms var(--easing-enter) both;
}

@keyframes empty-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-state__icon {
  margin-bottom: var(--spacing-lg);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-state__title {
  font-size: 20px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.empty-state__subtitle {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
}

/* 移动端适配 */
@media (max-width: 767px) {
  .empty-state {
    padding: var(--spacing-xl) var(--spacing-md);
    min-height: 250px;
  }

  .empty-state__icon svg {
    width: 100px;
    height: 100px;
  }

  .empty-state__title {
    font-size: var(--font-size-body);
  }

  .empty-state__subtitle {
    font-size: var(--font-size-small);
  }
}
</style>
