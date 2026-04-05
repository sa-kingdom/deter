<template>
    <div v-for="j in props.media" :key="j.id">
        <div v-if="j.contentType.startsWith('image/')" class="media image ts-image is-rounded is-bordered">
            <img :src="`${apiPublicBaseUrl}/assets/media-${j.id}`" >
        </div>
        <div v-else-if="j.contentType === 'application/x-lottie+json'" class="media sticker">
            <ClientOnly>
                <Vue3Lottie
                    :animation-link="`${apiPublicBaseUrl}/assets/media-${j.id}`"
                    :height="160"
                    :width="160"
                />
            </ClientOnly>
        </div>
        <div v-else>
            <a class="media link" :href="`${apiPublicBaseUrl}/assets/media-${j.id}`">
                {{ j.name }}
            </a>
        </div>
    </div>
</template>

<script setup>
const {apiPublicBaseUrl} = useRuntimeConfig().public;

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
