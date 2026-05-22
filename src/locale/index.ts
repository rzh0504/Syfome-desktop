import { createI18n } from 'vue-i18n';
import store from '@/store';

import en from './lang/en';
import zhCN from './lang/zh-CN';
import zhTW from './lang/zh-TW';
import tr from './lang/tr';

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: store.state.settings.lang,
  messages: {
    en,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    tr,
  },
  missingWarn: false,
  fallbackWarn: false,
});

Object.assign(i18n, {
  t: (...args: Parameters<typeof i18n.global.t>) => i18n.global.t(...args),
});
Object.defineProperty(i18n, 'locale', {
  get() {
    return i18n.global.locale.value;
  },
  set(value: string) {
    i18n.global.locale.value = value;
  },
});

export default i18n;
