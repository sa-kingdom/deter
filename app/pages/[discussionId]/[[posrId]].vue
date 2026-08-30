<template>
  <div>
    <!-- Back to Topics -->
    <NuxtLink
      to="/"
      class="ts-button is-small is-outlined is-start-icon has-bottom-spaced"
    >
      <span class="ts-icon is-arrow-left-icon" /> 返回話題列表
    </NuxtLink>

    <!-- Unified OP Discussion Card -->
    <div class="ts-segment">
      <!-- Author Meta -->
      <div class="ts-wrap is-middle-aligned is-compact has-bottom-spaced-small">
        <div class="ts-avatar is-circular is-small">
          <img
            :src="ownerProfileAvatar"
            alt=""
            @error="handleAvatarError"
          >
        </div>
        <span class="ts-text is-bold is-small">
          {{ data.user.displayName }}
        </span>
        <span class="ts-text is-secondary is-small">•</span>
        <span class="ts-text is-secondary is-small" :title="data.createdAt">
          {{ $dayjs(data.createdAt).fromNow() }}
        </span>
        <span
          v-for="collection in (data.collections || data.tags || [])"
          :key="collection.id"
          class="ts-badge is-small is-outlined is-secondary"
        >
          {{ collection.name }}
        </span>
      </div>

      <!-- Title -->
      <div class="ts-header is-heavy is-large has-bottom-spaced-small">
        {{ data.name }}
      </div>

      <!-- OP Post Content & Media -->
      <div
        v-if="opPost"
        style="line-height: 1.6; word-break: break-word;"
      >
        <div
          v-if="opPost.content?.length"
          class="has-top-spaced-small"
        >
          <discussion-post-box-content
            :id="opPost.id"
            :content="opPost.content"
          />
        </div>
        <div
          v-if="opPost.media?.length"
          class="has-top-spaced-small"
        >
          <discussion-post-box-media
            :id="opPost.id"
            :media="opPost.media"
          />
        </div>
      </div>
    </div>

    <!-- Replies Stream -->
    <div v-if="replyPosts.length" class="has-top-spaced">
      <div
        class="ts-text is-secondary is-bold is-small has-bottom-spaced-small"
      >
        全部留言（{{ replyPosts.length }}）
      </div>
      <discussion-post
        v-for="(j, i) in replyPosts"
        :key="i"
        v-bind="j"
        :users="data.users"
      />
    </div>
  </div>
</template>

<script setup>
import DragonLightIcon from '~/assets/DragonLightIcon.png';
import DiscussionPost from '~/components/DiscussionPost.vue';
import DiscussionPostBoxContent from '~/components/DiscussionPostBoxContent.vue';
import DiscussionPostBoxMedia from '~/components/DiscussionPostBoxMedia.vue';

const handleAvatarError = (event) => {
  event.target.src = DragonLightIcon;
};

const {apiInvokeBaseUrl, apiPublicBaseUrl} = useRuntimeConfig().public;
const route = useRoute();

const {discussionId} = route.params;
const {data, error} = await useFetch(
    `${apiInvokeBaseUrl}/discussions/${discussionId}`,
    {
      key: `discussion-${discussionId}`,
    },
);

if (error.value) {
  console.error(error.value);
}

useHead({
  title: data.value?.name || '話題詳情',
});

const opPost = computed(() => data.value?.posts?.[0]);
const replyPosts = computed(() => data.value?.posts?.slice(1) || []);

const ownerProfileAvatar = computed(() => {
  if (!data.value?.user) {
    return DragonLightIcon;
  }
  const {id, avatarHash} = data.value.user;
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
