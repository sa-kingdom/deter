<template>
  <div>
    <index-discussion-item
      v-for="(j, i) in data"
      :key="i"
      v-bind="j"
    />
  </div>
</template>

<script setup>
import {computed, watch} from 'vue';
import IndexDiscussionItem from '../components/IndexDiscussionItem.vue';

const {apiInvokeBaseUrl} = useRuntimeConfig().public;
const route = useRoute();

const {data, error, refresh} = await useFetch(
    `${apiInvokeBaseUrl}/discussions`,
    {
      query: computed(() => ({
        collection: route.query.collection || undefined,
      })),
    },
);

watch(() => route.query.collection, () => {
  refresh();
});

if (error.value) {
  console.error(error.value);
}
</script>
