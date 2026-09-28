<template>
  <div class="ts-segment">
    <div class="ts-wrap is-middle-aligned has-bottom-spaced-small">
      <span class="ts-icon is-newspaper-icon" />
      <span class="ts-text is-bold has-start-spaced-small">臺灣近日新聞</span>
    </div>

    <div
      v-if="pending"
      class="ts-content is-dense has-center-aligned"
      style="padding: 1.5rem 0;"
    >
      <span class="ts-loading is-indeterminate" />
    </div>

    <div v-else-if="error" class="ts-text is-secondary is-small">
      目前暫時無法取得新聞，請稍後再試。
    </div>

    <template v-else>
      <div class="news-list">
        <a
          v-for="item in items"
          :key="item.id"
          :href="item.link"
          target="_blank"
          rel="noopener noreferrer"
          class="news-link"
        >
          <div class="ts-text is-small news-title">
            {{ item.title }}
          </div>
          <div class="ts-text is-secondary is-small news-meta">
            {{ item.categoryName }} · {{ $dayjs(item.publishedAt).fromNow() }}
          </div>
        </a>
      </div>
      <NuxtLink
        to="/news"
        class="ts-button is-secondary is-fluid is-small is-start-icon has-top-spaced"
      >
        <span class="ts-icon is-eye-icon" /> 查看所有新聞
      </NuxtLink>
    </template>
  </div>
</template>

<script setup>
import {computed} from 'vue';

const {apiInvokeBaseUrl} = useRuntimeConfig().public;

const {data, pending, error} = await useFetch(
    `${apiInvokeBaseUrl}/news`,
    {query: {limit: 5}, key: 'news-sidebar'},
);

const items = computed(() => data.value?.items || []);
</script>

<style scoped>
.news-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.news-link {
  display: block;
  padding: 0.65rem 1rem;
  border-radius: 0.4rem;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

.news-link:hover {
  background: var(--ts-gray-75);
}

.news-title {
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.news-meta {
  line-height: 1.2;
}
</style>
