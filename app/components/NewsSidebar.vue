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
      <div class="ts-menu is-separated is-dense">
        <a
          v-for="item in items"
          :key="item.id"
          :href="item.link"
          target="_blank"
          rel="noopener noreferrer"
          class="item"
        >
          <div class="ts-text is-small has-bottom-spaced-tiny">
            {{ item.title }}
          </div>
          <div class="ts-wrap is-compact">
            <span class="ts-text is-secondary is-small">
              {{ item.categoryName }}
            </span>
            <span class="ts-text is-secondary is-small">·</span>
            <span class="ts-text is-secondary is-small">
              {{ $dayjs(item.publishedAt).fromNow() }}
            </span>
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
