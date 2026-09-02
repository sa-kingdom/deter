import hljs from 'highlight.js';

declare global {
  interface Window {
    __hljs: typeof hljs;
  }
}

export default defineNuxtPlugin(() => {
  // Expose hljs on window so DiscussionPostBoxContent can use it lazily
  if (import.meta.client) {
    window.__hljs = hljs;
  }
});
