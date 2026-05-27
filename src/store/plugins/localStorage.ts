import type { Store } from 'vuex';

type PersistedState = {
  settings: unknown;
  data: unknown;
};

export default (store: Store<PersistedState>) => {
  store.subscribe((mutation, state) => {
    // console.log(mutation);
    localStorage.setItem('settings', JSON.stringify(state.settings));
    localStorage.setItem('data', JSON.stringify(state.data));
  });
};
