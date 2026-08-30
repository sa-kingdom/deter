<template>
    <div class="ts-avatar is-large is-circular">
        <img :src="avatarUrl" >
    </div>
</template>

<script setup>
import DragonLightIcon from '../assets/DragonLightIcon.png';

const {apiPublicBaseUrl} = useRuntimeConfig().public;

const props = defineProps({
  'id': {
    type: String,
    required: true,
  },
  'avatarHash': {
    type: String,
    required: false,
    default: () => '',
  },
});

const avatarUrl = computed(() => {
  const {id, avatarHash} = props;
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
