const { contextBridge, ipcRenderer } = require('electron');

const sendChannels = new Set([
  'close',
  'maximizeOrUnmaximize',
  'minimize',
  'nativeAlert',
  'player',
  'removeProxy',
  'restoreDefaultShortcuts',
  'setProxy',
  'settings',
  'switchGlobalShortcutStatusTemporary',
  'updateShortcut',
  'updateTrayIcon',
  'updateTrayLikeState',
  'updateTrayPlayState',
  'updateTrayTooltip',
]);

const onChannels = new Set([
  'changeRouteTo',
  'decreaseVolume',
  'increaseVolume',
  'isMaximized',
  'like',
  'next',
  'nextUp',
  'play',
  'previous',
  'rememberCloseAppOption',
  'repeat',
  'routerGo',
  'search',
  'setPosition',
  'shuffle',
]);

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  send(channel, ...args) {
    if (sendChannels.has(channel)) {
      ipcRenderer.send(channel, ...args);
    }
  },
  on(channel, callback) {
    if (!onChannels.has(channel)) return undefined;
    const listener = (_event, ...args) => callback(...args);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },
});
