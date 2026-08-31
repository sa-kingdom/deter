<template>
  <NuxtLink
    :to="`/${id}`"
    class="ts-segment is-interactive has-top-spaced"
    style="display: block; text-decoration: none; color: inherit;"
  >
    <!-- Author Meta Line -->
    <div class="ts-wrap is-middle-aligned is-compact has-bottom-spaced-small">
      <div class="ts-avatar is-circular is-small">
        <img
          :src="ownerProfileAvatar"
          alt=""
          @error="handleAvatarError"
        >
      </div>
      <span class="ts-text is-bold is-small">
        {{ props.user.displayName }}
      </span>
      <span class="ts-text is-secondary is-small">•</span>
      <span class="ts-text is-secondary is-small" :title="props.createdAt">
        {{ $dayjs(props.createdAt).fromNow() }}
      </span>
      <span
        v-for="collection in (props.collections || props.tags || [])"
        :key="collection.id"
        class="ts-badge is-small is-outlined is-secondary"
      >
        {{ collection.name }}
      </span>
    </div>

    <!-- Post Title -->
    <div
      class="ts-header is-heavy is-medium has-bottom-spaced-small"
      style="line-height: 1.4;"
    >
      {{ props.name }}
    </div>

    <!-- Actions / Stats Bar -->
    <div class="ts-wrap is-compact has-top-spaced-small">
      <span class="ts-badge is-secondary is-small">
        <span class="ts-icon is-comments-icon" />
        {{ props.messageCount }} 則留言
      </span>
      <span
        v-if="props.memberCount"
        class="ts-badge is-secondary is-small"
      >
        <span class="ts-icon is-users-icon" />
        {{ props.memberCount }} 人參與
      </span>
    </div>
  </NuxtLink>
</template>

<script setup>
import DragonLightIcon from '../assets/DragonLightIcon.webp';

const handleAvatarError = (event) => {
  event.target.src = DragonLightIcon;
};

const {apiPublicBaseUrl} = useRuntimeConfig().public;

const props = defineProps({
  'id': {
    type: String,
    required: true,
  },
  'name': {
    type: String,
    required: true,
  },
  'userId': {
    type: String,
    required: true,
  },
  'user': {
    type: Object,
    required: true,
  },
  'lastMessageId': {
    type: String,
    required: true,
  },
  'messageCount': {
    type: Number,
    required: true,
  },
  'memberCount': {
    type: Number,
    required: true,
  },
  'createdAt': {
    type: String,
    required: true,
  },
  'updatedAt': {
    type: String,
    required: true,
  },
  'tags': {
    type: Array,
    default: () => [],
  },
  'collections': {
    type: Array,
    default: () => [],
  },
});

const ownerProfileAvatar = computed(() => {
  const {id, avatarHash} = props.user;
  if (!avatarHash) {
    return DragonLightIcon;
  }
  if (
    avatarHash.startsWith('http://') ||
    avatarHash.startsWith('https://') ||
    avatarHash.startsWith('/')
  ) {
    return avatarHash;
  }
  return `${apiPublicBaseUrl}/assets/avatar-${id}-${avatarHash}`;
});
</script>
