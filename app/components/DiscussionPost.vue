<template>
    <div class="ts-segment has-top-spaced">
        <div class="ts-grid">
            <discussion-post-box
              :id="props.id" :created-at="props.createdAt" :user-id="props.userId"
              :display-name="props.user.displayName" :avatar-hash="props.user.avatarHash">
                <div v-if="props.content.length" class="content has-vertically-spaced-small">
                    <discussion-post-box-content :id="props.id" :content="props.content" />
                </div>
                <div v-if="props.media.length" class="content has-vertically-spaced-small">
                    <discussion-post-box-media :id="props.id" :media="props.media" />
                </div>
            </discussion-post-box>
        </div>
    </div>
</template>

<script setup>
import DiscussionPostBox from './DiscussionPostBox.vue';

import DiscussionPostBoxContent from './DiscussionPostBoxContent.vue';
import DiscussionPostBoxMedia from './DiscussionPostBoxMedia.vue';

const props = defineProps({
  'id': {
    type: String,
    required: true,
  },
  'content': {
    type: Array,
    required: true,
  },
  'userId': {
    type: String,
    required: true,
  },
  'user': {
    type: Object,
    required: true,
  },
  'media': {
    type: Object,
    required: true,
  },
  'createdAt': {
    type: String,
    required: true,
  },
  'updatedAt': {
    type: String,
    required: true,
  },
  'discussionId': {
    type: String,
    required: true,
  },
});
</script>
