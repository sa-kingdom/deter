<template>
  <div class="ts-app-layout is-full is-vertical">
    <!-- Top Navbar -->
    <div
      class="cell is-secondary"
      style="border-bottom: 1px solid var(--ts-gray-300); position: relative;"
    >
      <!-- Navbar Breathing Light on Page Navigation -->
      <div
        class="navbar-breathing-bar"
        :class="{'is-active': isPageNavigating}"
      />
      <div class="ts-container">
        <div class="ts-content is-dense">
          <div
            class="ts-wrap is-middle-aligned"
            style="justify-content: space-between; width: 100%; flex-wrap: nowrap;"
          >
            <!-- Left: Brand -->
            <NuxtLink
              to="/"
              class="ts-wrap is-middle-aligned is-compact"
              style="text-decoration: none; color: inherit; flex-shrink: 0;"
            >
              <div class="ts-avatar is-circular is-small">
                <img :src="DragonLightIcon" alt="">
              </div>
              <span class="ts-text is-bold is-large has-start-spaced-small">
                Deter 迪特
              </span>
            </NuxtLink>

            <!-- Right: Discord CTA, GitHub & Mobile Menu -->
            <div
              class="ts-wrap is-middle-aligned is-compact"
              style="flex-shrink: 0;"
            >
              <!-- Desktop: Discord Button with Text -->
              <a
                :href="discordServerUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="ts-button is-primary is-small is-start-icon is-not-minimal"
              >
                <span class="ts-icon is-discord-icon" />
                <span>進入 Discord</span>
              </a>
              <!-- Mobile: Discord Icon Button (Perfect Centering) -->
              <a
                :href="discordServerUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="ts-button is-primary is-small is-icon is-minimal-only"
                aria-label="進入 Discord"
              >
                <span class="ts-icon is-discord-icon" />
              </a>
              <button
                type="button"
                class="ts-button is-icon is-secondary is-small is-minimal-only"
                aria-label="開啟選單"
                @click="isDrawerOpen = true"
              >
                <span class="ts-icon is-bars-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Drawer (Right) -->
    <div
      class="ts-app-drawer is-right"
      :class="{'is-visible': isDrawerOpen}"
      @click.self="isDrawerOpen = false"
    >
      <div
        class="content"
        style="height: 100%; display: flex; flex-direction: column;"
      >
        <!-- Scrollable Navigation Area -->
        <div class="has-padded" style="flex: 1 1 auto; overflow-y: auto;">
          <!-- Drawer Header with X aligned to far right -->
          <div
            class="ts-wrap is-middle-aligned has-bottom-spaced"
            style="justify-content: space-between; width: 100%;"
          >
            <div class="ts-wrap is-middle-aligned is-compact">
              <div class="ts-avatar is-circular is-small">
                <img :src="DragonLightIcon" alt="">
              </div>
              <span class="ts-text is-bold has-start-spaced-small">
                Deter 迪特
              </span>
            </div>
            <button
              type="button"
              class="ts-close"
              aria-label="關閉"
              @click="isDrawerOpen = false"
            />
          </div>
          <div class="ts-divider" />

          <!-- Navigation Feeds -->
          <div
            class="ts-text is-secondary is-small is-bold has-top-spaced has-bottom-spaced-small"
          >
            探索
          </div>
          <div class="ts-menu is-start-icon is-separated is-dense">
            <NuxtLink
              to="/"
              class="item is-active"
              @click="isDrawerOpen = false"
            >
              <span class="ts-icon is-house-icon" /> 全部話題
            </NuxtLink>
          </div>

          <!-- Communities -->
          <div
            class="ts-text is-secondary is-small is-bold has-top-spaced has-bottom-spaced-small"
          >
            看板
          </div>
          <div class="ts-menu is-start-icon is-separated is-dense">
            <a href="#!" class="item">
              <span class="ts-icon is-comments-icon" /> 八卦
            </a>
            <a href="#!" class="item">
              <span class="ts-icon is-box-icon" /> 廢文
            </a>
            <a href="#!" class="item">
              <span class="ts-icon is-store-icon" /> 市集
            </a>
            <a href="#!" class="item">
              <span class="ts-icon is-flag-icon" /> 站方
            </a>
            <a href="#!" class="item">
              <span class="ts-icon is-star-icon" /> 精華
            </a>
          </div>

          <div class="ts-divider is-section" />

          <!-- Site Info & Policies -->
          <div class="ts-menu is-start-icon is-separated is-dense">
            <a
              :href="githubRepositoryUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="item"
            >
              <span class="ts-icon is-github-icon" /> 加入 GitHub 協助我們
            </a>
            <NuxtLink to="/about" class="item" @click="isDrawerOpen = false">
              <span class="ts-icon is-user-group-icon" /> 關於 Deter 迪特
            </NuxtLink>
            <NuxtLink to="/rules" class="item" @click="isDrawerOpen = false">
              <span class="ts-icon is-flag-icon" /> 全站版規
            </NuxtLink>
            <NuxtLink to="/terms" class="item" @click="isDrawerOpen = false">
              <span class="ts-icon is-bookmark-icon" /> 服務條款
            </NuxtLink>
            <NuxtLink to="/privacy" class="item" @click="isDrawerOpen = false">
              <span class="ts-icon is-check-to-slot-icon" /> 隱私權政策
            </NuxtLink>
          </div>
        </div>

        <!-- Fixed Bottom Discord CTA -->
        <div
          class="has-padded"
          style="flex-shrink: 0; border-top: 1px solid var(--ts-gray-300);"
        >
          <a
            :href="discordServerUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="ts-button is-primary is-fluid is-small is-start-icon"
          >
            <span class="ts-icon is-discord-icon" /> 進入 Discord
          </a>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="cell is-secondary is-fluid is-scrollable">
      <div class="ts-container has-vertically-spaced">
        <div class="ts-grid is-relaxed is-stackable">
          <!-- Left Navigation (Desktop) -->
          <div class="column is-3-wide is-not-minimal">
            <div style="position: sticky; top: 1rem">
              <div
                class="ts-text is-secondary is-small is-bold has-bottom-spaced-small"
              >
                探索
              </div>
              <div class="ts-menu is-start-icon is-separated is-dense">
                <NuxtLink to="/" class="item is-active">
                  <span class="ts-icon is-house-icon" /> 全部話題
                </NuxtLink>
              </div>

              <div class="ts-divider is-section" />

              <div
                class="ts-text is-secondary is-small is-bold has-bottom-spaced-small"
              >
                看板
              </div>
              <div class="ts-menu is-start-icon is-separated is-dense">
                <a href="#!" class="item">
                  <span class="ts-icon is-comments-icon" /> 八卦
                </a>
                <a href="#!" class="item">
                  <span class="ts-icon is-box-icon" /> 廢文
                </a>
                <a href="#!" class="item">
                  <span class="ts-icon is-store-icon" /> 市集
                </a>
                <a href="#!" class="item">
                  <span class="ts-icon is-flag-icon" /> 站方
                </a>
                <a href="#!" class="item">
                  <span class="ts-icon is-star-icon" /> 精華
                </a>
              </div>
            </div>
          </div>

          <!-- Center Discussion Stream -->
          <div class="column is-9-wide is-fluid">
            <slot />
          </div>

          <!-- Right Sidebar (Desktop) -->
          <div class="column is-4-wide is-not-minimal">
            <div style="position: sticky; top: 1rem">
              <div class="ts-segment">
                <div class="ts-wrap is-middle-aligned has-bottom-spaced-small">
                  <div class="ts-avatar is-circular is-small">
                    <img :src="DragonLightIcon" alt="Logo">
                  </div>
                  <span class="ts-text is-bold">關於 Deter 社群</span>
                </div>
                <p class="ts-text is-secondary is-small">
                  在名為 Discord 的高速公路風馳電掣的論壇系統 ⚔️
                </p>
                <a
                  :href="discordServerUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="ts-button is-primary is-fluid is-small is-start-icon has-top-spaced"
                >
                  <span class="ts-icon is-discord-icon" /> 進入 Discord 發佈文章
                </a>
                <div class="ts-divider is-section" />
                <div class="ts-menu is-start-icon is-separated is-dense">
                  <a
                    :href="githubRepositoryUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="item"
                  >
                    <span class="ts-icon is-github-icon" /> 加入 GitHub 協助我們
                  </a>
                  <NuxtLink to="/about" class="item">
                    <span class="ts-icon is-user-group-icon" /> 關於 Deter 迪特
                  </NuxtLink>
                  <NuxtLink to="/rules" class="item">
                    <span class="ts-icon is-flag-icon" /> 全站版規
                  </NuxtLink>
                  <NuxtLink to="/terms" class="item">
                    <span class="ts-icon is-bookmark-icon" /> 服務條款
                  </NuxtLink>
                  <NuxtLink to="/privacy" class="item">
                    <span class="ts-icon is-check-to-slot-icon" /> 隱私權政策
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import DragonLightIcon from '../assets/DragonLightIcon.png';

const isDrawerOpen = ref(false);
const isPageNavigating = ref(false);

const router = useRouter();
router.beforeEach((to, from) => {
  if (to.path !== from.path) {
    isPageNavigating.value = true;
  }
});
router.afterEach(() => {
  isPageNavigating.value = false;
});

const nuxtApp = useNuxtApp();
nuxtApp.hook('page:start', () => {
  isPageNavigating.value = true;
});
nuxtApp.hook('page:finish', () => {
  isPageNavigating.value = false;
});

const {
  githubRepositoryUrl,
  discordServerUrl,
} = useRuntimeConfig().public;
</script>

<style>
/* Breathing light for top navbar during page navigation */
.navbar-breathing-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #5865f2, #00b4d8, #5865f2);
  background-size: 200% 100%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1000;
}

.navbar-breathing-bar.is-active {
  opacity: 1;
  animation:
    navbar-pulse 1.2s ease-in-out infinite,
    navbar-shift 1.8s linear infinite;
}

@keyframes navbar-pulse {
  0%, 100% {
    opacity: 0.5;
    filter: drop-shadow(0 0 4px #5865f2);
  }
  50% {
    opacity: 1;
    filter: drop-shadow(0 0 10px #00b4d8);
  }
}

@keyframes navbar-shift {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

/* Button hover & active feedback */
.ts-button {
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    transform 0.1s ease,
    box-shadow 0.15s ease,
    filter 0.15s ease !important;
  cursor: pointer;
}

.ts-button:hover {
  filter: brightness(1.12) !important;
}

.ts-button:active {
  transform: scale(0.96) !important;
  filter: brightness(0.92) !important;
}

/* Menu items hover and active */
.ts-menu .item {
  transition:
    background-color 0.15s ease,
    transform 0.1s ease,
    color 0.15s ease !important;
}

.ts-menu .item:hover {
  background-color: var(--ts-gray-200) !important;
}

.ts-menu .item:active {
  transform: scale(0.98) !important;
  background-color: var(--ts-gray-300) !important;
}

/* Interactive discussion cards hover & active */
.ts-segment.is-interactive {
  transition:
    transform 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease !important;
}

.ts-segment.is-interactive:hover {
  border-color: var(--ts-gray-400) !important;
}

.ts-segment.is-interactive:active {
  transform: scale(0.995) !important;
}
</style>
