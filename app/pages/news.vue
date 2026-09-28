<template>
  <div>
    <!-- Page Header -->
    <div class="ts-wrap is-middle-aligned has-bottom-spaced">
      <span class="ts-icon is-newspaper-icon" />
      <span class="ts-text is-bold is-large has-start-spaced-small">
        臺灣新聞
      </span>
    </div>

    <!-- Category Tabs -->
    <div class="ts-tab has-bottom-spaced">
      <a
        class="item"
        :class="{'is-active': !activeCategory}"
        role="button"
        tabindex="0"
        @click="switchCategory(null)"
        @keydown.enter="switchCategory(null)"
      >
        全部
      </a>
      <a
        v-for="cat in categories"
        :key="cat.slug"
        class="item"
        :class="{'is-active': activeCategory === cat.slug}"
        role="button"
        tabindex="0"
        @click="switchCategory(cat.slug)"
        @keydown.enter="switchCategory(cat.slug)"
      >
        {{ cat.name }}
      </a>
    </div>

    <!-- Loading indicator on refetch -->
    <div
      v-if="status === 'pending'"
      class="ts-content is-dense has-center-aligned"
    >
      <span class="ts-loading is-indeterminate" />
    </div>

    <!-- News List -->
    <template v-if="items.length > 0">
      <div class="news-list has-bottom-spaced">
        <a
          v-for="item in items"
          :key="item.id"
          :href="item.link"
          target="_blank"
          rel="noopener noreferrer"
          class="ts-segment is-interactive news-item"
        >
          <div class="ts-text is-bold has-bottom-spaced-tiny">
            {{ item.title }}
          </div>
          <p class="ts-text is-secondary is-small has-bottom-spaced-small">
            {{ item.description }}
          </p>
          <div class="ts-wrap is-compact">
            <span class="ts-text is-small is-bold news-category">
              {{ item.categoryName }}
            </span>
            <span class="ts-text is-secondary is-small">
              {{ item.source }}
            </span>
            <span class="ts-text is-secondary is-small">
              {{ $dayjs(item.publishedAt).format('YYYY/MM/DD HH:mm') }}
            </span>
            <span
              class="ts-icon is-arrow-right-icon news-arrow"
            />
          </div>
        </a>
      </div>
    </template>

    <!-- Empty / Error -->
    <div
      v-else-if="status !== 'pending'"
      class="ts-content has-center-aligned"
    >
      <span class="ts-text is-secondary">
        目前沒有可顯示的新聞，請稍後再試。
      </span>
    </div>

    <!-- Load More -->
    <div
      v-if="hasMore && status !== 'pending'"
      class="ts-content is-dense has-center-aligned"
    >
      <button
        type="button"
        class="ts-button is-secondary is-small"
        @click="loadMore"
      >
        載入更多
      </button>
    </div>

    <!-- Source Attribution -->
    <div class="ts-content is-dense has-center-aligned">
      <span class="ts-text is-secondary is-small">
        新聞資料由
        <a
          href="https://www.cna.com.tw/"
          target="_blank"
          rel="noopener noreferrer"
        >中央通訊社</a>
        RSS 提供
      </span>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch} from 'vue';

useHead({title: '臺灣新聞'});

const {apiInvokeBaseUrl} = useRuntimeConfig().public;
const route = useRoute();
const router = useRouter();

const activeCategory = ref(
    route.query.category ? String(route.query.category) : null,
);
const limit = ref(30);

const {data, status} = await useFetch(
    `${apiInvokeBaseUrl}/news`,
    {
      query: {
        category: activeCategory,
        limit,
      },
    },
);

const items = computed(() => data.value?.items || []);
const hasMore = computed(() => data.value?.hasMore || false);
const categories = computed(() => data.value?.categories || []);

/**
 * Switch the active category and reset pagination.
 * @param slug - Category slug, or null for all categories.
 */
function switchCategory(slug) {
  activeCategory.value = slug;
  limit.value = 30;
}

watch(activeCategory, (slug) => {
  router.replace({
    query: slug ? {category: slug} : {},
  });
});

/**
 * Increase the page size to load more news.
 */
function loadMore() {
  limit.value += 30;
}
</script>

<style scoped>
.news-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.news-item {
  display: block;
  text-decoration: none;
  color: inherit;
}

.news-category {
  color: #5865f2;
}

.news-arrow {
  margin-left: auto;
  color: var(--ts-gray-500);
}
</style>
