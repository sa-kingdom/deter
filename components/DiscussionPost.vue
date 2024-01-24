<template>
    <div class="ts-segment has-top-spaced">
        <div class="ts-grid">
            <div class="column">
                <div class="ts-avatar is-large is-circular">
                    <img :src="authorProfileAvatar" />
                </div>
            </div>
            <div class="column is-fluid">
                <div style="line-height: 1.5">
                    <div class="ts-meta is-small is-secondary">
                        <div class="item" :title="props.createdAt">
                            {{ props.user.displayName }} | {{ $dayjs(props.createdAt).fromNow() }}
                        </div>
                    </div>
                    <div class="content has-vertically-spaced-small" v-if="props.content.length">
                        <span v-for="(j, i) in props.content" :key="i">
                            <span class="text plain" v-if="j.type === 'text'">
                                {{ j.content }}
                            </span>
                            <span class="text emoji" v-if="j.type === 'emoji'">
                                <img class="ts-icon" :src="`https://cdn.discordapp.com/emojis/${j.id}`" />
                            </span>
                            <span class="text url" v-if="j.type === 'url'">
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
                        </span>
                    </div>
                    <div class="content has-vertically-spaced-small" v-if="props.media.length">
                        <div v-for="(j, i) in props.media" :key="i">
                            <div class="media image ts-image is-rounded is-bordered" v-if="j.contentType.startsWith('image/')">
                                <img :src="j.url" />
                            </div>
                            <div v-else>
                                <a class="media link" :href="j.url">
                                    {{ j.name }}
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
import DragonLightIcon from "../assets/DragonLightIcon.png"

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

const authorProfileAvatar = computed(() => {
    const { id, avatarHash } = props.user;
    if (!avatarHash) {
        return DragonLightIcon;
    }
    return `https://cdn.discordapp.com/avatars/${id}/${avatarHash}`
});
</script>
  