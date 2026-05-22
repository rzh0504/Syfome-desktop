import type { Store } from 'vuex';

export default (store: Store<any>) => {
  store.subscribe((mutation, state) => {
    // console.log(mutation);
    localStorage.setItem('settings', JSON.stringify(state.settings));
    localStorage.setItem('data', JSON.stringify(state.data));
  });
};
