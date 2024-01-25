<template>
  <div class="ts-app-layout is-full is-vertical">
    <div class="cell">
      <div class="ts-container">
        <div class="navbar ts-tab is-center-aligned">
          <a href="/" class="item is-active">
            <span class="ts-icon is-dragon-icon"></span>
            Deter 迪特
          </a>
        </div>
      </div>
    </div>
    <div class="cell is-secondary is-fluid is-scrollable">
      <slot />
    </div>
  </div>
</template>