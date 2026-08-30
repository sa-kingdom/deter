<template>
  <NuxtLoadingIndicator
    color="repeating-linear-gradient(to right, #5865F2 0%, #00b4d8 50%, #5865F2 100%)"
    :height="3"
    :throttle="0"
  />
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
</template>
