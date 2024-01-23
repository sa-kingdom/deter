<template>
  <div class="ts-container has-vertically-spaced-large">
    <div class="ts-grid is-relaxed">
      <div class="column is-3-wide">
        <div style="position: sticky; top: 1rem">
          <div class="ts-menu is-start-icon is-separated">
            <a href="/" class="ts-button">
              <span class="ts-icon is-less-than-icon"></span> 返回首頁
            </a>
          </div>
          <div class="ts-divider is-section"></div>
          <div class="ts-wrap is-middle-aligned">
            <div class="ts-text is-heavy">{{ data.discussion.name }}</div>
          </div>
          <div class="ts-divider is-section"></div>
          <div class="ts-wrap is-middle-aligned">
            <div class="ts-avatar is-circular">
              <img :src="`https://cdn.discordapp.com/avatars/${ownerProfile?.id}/${ownerProfile?.avatarHash}`" />
            </div>
            <div class="ts-text">{{ ownerProfile.displayName }}</div>
          </div>
        </div>
      </div>
      <div class="column is-9-wide">
        <discussion-post v-for="(j, i) in data.posts" :key="i" v-bind="j" :users="data.users" />
      </div>
      <div class="column is-4-wide">
        <div style="position: sticky; top: 1rem">
          <div class="ts-menu is-start-icon is-separated">
            <div class="ts-divider is-section"></div>
            <a href="#!" class="item"> <span class="ts-icon is-discord-icon"></span> 進入 Discord 發佈文章 </a>
            <a href="#!" class="item"> <span class="ts-icon is-github-icon"></span> 加入 GitHub 協助我們 </a>
            <div class="ts-divider is-section"></div>
            <a href="#!" class="item"> <span class="ts-icon is-user-group-icon"></span> 關於 Deter 迪特 </a>
            <a href="#!" class="item"> <span class="ts-icon is-flag-icon"></span> 全站版規 </a>
            <a href="#!" class="item"> <span class="ts-icon is-bookmark-icon"></span> 服務條款 </a>
            <a href="#!" class="item"> <span class="ts-icon is-check-to-slot-icon"></span> 隱私權政策 </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import discussionPost from "../../components/DiscussionPost.vue";

const {apiBaseUrl} = useRuntimeConfig();
const route = useRoute();

const { discussionId } = route.params;
const { data, pending, error, refresh } = await useAsyncData(
  'discussion-data',
  () => $fetch(`${apiBaseUrl}/discussions/${discussionId}`)
);

const ownerProfile = computed(() => data.value.users.find(
  (user) => user.id === data.value.discussion.ownerId
) || null);
</script>
