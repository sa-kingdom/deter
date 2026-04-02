<template>
  <div class="ts-container has-vertically-spaced-large">
    <div class="ts-grid is-relaxed">
      <div class="column is-3-wide mobile:ts-app-drawer">
        <div style="position: sticky; top: 1rem">
          <div class="ts-menu is-start-icon is-separated">
            <a href="/" class="ts-button">
              <span class="ts-icon is-less-than-icon"/> 返回首頁
            </a>
          </div>
          <div class="ts-divider is-section"/>
          <div class="ts-wrap is-middle-aligned">
            <div class="ts-text is-heavy">{{ data.name }}</div>
          </div>
          <div class="ts-divider is-section"/>
          <div class="ts-wrap is-middle-aligned">
            <div class="ts-avatar is-circular">
              <img :src="ownerProfileAvatar" >
            </div>
            <div class="column">
              <div class="ts-text">{{ data.user.displayName }}</div>
              <div class="ts-text is-small" :title="data.createdAt">
                {{ $dayjs(data.createdAt).fromNow() }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-9-wide mobile:is-16-wide">
        <discussion-post v-for="(j, i) in data.posts" :key="i" v-bind="j" :users="data.users" />
      </div>
      <div class="column is-4-wide mobile:ts-app-drawer">
        <div style="position: sticky; top: 1rem">
          <div class="ts-menu is-start-icon is-separated">
            <div class="ts-divider is-section"/>
            <a href="#!" class="item"> <span class="ts-icon is-discord-icon"/> 進入 Discord 發佈文章 </a>
            <a href="#!" class="item"> <span class="ts-icon is-github-icon"/> 加入 GitHub 協助我們 </a>
            <div class="ts-divider is-section"/>
            <a href="#!" class="item"> <span class="ts-icon is-user-group-icon"/> 關於 Deter 迪特 </a>
            <a href="#!" class="item"> <span class="ts-icon is-flag-icon"/> 全站版規 </a>
            <a href="#!" class="item"> <span class="ts-icon is-bookmark-icon"/> 服務條款 </a>
            <a href="#!" class="item"> <span class="ts-icon is-check-to-slot-icon"/> 隱私權政策 </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DragonLightIcon from '~/assets/DragonLightIcon.png';

import DiscussionPost from '~/components/DiscussionPost.vue';

const {apiInvokeBaseUrl, apiPublicBaseUrl} = useRuntimeConfig().public;
const route = useRoute();

const {discussionId} = route.params;
const {data, error} = await useFetch(`${apiInvokeBaseUrl}/discussions/${discussionId}`, {
  key: 'discussion-data',
});

if (error.value) {
  console.error(error.value);
}

useHead({
  title: data.value.name,
});

definePageMeta({
  layout: 'clear',
});

const ownerProfileAvatar = computed(() => {
  const {id, avatarHash} = data.value.user;
  if (!avatarHash) {
    return DragonLightIcon;
  }
  return `${apiPublicBaseUrl}/assets/images/avatar-${id}-${avatarHash}`;
});
</script>
