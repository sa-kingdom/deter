<template>
    <div class="column">
        <user-avatar :id="props.userId" :avatar-hash="avatarHash" />
    </div>
    <div class="column is-fluid">
        <div style="line-height: 1.5">
            <div class="ts-meta is-small is-secondary">
                <div class="item" :title="props.createdAt">
                    {{ props.displayName }} | {{ $dayjs(props.createdAt).fromNow() }}
                </div>
            </div>
        </div>
        <slot />
    </div>
</template>

<script setup>
import UserAvatar from "./UserAvatar.vue";

const props = defineProps({
    "id": {
        type: String,
        required: true,
    },
    "userId": {
        type: String,
        required: true,
    },
    "createdAt": {
        type: String,
        required: true,
    },
    "displayName": {
        type: String,
        required: true,
    },
    "avatarHash": {
        type: String,
        required: true,
    },
});
</script>
