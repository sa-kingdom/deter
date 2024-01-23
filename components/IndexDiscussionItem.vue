<template>
  <a :href="`/${id}`" class="ts-segment has-top-spaced">
    <div class="ts-grid">
      <div class="column">
        <div class="ts-avatar is-large is-circular">
          <img :src="`https://cdn.discordapp.com/avatars/${ownerProfile.id}/${ownerProfile.avatarHash}`" />
        </div>
      </div>
      <div class="column is-fluid">
        <div style="line-height: 1.5">
          <div class="ts-text is-heavy">{{ props.name }}</div>
          <div class="ts-meta is-small is-secondary">
            <div class="item">{{ props.createdAt }}｜{{ ownerProfile.displayName }}</div>
          </div>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup>
const props = defineProps({
  "id": {
    type: String,
    required: true,
  },
  "name": {
    type: String,
    required: true,
  },
  "ownerId": {
    type: String,
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
  "users": {
    type: Array,
    required: true,
  },
});

const ownerProfile = computed(() => props.users.find(
  (user) => user.id === props.ownerId
));
</script>
