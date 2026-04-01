<template>
  <div>
    <index-discussion-item v-for="(j, i) in data" :key="i" v-bind="j" />
  </div>
</template>

<script setup>
import IndexDiscussionItem from '../components/IndexDiscussionItem.vue';

const {apiInvokeBaseUrl} = useRuntimeConfig().public;

const {data, error} = await useFetch(`${apiInvokeBaseUrl}/discussions`, {
  key: 'discussions',
});

if (error.value) {
  console.error(error.value);
}
</script>
