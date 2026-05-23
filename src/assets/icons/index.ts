import SvgIcon from '@/components/SvgIcon.vue';
import 'virtual:svg-icons-register';
import type { App } from 'vue';

export default {
  install(app: App) {
    app.component('SvgIcon', SvgIcon);
  },
};
