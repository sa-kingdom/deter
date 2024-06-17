<template>
    <span v-for="(j, i) in props.content" :key="i">
        <span class="ts-text plain" v-if="j.type === 'text'">
            {{ j.content }}
        </span>
        <span class="ts-text is-deleted strikethrough" v-if="j.type === 'strikethrough'">
            <discussion-post-box-content :id="props.id" :content="j.content" />
        </span>
        <span class="ts-text spoiler" v-if="j.type === 'spoiler'">
            <discussion-post-box-content :id="props.id" :content="j.content" />
        </span>
        <span class="ts-text twemoji" v-if="j.type === 'twemoji'">
            {{ j.name }}
        </span>
        <span class="ts-text emoji" v-if="j.type === 'emoji'">
            <img class="ts-icon" :src="toEmojiUrl(j.id)" />
        </span>
        <span class="ts-text url" v-if="j.type === 'url'">
            <span class="ts-image is-rounded is-bordered" v-if="isAttachmentUrl(j.target)">
                <img :src="j.target" />
            </span>
            <span v-else>
                <a :href="j.target">
                    {{ j.target }}
                </a>
            </span>
        </span>
        <br v-if="j.type === 'br'" />
    </span>
</template>

<script setup>
import DiscussionPostBoxContent from './DiscussionPostBoxContent.vue';

/**
 * Base urls for CDN and Media endpoints in Discord's API, used when rendering attachments or embedded content like images/gifv etc..
 */
const baseUrlCdn = "https://cdn.discordapp.com";

/**
 * Base urls for Media endpoints in Discord's API, used when rendering attachments or embedded content like images/gifv etc..
 */
const baseUrlMedia = "https://media.discordapp.net";

/**
 * Mapping emoji id into imeage url.
 * @param {string} emojiId - The image id of the emoji to convert into a URL.
 * @return {string} - The url of emoji image.
 */
function toEmojiUrl(emojiId) {
    return `${baseUrlCdn}/emojis/${emojiId}`;
}

/**
 * Check if the url is a attachment URL.
 * @param {string} url - The URL to check.
 * @return {boolean} - True if the url is a attachment URL. False otherwise.
 */
function isAttachmentUrl(url) {
    return url.startsWith(`${baseUrlMedia}/attachments/`);
}

const props = defineProps({
    "id": {
        type: String,
        required: true,
    },
    "content": {
        type: Array,
        required: true,
    },
});
</script>

<style scoped>
.spoiler {
    background-color: gray;
    color: transparent;
}

.spoiler:hover {
    background-color: inherit;
    color: inherit;
}
</style>
