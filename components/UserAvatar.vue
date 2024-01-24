<template>
    <div class="ts-avatar is-large is-circular">
        <img :src="avatarUrl" />
    </div>
</template>

<script setup>
import DragonLightIcon from "../assets/DragonLightIcon.png"

const props = defineProps({
    "id": {
        type: String,
        required: true,
    },
    "avatarHash": {
        type: String,
        required: true,
    },
});

const avatarUrl = computed(() => {
    const { id, avatarHash } = props;
    if (!avatarHash) {
        return DragonLightIcon;
    }
    return `https://cdn.discordapp.com/avatars/${id}/${avatarHash}`;
});
</script>
