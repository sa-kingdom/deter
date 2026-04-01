import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import 'dayjs/locale/zh-tw.js';

export default defineNuxtPlugin((nuxtApp) => {
  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.locale('zh-tw');
  nuxtApp.provide('dayjs', dayjs);
});
