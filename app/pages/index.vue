<template>
  <div class="discussion-feed">
    <ClientOnly>
      <VList
        ref="listRef"
        class="discussion-vlist"
        :data="items"
        @scroll="onScroll"
      >
        <template #default="{ item }">
          <index-discussion-item
            :key="item.id"
            v-bind="item"
          />
        </template>
      </VList>
      <template #fallback>
        <index-discussion-item
          v-for="(item, i) in items"
          :key="i"
          v-bind="item"
        />
      </template>
    </ClientOnly>

    <!-- Loading indicator -->
    <div
      v-if="loading"
      class="ts-content has-center-aligned"
      style="padding: 2rem 0;"
    >
      <span class="ts-loading is-indeterminate" />
    </div>

    <!-- End of feed -->
    <div
      v-if="!loading && !nextCursor && items.length > 0"
      class="ts-content has-center-aligned"
    >
      <span class="ts-text is-secondary is-small">
        已到底部，沒有更多話題了
      </span>
    </div>
  </div>
</template>

<script setup>
import {ref, shallowRef, watch} from 'vue';
import {VList} from 'virtua/vue';
import IndexDiscussionItem from '../components/IndexDiscussionItem.vue';

const {apiInvokeBaseUrl} = useRuntimeConfig().public;
const route = useRoute();

const items = shallowRef([]);
const nextCursor = ref(null);
const loading = ref(false);
const listRef = ref(null);

/**
 * Fetch a page of discussions from the API.
 * @param cursor - ISO timestamp cursor for pagination.
 */
async function fetchPage(cursor = null) {
  if (loading.value) return;
  loading.value = true;
  try {
    const q = {
      collection: route.query.collection || undefined,
      before: cursor || undefined,
      limit: 20,
    };
    const url = `${apiInvokeBaseUrl}/discussions`;
    const res = await $fetch(url, {query: q});
    if (cursor) {
      items.value = [...items.value, ...res.items];
    } else {
      items.value = res.items;
    }
    nextCursor.value = res.nextCursor;
  } catch (e) {
    console.error('Failed to load discussions:', e);
  } finally {
    loading.value = false;
  }
}

// Trigger next page when near the bottom of the virtual list
/** Load next page when user scrolls near the bottom. */
function onScroll() {
  if (!listRef.value || loading.value || !nextCursor.value) return;
  const el = listRef.value.$el ?? listRef.value;
  if (!el) return;
  const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
  if (remaining < 400) {
    fetchPage(nextCursor.value);
  }
}

// Reset and reload when collection filter changes
watch(
    () => route.query.collection,
    () => {
      items.value = [];
      nextCursor.value = null;
      fetchPage();
    },
);

// Initial load
await fetchPage();
</script>

<style>
.discussion-feed {
  display: flex;
  flex-direction: column;
  height: calc(100dvh - 4rem);
}

.discussion-vlist {
  flex: 1;
  overflow-y: auto;
}
</style>
