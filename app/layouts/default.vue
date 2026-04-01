<template>
  <div class="ts-app-layout is-full is-vertical">
    <div class="cell">
      <div class="ts-container">
        <div class="navbar ts-tab is-center-aligned">
          <a href="/" class="item is-active">
            <span class="ts-icon is-dragon-icon"/>
            Deter 迪特
          </a>
        </div>
      </div>
    </div>
    <div class="cell is-secondary is-fluid is-scrollable">
      <div class="ts-container has-vertically-spaced-large">
        <div class="ts-grid is-relaxed">
          <div class="column is-3-wide mobile:ts-app-drawer">
            <div style="position: sticky; top: 1rem">
              <div class="ts-divider is-section"/>
              <div class="ts-wrap is-middle-aligned">
                <div class="ts-avatar is-circular">
                  <img :src="DragonLightIcon" >
                </div>
                <div class="ts-text is-heavy">你好！我們的朋友！</div>
              </div>
              <div class="ts-divider is-section"/>
              <p>
                在名為 Discord 的高速公路風馳電掣的論壇系統 ⚔️
              </p>
              <div class="ts-menu is-start-icon is-separated">
                <div class="ts-divider"/>
                <a href="#!" class="item"> <span class="ts-icon is-comments-icon"/> 八卦 </a>
                <a href="#!" class="item"> <span class="ts-icon is-box-icon"/> 廢文 </a>
                <a href="#!" class="item"> <span class="ts-icon is-store-icon"/> 市集</a>
                <a href="#!" class="item"> <span class="ts-icon is-flag-icon"/> 站方 </a>
                <a href="#!" class="item"> <span class="ts-icon is-star-icon"/> 精華 </a>
              </div>
            </div>
          </div>
          <div class="column is-9-wide mobile:is-16-wide">
            <slot/>
          </div>
          <div class="column is-4-wide mobile:ts-app-drawer">
            <div style="position: sticky; top: 1rem">
              <div class="ts-menu is-start-icon is-separated">
                <div class="ts-divider is-section"/>
                <a :href="discordServerUrl" class="item"> <span class="ts-icon is-discord-icon"/> 進入 Discord 發佈文章
                </a>
                <a :href="githubRepositoryUrl" class="item"> <span class="ts-icon is-github-icon"/> 加入 GitHub 協助我們
                </a>
                <div class="ts-divider is-section"/>
                <a href="/about" class="item">
                  <span class="ts-icon is-user-group-icon"/> 關於 Deter 迪特
                </a>
                <a href="/rules" class="item">
                  <span class="ts-icon is-flag-icon"/> 全站版規
                </a>
                <a href="/terms" class="item">
                  <span class="ts-icon is-bookmark-icon"/> 服務條款
                </a>
                <a href="/privacy" class="item">
                  <span class="ts-icon is-check-to-slot-icon"/> 隱私權政策
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DragonLightIcon from '../assets/DragonLightIcon.png';

const {
  githubRepositoryUrl,
  discordServerUrl,
} = useRuntimeConfig().public;
</script>
