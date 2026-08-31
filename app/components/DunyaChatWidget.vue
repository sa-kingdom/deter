<template>
  <div class="dunya-chat-wrapper has-bottom-spaced">
    <!-- Collapsed State: Faux Input Button -->
    <div
      v-if="!isExpanded"
      class="dunya-faux-input ts-segment is-interactive"
      role="button"
      tabindex="0"
      aria-label="開啟 Dunya 對話"
      @click="expandChat"
      @keydown.enter.prevent="expandChat"
      @keydown.space.prevent="expandChat"
    >
      <div class="faux-inner">
        <div class="faux-left">
          <div class="ts-avatar is-circular is-small faux-avatar">
            <img :src="DragonLightIcon" alt="Dunya">
          </div>
          <div class="faux-placeholder">
            <span class="ts-icon is-wand-magic-sparkles-icon text-accent" />
            <span>問問 Dunya... 搜尋話題、詢問社群問題或隨興聊聊</span>
          </div>
        </div>
        <div class="ts-badge is-primary is-small is-outlined is-start-icon faux-badge">
          <span class="ts-icon is-comments-icon" />
          <span>開啟對話</span>
        </div>
      </div>
    </div>

    <!-- Expanded State: Interactive Chat UI -->
    <div
      v-else
      class="dunya-chat-box ts-box is-elevated"
    >
      <!-- Chat Header -->
      <div class="chat-header-bar">
        <div class="header-left">
          <div class="ts-avatar is-circular is-small header-avatar">
            <img :src="DragonLightIcon" alt="Dunya">
          </div>
          <div class="header-titles">
            <div class="header-main-title ts-text is-bold is-small">
              Dunya
            </div>
            <div class="header-sub-title ts-text is-secondary is-tiny">
              Deter 論壇社群智慧體
            </div>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="header-actions">
          <button
            v-if="messages.length > 0"
            type="button"
            class="ts-button is-ghost is-secondary is-dense is-small is-start-icon action-btn"
            title="清除對話紀錄"
            @click="clearMessages"
          >
            <span class="ts-icon is-trash-can-icon" />
            <span>清除</span>
          </button>
          <button
            type="button"
            class="ts-button is-ghost is-secondary is-dense is-small is-start-icon action-btn"
            title="收起對話框 (Esc)"
            @click="collapseChat"
          >
            <span class="ts-icon is-chevron-up-icon" />
            <span>收起</span>
          </button>
        </div>
      </div>

      <!-- Messages Stream -->
      <div
        ref="messagesContainerRef"
        class="chat-messages-body"
      >
        <!-- Welcome Card & Quick Starter Prompts -->
        <Transition name="tip-fade">
          <div
            v-if="messages.length === 0"
            class="welcome-card ts-segment is-secondary is-light has-bottom-spaced"
          >
            <div class="welcome-header">
              <span class="ts-icon is-wand-magic-sparkles-icon text-accent" />
              <span class="ts-text is-bold is-small">小提示</span>
            </div>
            <p class="welcome-desc">
              您可以詢問任何關於 Deter 迪特社群的內容，例如探索推薦話題、看板介紹，或詢問如何使用 Discord 串接發文。
            </p>
            <div class="quick-prompts-wrap">
              <button
                v-for="(prompt, idx) in quickPrompts"
                :key="idx"
                type="button"
                class="quick-prompt-chip"
                @click="handleQuickPrompt(prompt)"
              >
                {{ prompt }}
              </button>
            </div>
          </div>
        </Transition>

        <!-- Chat Bubble History -->
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="message-row"
          :class="{'is-user': msg.role === 'user', 'is-assistant': msg.role === 'assistant'}"
        >
          <!-- Assistant Avatar -->
          <div
            v-if="msg.role === 'assistant'"
            class="ts-avatar is-circular is-small message-avatar"
          >
            <img :src="DragonLightIcon" alt="Dunya">
          </div>

          <!-- Message Bubble -->
          <div class="message-bubble">
            <div class="message-content">
              {{ msg.content }}
            </div>
            <div class="message-time ts-text is-tiny is-secondary">
              {{ formatTime(msg.timestamp) }}
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div
          v-if="isLoading"
          class="message-row is-assistant"
        >
          <div class="ts-avatar is-circular is-small message-avatar">
            <img :src="DragonLightIcon" alt="Dunya">
          </div>
          <div class="message-bubble typing-bubble">
            <span class="typing-dot" />
            <span class="typing-dot" />
            <span class="typing-dot" />
          </div>
        </div>
      </div>

      <!-- Integrated Input Footer -->
      <div class="chat-footer-bar">
        <form @submit.prevent="handleSendMessage">
          <div class="integrated-input-box">
            <textarea
              ref="inputRef"
              v-model="inputText"
              class="integrated-textarea"
              rows="2"
              placeholder="輸入問題或訊息... (Enter 發送，Shift + Enter 換行)"
              :disabled="isLoading"
              @keydown.enter.exact.prevent="handleSendMessage"
              @keydown.esc="collapseChat"
            />
            <div class="integrated-actions-bar">
              <span class="input-hint-text">
                按 Esc 可收合
              </span>
              <button
                type="submit"
                class="ts-button is-primary is-small is-circular send-btn"
                :class="{'is-loading': isLoading}"
                :disabled="!inputText.trim() || isLoading"
                title="發送訊息 (Enter)"
              >
                <span class="ts-icon is-paper-plane-icon" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, nextTick} from 'vue';
import DragonLightIcon from '~/assets/DragonLightIcon.png';

const isExpanded = ref(false);
const inputText = ref('');
const isLoading = ref(false);
const messages = ref([]);
const messagesContainerRef = ref(null);
const inputRef = ref(null);

const quickPrompts = [
  '近期社群上有哪些熱門話題？',
  'Deter 迪特論壇有哪些特色看板？',
  '如何從 Discord 發布文章同步過來？',
  'Dunya 是如何運作的？',
];

/**
 * Expand chat box and focus input field.
 */
async function expandChat() {
  isExpanded.value = true;
  await nextTick();
  scrollToBottom();
  inputRef.value?.focus();
}

/**
 * Collapse chat box back to faux input button.
 */
function collapseChat() {
  isExpanded.value = false;
}

/**
 * Clear current chat message history.
 */
function clearMessages() {
  messages.value = [];
}

/**
 * Scroll chat messages stream to bottom.
 */
function scrollToBottom() {
  if (messagesContainerRef.value) {
    messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight;
  }
}

/**
 * Format timestamp into HH:mm format.
 * @param timestamp - Numeric timestamp or date.
 * @returns Formatted time string.
 */
function formatTime(timestamp) {
  const d = new Date(timestamp);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Handle clicking on a quick starter prompt.
 * @param promptText - Prompt content to send.
 */
function handleQuickPrompt(promptText) {
  inputText.value = promptText;
  handleSendMessage();
}

/**
 * Send current message and query Dunya conversational API.
 */
async function handleSendMessage() {
  const text = inputText.value.trim();
  if (!text || isLoading.value) return;

  const userMessage = {
    id: `user-${Date.now()}`,
    role: 'user',
    content: text,
    timestamp: Date.now(),
  };

  messages.value.push(userMessage);
  inputText.value = '';
  isLoading.value = true;
  await nextTick();
  scrollToBottom();

  try {
    // Integration Hook for Dunya API:
    // When Dunya's conversational endpoint is ready, replace simulated reply with:
    // const res = await $fetch('/api/dunya/chat', { method: 'POST', body: { message: text } });
    const replyContent = await simulateDunyaReply(text);

    messages.value.push({
      id: `dunya-${Date.now()}`,
      role: 'assistant',
      content: replyContent,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error('Failed to get Dunya reply:', err);
    messages.value.push({
      id: `err-${Date.now()}`,
      role: 'assistant',
      content: '抱歉，Dunya 目前連線稍有延遲，請稍後再試！',
      timestamp: Date.now(),
    });
  } finally {
    isLoading.value = false;
    await nextTick();
    scrollToBottom();
  }
}

/**
 * Simulated Dunya assistant reply generator.
 * Provides helpful answers about Deter and Dunya before the backend API is connected.
 * @param query - The user prompt text.
 * @returns Simulated response text.
 */
async function simulateDunyaReply(query) {
  // Simulate natural AI thinking delay (600ms ~ 1200ms)
  await new Promise((resolve) => setTimeout(resolve, 800));

  const q = query.toLowerCase();
  if (q.includes('熱門') || q.includes('話題') || q.includes('推薦')) {
    return 'Deter 論壇目前有許多熱門討論，您可以從左側看板的「綜合」、「廢文」或「創作」發掘話題，也可以直接點選「全部話題」瀏覽最新討論串。';
  }
  if (q.includes('看板') || q.includes('特色') || q.includes('分類')) {
    return 'Deter 擁有豐富的看板分類，包括「網站建議/回報」、「站方」、「集中串」、「綜合」、「廢文」、「心情」、「創作」、「遊戲」以及「輔導級內容」，點擊左側看板即可隨時篩選。';
  }
  if (q.includes('discord') || q.includes('發布') || q.includes('發文') || q.includes('同步')) {
    return 'Deter 與 Discord 論壇頻道同步運作，您可以點擊右側欄的「進入 Discord 發佈文章」加入社群，在論壇頻道發布的貼文、留言、貼圖與附件都會由 Dunya 自動同步到此處展示。';
  }
  if (q.includes('dunya') || q.includes('你') || q.includes('機器人')) {
    return '我是 Dunya，負責將 Discord 論壇頻道的貼文、留言、貼圖與檔案即時同步並快取至 Deter，未來也將在此提供對話與話題導覽功能。';
  }

  return `已收到您的訊息：「${query}」，此對話介面已就緒，未來將直接串接 Dunya 提供對話服務。`;
}
</script>

<style scoped>
.dunya-chat-wrapper {
  margin-bottom: 1.25rem;
}

/* ── Faux Input Trigger ── */
.dunya-faux-input {
  border-radius: 9999px !important;
  padding: 0.65rem 1.25rem !important;
  cursor: pointer;
  border: 1px solid var(--ts-gray-300, #e0e0e0);
  background: var(--ts-gray-50, #fafafa);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.dunya-faux-input:hover {
  background: #ffffff;
  border-color: var(--ts-primary-500, #5865f2);
  box-shadow: 0 4px 14px rgba(88, 101, 242, 0.12);
  transform: translateY(-1px);
}

.faux-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.faux-left {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex: 1;
  min-width: 0;
}

.faux-placeholder {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: var(--ts-gray-600, #777);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.faux-avatar img {
  object-fit: contain;
}

.faux-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
}

.text-accent {
  color: var(--ts-primary-500, #5865f2);
}

/* ── Expanded Chat Box ── */
.dunya-chat-box {
  border-radius: 1rem !important;
  overflow: hidden;
  border: 1px solid var(--ts-gray-300, #e0e0e0);
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  animation: expandIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes expandIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ── Chat Header ── */
.chat-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.15rem;
  border-bottom: 1px solid var(--ts-gray-200, #ebebeb);
  background: var(--ts-gray-50, #fcfcfc);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.header-avatar {
  flex-shrink: 0;
}

.header-titles {
  display: flex;
  flex-direction: column;
}

.header-main-title {
  line-height: 1.3;
}

.header-sub-title {
  line-height: 1.3;
  margin-top: 0.15rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

/* ── Messages Stream ── */
.chat-messages-body {
  max-height: 380px;
  min-height: 200px;
  overflow-y: auto;
  padding: 1rem !important;
  background: var(--ts-gray-50, #fdfdfd);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.welcome-card {
  border-radius: 0.75rem !important;
  padding: 0.9rem 1.1rem !important;
}

/* ── Tip Card Transition ── */
.tip-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.tip-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
  max-height: 0;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.tip-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.tip-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.welcome-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.45rem;
}

.welcome-desc {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--ts-gray-600, #666);
  margin: 0 0 0.85rem 0;
}

.quick-prompts-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.quick-prompt-chip {
  background: #ffffff;
  border: 1px solid var(--ts-gray-300, #e0e0e0);
  border-radius: 9999px;
  padding: 0.35rem 0.8rem;
  font-size: 0.82rem;
  color: var(--ts-gray-700, #333);
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-prompt-chip:hover {
  border-color: var(--ts-primary-500, #5865f2);
  color: var(--ts-primary-500, #5865f2);
  background: rgba(88, 101, 242, 0.05);
}

/* ── Message Rows & Bubbles ── */
.message-row {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

.message-row.is-user {
  justify-content: flex-end;
}

.message-row.is-assistant {
  justify-content: flex-start;
}

.message-avatar {
  flex-shrink: 0;
  margin-bottom: 0.2rem;
}

.message-bubble {
  max-width: 80%;
  padding: 0.65rem 0.95rem;
  border-radius: 1rem;
  line-height: 1.5;
  font-size: 0.92rem;
  word-break: break-word;
}

.message-row.is-user .message-bubble {
  background-color: var(--ts-primary-500, #5865f2);
  color: #ffffff;
  border-bottom-right-radius: 0.25rem;
  box-shadow: 0 2px 8px rgba(88, 101, 242, 0.2);
}

.message-row.is-assistant .message-bubble {
  background-color: #ffffff;
  color: inherit;
  border: 1px solid var(--ts-gray-200, #e6e6e6);
  border-bottom-left-radius: 0.25rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.message-time {
  margin-top: 0.35rem;
  font-size: 0.72rem !important;
  opacity: 0.75;
}

.message-row.is-user .message-time {
  text-align: right;
  color: rgba(255, 255, 255, 0.85);
}

/* ── Typing Indicator ── */
.typing-bubble {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0.65rem 0.9rem;
}

.typing-dot {
  width: 6px;
  height: 6px;
  background-color: var(--ts-gray-500, #888);
  border-radius: 50%;
  animation: typingBounce 1.4s infinite ease-in-out both;
}

.typing-dot:nth-child(1) { animation-delay: -0.32s; }
.typing-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes typingBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

/* ── Integrated Chat Footer ── */
.chat-footer-bar {
  padding: 0.85rem 1rem 1rem !important;
  background: #ffffff;
  border-top: 1px solid var(--ts-gray-200, #ebebeb);
}

.integrated-input-box {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--ts-gray-300, #d9d9d9);
  border-radius: 0.85rem;
  background: var(--ts-gray-50, #fcfcfc);
  padding: 0.65rem 0.85rem 0.65rem;
  transition: all 0.2s ease;
}

.integrated-input-box:focus-within {
  background: #ffffff;
  border-color: var(--ts-primary-500, #5865f2);
  box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.15);
}

.integrated-textarea {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  font-size: 0.92rem;
  line-height: 1.5;
  resize: none;
  outline: none;
  color: inherit;
  font-family: inherit;
  min-height: 2.8rem;
}

.integrated-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.4rem;
  padding-top: 0.35rem;
}

.input-hint-text {
  font-size: 0.75rem;
  color: var(--ts-gray-500, #888);
  user-select: none;
}

.send-btn {
  width: 2rem !important;
  height: 2rem !important;
  min-width: 2rem !important;
  padding: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 50% !important;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .input-hint-text {
    display: none;
  }
}
</style>
