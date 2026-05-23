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

type I18nWithCompat = typeof i18n & {
  t: (key: string) => string;
  locale: string;
};

const compatI18n = i18n as I18nWithCompat;

Object.assign(compatI18n, {
  t: (...args: Parameters<typeof i18n.global.t>) => i18n.global.t(...args),
});
Object.defineProperty(compatI18n, 'locale', {
  get() {
    return compatI18n.global.locale.value;
  },
  set(value: string) {
    compatI18n.global.locale.value = value;
  },
});

export default compatI18n;
