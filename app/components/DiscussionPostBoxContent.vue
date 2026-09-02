<template>
  <span
    v-for="(j, i) in renderedContent"
    :key="i"
  >
    <!-- Plain text — may be a list item detected by post-processing -->
    <template v-if="j.type === 'text'">
      <span class="ts-text plain">{{ j.content }}</span>
    </template>

    <!-- Headings (level 1–3) -->
    <h1 v-else-if="j.type === 'heading' && j.level === 1" class="ts-header is-large">
      <discussion-post-box-content :id="props.id" :content="j.content" />
    </h1>
    <h2 v-else-if="j.type === 'heading' && j.level === 2" class="ts-header is-medium">
      <discussion-post-box-content :id="props.id" :content="j.content" />
    </h2>
    <h3 v-else-if="j.type === 'heading'" class="ts-header">
      <discussion-post-box-content :id="props.id" :content="j.content" />
    </h3>

    <!-- Subtext / -# -->
    <small
      v-else-if="j.type === 'subtext'"
      class="ts-text is-small is-secondary"
    >
      <discussion-post-box-content :id="props.id" :content="j.content" />
    </small>

    <!-- Timestamp <t:unix:format> -->
    <time
      v-else-if="j.type === 'timestamp'"
      :datetime="formatTimestamp(j.timestamp, 'ISO')"
      class="ts-text is-secondary"
      :title="formatTimestamp(j.timestamp, 'F')"
    >
      {{ formatTimestamp(j.timestamp, j.format) }}
    </time>

    <!-- Masked link [text](url) - if YouTube, embed video; if image, render image -->
    <div
      v-else-if="j.type === 'link' && getYouTubeVideoId(j.target)"
      class="youtube-embed-wrapper"
    >
      <iframe
        :src="`https://www.youtube-nocookie.com/embed/${getYouTubeVideoId(j.target)}`"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        class="youtube-iframe"
      />
    </div>
    <span
      v-else-if="j.type === 'link' && isMediaUrl(j.target)"
      class="ts-image is-rounded is-bordered"
    >
      <img :src="j.target" alt="">
    </span>
    <a
      v-else-if="j.type === 'link'"
      :href="j.target"
      target="_blank"
      rel="noopener noreferrer"
      class="content-link"
    >
      <discussion-post-box-content :id="props.id" :content="j.content" />
    </a>

    <!-- Autolink <url> - if target is an image, render directly as image -->
    <span
      v-else-if="j.type === 'autolink' && isMediaUrl(j.target)"
      class="ts-image is-rounded is-bordered"
    >
      <img :src="j.target" alt="">
    </span>
    <a
      v-else-if="j.type === 'autolink'"
      :href="j.target"
      target="_blank"
      rel="noopener noreferrer"
      class="content-link"
    >
      <discussion-post-box-content :id="props.id" :content="j.content" />
    </a>

    <!-- Bold -->
    <strong v-else-if="j.type === 'strong'">
      <discussion-post-box-content :id="props.id" :content="j.content" />
    </strong>

    <!-- Italic -->
    <em v-else-if="j.type === 'em'">
      <discussion-post-box-content :id="props.id" :content="j.content" />
    </em>

    <!-- Underline -->
    <u v-else-if="j.type === 'underline'">
      <discussion-post-box-content :id="props.id" :content="j.content" />
    </u>

    <!-- Inline code -->
    <code
      v-else-if="j.type === 'inlineCode'"
      class="ts-text is-code"
    >{{ j.content }}</code>

    <!-- Code block with syntax highlighting -->
    <pre
      v-else-if="j.type === 'codeBlock'"
      class="ts-box is-code-block hljs-pre"
    >
      <code
        class="hljs"
        v-html="highlightCode(j.content, j.lang)"
      /></pre>

    <!-- Block quote -->
    <blockquote
      v-else-if="j.type === 'blockQuote'"
      class="ts-quote"
    >
      <discussion-post-box-content :id="props.id" :content="j.content" />
    </blockquote>

    <!-- Strikethrough -->
    <s v-else-if="j.type === 'strikethrough'">
      <discussion-post-box-content :id="props.id" :content="j.content" />
    </s>

    <!-- Spoiler -->
    <span
      v-else-if="j.type === 'spoiler'"
      class="spoiler"
      role="button"
      tabindex="0"
      @click="revealSpoiler"
      @keydown.enter="revealSpoiler"
    >
      <discussion-post-box-content :id="props.id" :content="j.content" />
    </span>

    <!-- Bullet list (post-processed) -->
    <ul v-else-if="j.type === 'ul'">
      <li
        v-for="(item, li) in j.items"
        :key="li"
      >{{ item }}</li>
    </ul>

    <!-- Ordered list (post-processed) -->
    <ol v-else-if="j.type === 'ol'">
      <li
        v-for="(item, li) in j.items"
        :key="li"
      >{{ item }}</li>
    </ol>

    <!-- URL: YouTube embed, image embed or plain link -->
    <div
      v-else-if="j.type === 'url' && getYouTubeVideoId(j.target)"
      class="youtube-embed-wrapper"
    >
      <iframe
        :src="`https://www.youtube-nocookie.com/embed/${getYouTubeVideoId(j.target)}`"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        class="youtube-iframe"
      />
    </div>
    <span
      v-else-if="j.type === 'url'"
      class="url-node"
    >
      <span
        v-if="isMediaUrl(j.target)"
        class="ts-image is-rounded is-bordered"
      >
        <img :src="j.target" alt="">
      </span>
      <a
        v-else
        :href="j.target"
        target="_blank"
        rel="noopener noreferrer"
        class="content-link"
      >{{ j.target }}</a>
    </span>

    <!-- Twemoji / Unicode emoji -->
    <span
      v-else-if="j.type === 'twemoji'"
      class="twemoji"
    >{{ j.name }}</span>

    <!-- Custom Discord emoji -->
    <img
      v-else-if="j.type === 'emoji'"
      class="custom-emoji"
      :src="toEmojiUrl(j.id)"
      :alt="j.name"
    >

    <!-- Line break -->
    <br v-else-if="j.type === 'br'">
  </span>
</template>

<script setup>
import {computed} from 'vue';
import DiscussionPostBoxContent from './DiscussionPostBoxContent.vue';

/** CDN base URL for Discord emoji images. */
const baseUrlCdn = 'https://cdn.discordapp.com';

/** Media proxy base URL for Discord attachment images. */
const baseUrlMedia = 'https://media.discordapp.net';

/**
 * Returns the CDN URL for a custom Discord emoji.
 * @param emojiId - Discord emoji snowflake ID.
 * @returns Emoji image URL.
 */
function toEmojiUrl(emojiId) {
  return `${baseUrlCdn}/emojis/${emojiId}`;
}

/**
 * Returns true if the URL should be rendered as an embedded image.
 * Matches Discord CDN attachments, media proxy URLs, and direct image file URLs.
 * Also matches tenor/giphy GIF embed URLs to avoid showing raw URL text.
 * @param url - The URL to inspect.
 * @returns Whether the URL is a visual media resource.
 */
function isMediaUrl(url) {
  if (
    url.startsWith(`${baseUrlMedia}/attachments/`) ||
    url.startsWith(`${baseUrlCdn}/attachments/`)
  ) return true;
  if (/\.(?:png|jpe?g|gif|webp|svg|gifv)(\?.*)?$/i.test(url)) return true;
  // tenor / giphy embed pages should still just render as link, not img
  return false;
}

/**
 * Extracts YouTube video ID from a YouTube watch or short URL.
 * @param url - The candidate URL string.
 * @returns 11-character video ID or null if not a YouTube URL.
 */
function getYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const regExp =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Formats a Discord Unix timestamp according to the given format code.
 * @param ts - Unix timestamp string.
 * @param fmt - Discord format code (t, T, d, D, f, F, R) or 'ISO'.
 * @returns Human-readable date/time string.
 */
function formatTimestamp(ts, fmt) {
  const {$dayjs} = useNuxtApp();
  const d = $dayjs.unix(Number(ts));
  if (!d.isValid()) return `<t:${ts}>`;
  switch (fmt) {
    case 't': return d.format('HH:mm');
    case 'T': return d.format('HH:mm:ss');
    case 'd': return d.format('DD/MM/YYYY');
    case 'D': return d.format('D MMMM YYYY');
    case 'f': return d.format('D MMMM YYYY HH:mm');
    case 'F': return d.format('dddd, D MMMM YYYY HH:mm');
    case 'R': return d.fromNow();
    case 'ISO': return d.toISOString();
    default: return d.format('D MMMM YYYY HH:mm');
  }
}

/**
 * Returns HTML string with syntax highlighting for a code block.
 * Uses highlight.js; gracefully degrades if the language is unknown.
 * @param code - Raw source code string.
 * @param lang - Optional language identifier.
 * @returns HTML string with highlight spans.
 */
function highlightCode(code, lang) {
  if (!import.meta.client) return escapeHtml(code);
  // lazy import to avoid SSR issues
  const hljs = window.__hljs;
  if (!hljs) return escapeHtml(code);
  try {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, {language: lang}).value;
    }
    return hljs.highlightAuto(code).value;
  } catch {
    return escapeHtml(code);
  }
}

/**
 * Escapes HTML special characters for safe insertion as text content.
 * @param str - The string to escape.
 * @returns HTML-escaped string.
 */
function escapeHtml(str) {
  return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
}

/**
 * Reveal a spoiler element by toggling its CSS class on click/keyboard.
 * @param event - The DOM click or keydown event.
 */
function revealSpoiler(event) {
  event.currentTarget.classList.toggle('revealed');
}

/**
 * Post-processes the raw AST from discord-markdown-parser to:
 * - Collapse consecutive text nodes starting with `- ` into a <ul> list
 * - Collapse consecutive text nodes starting with `N. ` into an <ol> list
 * @param nodes - The raw AST node array.
 * @returns Augmented node array with synthetic 'ul' / 'ol' nodes.
 */
function postProcessNodes(nodes) {
  const result = [];
  let i = 0;
  while (i < nodes.length) {
    const node = nodes[i];
    // Detect start of a bullet list
    if (
      node.type === 'text' &&
      typeof node.content === 'string' &&
      /^-\s+/.test(node.content)
    ) {
      const items = [];
      while (
        i < nodes.length &&
        nodes[i].type === 'text' &&
        /^-\s+/.test(nodes[i].content)
      ) {
        items.push(nodes[i].content.replace(/^-\s+/, ''));
        i++;
        // skip adjacent <br> between list items
        if (i < nodes.length && nodes[i].type === 'br') i++;
      }
      result.push({type: 'ul', items});
      continue;
    }
    // Detect start of an ordered list
    if (
      node.type === 'text' &&
      typeof node.content === 'string' &&
      /^\d+\.\s+/.test(node.content)
    ) {
      const items = [];
      while (
        i < nodes.length &&
        nodes[i].type === 'text' &&
        /^\d+\.\s+/.test(nodes[i].content)
      ) {
        items.push(nodes[i].content.replace(/^\d+\.\s+/, ''));
        i++;
        if (i < nodes.length && nodes[i].type === 'br') i++;
      }
      result.push({type: 'ol', items});
      continue;
    }
    // Deduplicate repeated media/image nodes (e.g. image URL followed by (image URL))
    if (
      (node.type === 'url' || node.type === 'link') &&
      typeof node.target === 'string' &&
      isMediaUrl(node.target)
    ) {
      result.push({type: 'url', target: node.target});
      i++;
      if (
        i < nodes.length &&
        nodes[i].type === 'text' &&
        /^\s*\(?\s*$/.test(nodes[i].content)
      ) {
        const nextIdx = i + 1;
        if (
          nextIdx < nodes.length &&
          (nodes[nextIdx].type === 'url' || nodes[nextIdx].type === 'link') &&
          nodes[nextIdx].target === node.target
        ) {
          i = nextIdx + 1;
          if (
            i < nodes.length &&
            nodes[i].type === 'text' &&
            /^\s*\)?\s*$/.test(nodes[i].content)
          ) {
            i++;
          }
        }
      }
      continue;
    }

    result.push(node);
    i++;
  }
  return result;
}

const props = defineProps({
  'id': {
    type: String,
    required: true,
  },
  'content': {
    type: Array,
    required: true,
  },
});

const renderedContent = computed(() => postProcessNodes(props.content));
</script>

<style>
/* highlight.js code block wrapper */
.hljs-pre {
  overflow-x: auto;
  tab-size: 2;
}
</style>

<style scoped>
.spoiler {
  background-color: var(--ts-gray-800);
  color: transparent;
  border-radius: 3px;
  padding: 0 2px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s, color 0.2s;
}

.spoiler.revealed,
.spoiler:hover {
  background-color: transparent;
  color: inherit;
}

.content-link {
  color: var(--ts-primary-600);
  text-decoration: underline;
  word-break: break-all;
}

.content-link:hover {
  opacity: 0.8;
}

.custom-emoji {
  height: 1.4em;
  width: auto;
  vertical-align: middle;
}

.url-node {
  display: inline;
}

h1.ts-header,
h2.ts-header,
h3.ts-header {
  margin: 0.5em 0 0.25em;
}

ul, ol {
  margin: 0.25em 0;
  padding-left: 1.5em;
}

li {
  margin: 0.1em 0;
}

.youtube-embed-wrapper {
  margin: 0.5rem 0;
  max-width: 560px;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  background: var(--ts-gray-900);
}

.youtube-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>
