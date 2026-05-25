import shortcuts from '@/utils/shortcuts';

console.debug('[debug][initLocalStorage.js]');

const initialLocalStorage = {
  player: {},
  settings: {
    lang: null,
    appearance: 'auto',
    musicQuality: '320000',
    lyricFontSize: 28,
    outputDevice: 'default',
    automaticallyCacheSongs: true,
    cacheLimit: 8192,
    nyancatStyle: false,
    showLyricsTranslation: true,
    lyricsBackground: true,
    closeAppOption: 'ask',
    enableGlobalShortcut: true,
    showLibraryDefault: false,
    linuxEnableCustomTitlebar: false,
    trayIconTheme: 'auto',
    proxyConfig: {
      protocol: 'noProxy',
      server: '',
      port: null,
    },
    shortcuts: shortcuts,
  },
  data: {
    user: {},
    likedSongPlaylistID: 0,
    lastRefreshCookieDate: 0,
    loginMode: null,
    activeProvider: 'navidrome',
    localPlayHistory: [],
    sources: {
      navidrome: {
        key: 'navidrome',
        name: 'Navidrome',
        provider: 'navidrome',
        enabled: true,
      },
    },
  },
};

if (Boolean(process.env.IS_ELECTRON)) {
  initialLocalStorage.settings.automaticallyCacheSongs = true;
}

export default initialLocalStorage;
