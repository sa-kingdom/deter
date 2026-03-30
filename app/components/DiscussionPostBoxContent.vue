<template>
    <span v-for="(j, i) in props.content" :key="i">
        <span v-if="j.type === 'text'" class="ts-text plain">
            {{ j.content }}
        </span>
        <span v-if="j.type === 'strikethrough'" class="ts-text is-deleted strikethrough">
            <discussion-post-box-content :id="props.id" :content="j.content" />
        </span>
        <span v-if="j.type === 'spoiler'" class="ts-text spoiler">
            <discussion-post-box-content :id="props.id" :content="j.content" />
        </span>
        <span v-if="j.type === 'twemoji'" class="ts-text twemoji">
            {{ j.name }}
        </span>
        <span v-if="j.type === 'emoji'" class="ts-text emoji">
            <img class="ts-icon" :src="toEmojiUrl(j.id)" >
        </span>
        <span v-if="j.type === 'url'" class="ts-text url">
            <span v-if="isAttachmentUrl(j.target)" class="ts-image is-rounded is-bordered">
                <img :src="j.target" >
            </span>
            <span v-else>
                <a :href="j.target">
                    {{ j.target }}
                </a>
            </span>
        </span>
        <br v-if="j.type === 'br'" >
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
