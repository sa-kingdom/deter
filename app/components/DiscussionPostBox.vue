<template>
  <div class="ts-wrap is-middle-aligned is-compact has-bottom-spaced-small">
    <user-avatar :id="props.userId" :avatar-hash="avatarHash" />
    <span class="ts-text is-bold is-small">{{ props.displayName }}</span>
    <span class="ts-text is-secondary is-small">•</span>
    <span class="ts-text is-secondary is-small" :title="props.createdAt">
      {{ $dayjs(props.createdAt).fromNow() }}
    </span>
  </div>
  <div style="line-height: 1.6; word-break: break-word;">
    <slot />
  </div>
</template>

<script setup>
import UserAvatar from './UserAvatar.vue';

const props = defineProps({
  'id': {
    type: String,
    required: true,
  },
  'userId': {
    type: String,
    required: true,
  },
  'createdAt': {
    type: String,
    required: true,
  },
  'displayName': {
    type: String,
    required: true,
  },
  'avatarHash': {
    type: String,
    required: true,
  },
});
</script>
