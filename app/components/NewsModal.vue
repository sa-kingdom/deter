<template>
  <Teleport to="body">
    <Transition name="news-modal">
      <div
        v-if="item"
        class="ts-modal is-visible is-large"
        role="dialog"
        aria-modal="true"
        :aria-label="item.title"
        @click.self="emit('close')"
      >
        <div class="content">
          <button
            type="button"
            class="ts-close news-modal-close"
            aria-label="關閉"
            @click="emit('close')"
          />
          <div class="ts-content">
            <div class="ts-text is-bold is-large news-title">
              {{ item.title }}
            </div>
            <div class="ts-wrap is-compact has-top-spaced-small">
              <span class="ts-text is-small is-bold news-category">
                {{ item.categoryName }}
              </span>
              <span class="ts-text is-secondary is-small">
                {{ item.source }}
              </span>
              <span class="ts-text is-secondary is-small">
                {{ $dayjs(item.publishedAt).format('YYYY/MM/DD HH:mm') }}
              </span>
            </div>
            <div class="ts-divider is-section" />
            <p class="ts-text">{{ item.description }}</p>
            <div class="ts-text is-secondary is-small has-top-spaced-small">
              內容為中央社 RSS 提供之新聞摘要。
            </div>
            <div class="ts-wrap has-top-spaced news-actions">
              <a
                :href="item.link"
                target="_blank"
                rel="noopener noreferrer"
                class="ts-button is-primary is-start-icon"
              >
                <span class="ts-icon is-up-right-from-square-icon" />
                檢視原文
              </a>
              <button
                type="button"
                class="ts-button is-secondary"
                @click="emit('close')"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import {onBeforeUnmount, onMounted} from 'vue';

defineProps({
  item: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close']);

/**
 * Close the modal when the Escape key is pressed.
 * @param event - Keyboard event.
 */
function onKeydown(event) {
  if (event.key === 'Escape') {
    emit('close');
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.news-modal-enter-active,
.news-modal-leave-active {
  transition: opacity 0.25s ease;
}

.news-modal-enter-active .content,
.news-modal-leave-active .content {
  transition: transform 0.25s ease;
}

.news-modal-enter-from,
.news-modal-leave-to {
  opacity: 0;
}

.news-modal-enter-from .content,
.news-modal-leave-to .content {
  transform: translateY(1rem) scale(0.98);
}

.content {
  position: relative;
  max-width: calc(100% - 2rem);
}

.news-title {
  padding-right: 2.5rem;
}

.news-modal-close {
  position: absolute;
  top: 1.15rem;
  right: 1.15rem;
  z-index: 1;
}

.news-actions {
  justify-content: space-between;
}

.news-category {
  color: #5865f2;
}
</style>
