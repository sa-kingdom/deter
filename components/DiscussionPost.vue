<template>
    <div class="ts-segment has-top-spaced">
        <div class="ts-grid">
            <discussion-post-box :id="props.id" :createdAt="props.createdAt" :userId="props.userId"
                :displayName="props.user.displayName" :avatarHash="props.user.avatarHash">
                <div class="content has-vertically-spaced-small" v-if="props.content.length">
                    <discussion-post-box-content :id="props.id" :content="props.content" />
                </div>
                <div class="content has-vertically-spaced-small" v-if="props.media.length">
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
    "id": {
        type: String,
        required: true,
    },
    "content": {
        type: Array,
        required: true,
    },
    "userId": {
        type: String,
        required: true,
    },
    "user": {
        type: Object,
        required: true,
    },
    "media": {
        type: Object,
        required: true,
    },
    "createdAt": {
        type: String,
        required: true,
    },
    "updatedAt": {
        type: String,
        required: true,
    },
    "discussionId": {
        type: String,
        required: true,
    },
});
</script>
  