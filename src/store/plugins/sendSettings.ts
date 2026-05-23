import type { Store } from 'vuex';

export function getSendSettingsPlugin() {
  return (store: Store<any>) => {
    store.subscribe((mutation, state) => {
      // console.log(mutation);
      if (mutation.type !== 'updateSettings') return;
      window.electronAPI?.send('settings', state.settings);
    });
  };
}
