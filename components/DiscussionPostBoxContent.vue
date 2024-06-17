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
            <img class="ts-icon" :src="`https://cdn.discordapp.com/emojis/${j.id}`" />
        </span>
        <span class="ts-text url" v-if="j.type === 'url'">
            <span class="ts-image is-rounded is-bordered"
                v-if="j.target.startsWith('https://media.discordapp.net/attachments/')">
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

console.log(Array.from(props.content).map(i=>i.content));

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
.spoiler{
  background-color: gray;
  color: transparent;
}

.spoiler:hover{
  background-color: inherit;
  color: inherit;
}
</style>
