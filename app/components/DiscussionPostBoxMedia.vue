<template>
    <div v-for="(j, i) in props.media" :key="i">
        <div v-if="j.contentType.startsWith('image/')" class="media image ts-image is-rounded is-bordered">
            <img :src="j.url" >
        </div>
        <div v-else>
            <a class="media link" :href="j.url">
                {{ j.name }}
            </a>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
  'id': {
    type: String,
    required: true,
  },
  'media': {
    type: Object,
    required: true,
  },
});
</script>
