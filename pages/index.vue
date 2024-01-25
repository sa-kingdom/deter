<template>
  <index-discussion-item v-for="(j, i) in data" :key="i" v-bind="j" />
</template>

<script setup>
import IndexDiscussionItem from "../components/IndexDiscussionItem.vue";

const { apiBaseUrl } = useRuntimeConfig();

const { data, pending, error, refresh } = await useAsyncData(
  'discussions',
  () => $fetch(`${apiBaseUrl}/discussions`)
);

if (error.value) {
  console.error(error.value)
}
</script>
