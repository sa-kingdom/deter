<template>
  <div
    class="ts-segment has-top-spaced skeleton-card"
    aria-hidden="true"
  >
    <!-- Author Meta Line Skeleton -->
    <div class="ts-wrap is-middle-aligned is-compact has-bottom-spaced-small">
      <!-- Avatar -->
      <div class="skeleton-block skeleton-avatar" />
      <!-- Author name -->
      <div class="skeleton-block skeleton-text-sm" style="width: 72px;" />
      <!-- Separator dot -->
      <div class="skeleton-block skeleton-text-sm" style="width: 6px;" />
      <!-- Timestamp -->
      <div class="skeleton-block skeleton-text-sm" style="width: 56px;" />
      <!-- Optional badge -->
      <div class="skeleton-block skeleton-badge" />
    </div>

    <!-- Title Skeleton -->
    <div class="has-bottom-spaced-small">
      <div class="skeleton-block skeleton-title" style="width: 85%;" />
      <div
        class="skeleton-block skeleton-title"
        style="width: 55%; margin-top: 6px;"
      />
    </div>

    <!-- Stats Bar Skeleton -->
    <div class="ts-wrap is-compact has-top-spaced-small">
      <div class="skeleton-block skeleton-badge" style="width: 72px;" />
      <div class="skeleton-block skeleton-badge" style="width: 60px;" />
    </div>
  </div>
</template>

<style>
.skeleton-card {
  pointer-events: none;
  user-select: none;
}

.skeleton-block {
  background: linear-gradient(
    90deg,
    var(--ts-gray-200) 25%,
    var(--ts-gray-100) 50%,
    var(--ts-gray-200) 75%
  );
  background-size: 200% 100%;
  border-radius: 4px;
  animation: skeleton-shimmer 1.4s ease infinite;
}

.skeleton-avatar {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-text-sm {
  height: 0.75rem;
  border-radius: 3px;
}

.skeleton-title {
  height: 1.1rem;
  border-radius: 4px;
}

.skeleton-badge {
  height: 1.4rem;
  width: 52px;
  border-radius: 999px;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
