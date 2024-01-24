<template>
    <div v-for="(j, i) in props.media" :key="i">
        <div class="media image ts-image is-rounded is-bordered" v-if="j.contentType.startsWith('image/')">
            <img :src="j.url" />
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
    "id": {
        type: String,
        required: true,
    },
    "media": {
        type: Object,
        required: true,
    },
});
</script>
