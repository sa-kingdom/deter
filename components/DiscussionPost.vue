<template>
    <div class="ts-segment has-top-spaced">
        <div class="ts-grid">
            <div class="column">
                <div class="ts-avatar is-large is-circular">
                    <img :src="authorProfileAvatar" />
                </div>
            </div>
            <div class="column is-fluid">
                <div style="line-height: 1.5">
                    <div class="ts-meta is-small is-secondary">
                        <div class="item">{{ authorProfile.displayName }}｜{{ props.createdAt }}</div>
                    </div>
                    <div class="ts-text is-heavy">{{ props.content }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import UserIcon from "../assets/UserIcon.png"

const props = defineProps({
    "id": {
        type: String,
        required: true,
    },
    "content": {
        type: String,
        required: true,
    },
    "authorId": {
        type: String,
        required: true,
    },
    "createdAt": {
        type: String,
        required: true,
    },
    "updatedAt": {
        type: String,
        required: true,
    },
    "discussionId": {
        type: String,
        required: true,
    },
    "users": {
        type: Array,
        required: true,
    },
});

const authorProfile = computed(() => props.users.find(
    (user) => user.id === props.authorId
));

const authorProfileAvatar = computed(() => {
    const { id, avatarHash } = authorProfile.value;
    if (!avatarHash) {
        return UserIcon;
    }
    return `https://cdn.discordapp.com/avatars/${id}/${avatarHash}`
});
</script>
  