import shortcuts from '@/utils/shortcuts';
import cloneDeep from 'lodash/cloneDeep';

type AppState = Record<string, any>;
type KeyValuePayload = { key: string; value: any };

export default {
  updateLikedXXX(state: AppState, { name, data }: { name: string; data: any }) {
    state.liked[name] = data;
    if (name === 'songs') {
      state.player.sendSelfToIpcMain();
    }
  },
  changeLang(state: AppState, lang: string) {
    state.settings.lang = lang;
  },
  changeMusicQuality(state: AppState, value: string) {
    state.settings.musicQuality = value;
  },
  changeLyricFontSize(state: AppState, value: number) {
    state.settings.lyricFontSize = value;
  },
  changeOutputDevice(state: AppState, deviceId: string) {
    state.settings.outputDevice = deviceId;
  },
  updateSettings(state: AppState, { key, value }: KeyValuePayload) {
    state.settings[key] = value;
  },
  updateData(state: AppState, { key, value }: KeyValuePayload) {
    state.data[key] = value;
  },
  setActiveProvider(state: AppState, provider: string) {
    state.data.activeProvider = provider;
  },
  upsertSource(state: AppState, source: { key: string; [key: string]: any }) {
    const sources = state.data.sources || {};
    state.data.sources = {
      ...sources,
      [source.key]: {
        ...(sources[source.key] || {}),
        ...source,
      },
    };
  },
  removeSource(state: AppState, key: string) {
    const sources = { ...(state.data.sources || {}) };
    delete sources[key];
    state.data.sources = sources;
    if (state.data.activeProvider === key) {
      state.data.activeProvider = 'navidrome';
    }
  },
  togglePlaylistCategory(state: AppState, name: string) {
    const index = state.settings.enabledPlaylistCategories.findIndex(
      c => c === name
    );
    if (index !== -1) {
      state.settings.enabledPlaylistCategories =
        state.settings.enabledPlaylistCategories.filter(c => c !== name);
    } else {
      state.settings.enabledPlaylistCategories.push(name);
    }
  },
  updateToast(state: AppState, toast: any) {
    state.toast = toast;
  },
  updateModal(
    state: AppState,
    { modalName, key, value }: { modalName: string; key: string; value: any }
  ) {
    state.modals[modalName][key] = value;
    if (key === 'show') {
      // 100ms的延迟是为等待右键菜单blur之后再disableScrolling
      value === true
        ? setTimeout(() => (state.enableScrolling = false), 100)
        : (state.enableScrolling = true);
    }
  },
  toggleLyrics(state: AppState) {
    state.showLyrics = !state.showLyrics;
  },
  updateDailyTracks(state: AppState, dailyTracks: any[]) {
    state.dailyTracks = dailyTracks;
  },
  updateShortcut(
    state: AppState,
    { id, type, shortcut }: { id: string; type: string; shortcut: string }
  ) {
    let newShortcut = state.settings.shortcuts.find(s => s.id === id);
    newShortcut[type] = shortcut;
    state.settings.shortcuts = state.settings.shortcuts.map(s => {
      if (s.id !== id) return s;
      return newShortcut;
    });
  },
  restoreDefaultShortcuts(state: AppState) {
    state.settings.shortcuts = cloneDeep(shortcuts);
  },
  enableScrolling(state: AppState, status: boolean | null = null) {
    state.enableScrolling = status ? status : !state.enableScrolling;
  },
  updateTitle(state: AppState, title: string) {
    state.title = title;
  },
};
