<template>
    <div class="ts-app-layout is-full is-vertical">
        <div class="cell">
            <div class="ts-container">
                <div class="navbar ts-tab is-center-aligned">
                    <a href="/" class="item is-active">
                        <span class="ts-icon is-dragon-icon"></span>
                        Deter 迪特
                    </a>
                </div>
            </div>
        </div>
        <div class="ts-blankslate">
            <span class="ts-icon is-ban-icon"></span>
            <div class="header">發生了些錯誤</div>
            <div class="description">
                <div class="ts-meta is-small is-secondary">
                    <span v-if="error.statusCode === 404">
                        您所請求的頁面並不存在
                    </span>
                    <span v-else>
                        非預期的錯誤
                    </span>
                </div>
                <div class="has-vertically-spaced-small">
                    錯誤代號：{{ error.statusCode }}<br />
                    錯誤原因："{{ error.statusMessage }}"
                </div>
            </div>
            <div class="action">
                <button class="ts-button" @click="onClickGoHome">
                    返回首頁
                </button>
            </div>
        </div>
    </div>
</template>
  
<script setup>
const props = defineProps({
    error: Object
});

const router = useRouter();

function onClickGoHome() {
    router.push("/");
}
</script>
