<template>
  <a :href="`/${id}`" class="ts-segment has-top-spaced">
    <div class="ts-grid">
      <div class="column">
        <div class="ts-avatar is-large is-circular">
          <img :src="ownerProfileAvatar" />
        </div>
      </div>
      <div class="column is-fluid">
        <div style="line-height: 1.5">
          <div class="ts-text is-heavy">{{ props.name }}</div>
          <div class="ts-meta is-small is-secondary">
            <div class="item" :title="props.createdAt">
              {{ $dayjs(props.createdAt).fromNow() }} | {{ props.user.displayName }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup>
import DragonLightIcon from "../assets/DragonLightIcon.png"

const {apiPublicBaseUrl} = useRuntimeConfig();

const props = defineProps({
  "id": {
    type: String,
    required: true,
  },
  "name": {
    type: String,
    required: true,
  },
  "userId": {
    type: String,
    required: true,
  },
  "user": {
    type: Object,
    required: true,
  },
  "lastMessageId": {
    type: String,
    required: true,
  },
  "messageCount": {
    type: Number,
    required: true,
  },
  "memberCount": {
    type: Number,
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
});

const ownerProfileAvatar = computed(() => {
    const { id, avatarHash } = props.user;
    if (!avatarHash) {
        return DragonLightIcon;
    }
    return `${apiPublicBaseUrl}/assets/images/avatar-${id}`;
});
</script>
