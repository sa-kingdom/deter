<template>
  <div class="ts-container has-vertically-spaced-large">
    <div class="ts-grid is-relaxed">
      <div class="column is-3-wide mobile:ts-app-drawer">
        <div style="position: sticky; top: 1rem">
          <div class="ts-divider is-section"></div>
          <div class="ts-wrap is-middle-aligned">
            <div class="ts-avatar is-circular">
              <img :src="DragonLightIcon" />
            </div>
            <div class="ts-text is-heavy">你好！我們的朋友！</div>
          </div>
          <div class="ts-divider is-section"></div>
          <p>
            在名為 Discord 的高速公路風馳電掣的論壇系統 ⚔️
          </p>
          <div class="ts-menu is-start-icon is-separated">
            <div class="ts-divider"></div>
            <a href="#!" class="item"> <span class="ts-icon is-comments-icon"></span> 八卦 </a>
            <a href="#!" class="item"> <span class="ts-icon is-box-icon"></span> 廢文 </a>
            <a href="#!" class="item"> <span class="ts-icon is-store-icon"></span> 市集</a>
            <a href="#!" class="item"> <span class="ts-icon is-flag-icon"></span> 站方 </a>
            <a href="#!" class="item"> <span class="ts-icon is-star-icon"></span> 精華 </a>
          </div>
        </div>
      </div>
      <div class="column is-9-wide mobile:is-16-wide">
        <index-discussion-item v-for="(j, i) in data" :key="i" v-bind="j" />
      </div>
      <div class="column is-4-wide mobile:ts-app-drawer">
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
import DragonLightIcon from "../assets/DragonLightIcon.png"

import IndexDiscussionItem from "../components/IndexDiscussionItem.vue";

const {apiBaseUrl} = useRuntimeConfig();

const { data, pending, error, refresh } = await useAsyncData(
  'discussions',
  () => $fetch(`${apiBaseUrl}/discussions`)
);

console.log(data.value)

if (error.value) {
  console.error(error.value)
}
</script>
