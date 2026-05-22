import { contextBridge, ipcRenderer } from 'electron';

type SendChannel =
  | 'close'
  | 'maximizeOrUnmaximize'
  | 'minimize'
  | 'nativeAlert'
  | 'player'
  | 'removeProxy'
  | 'restoreDefaultShortcuts'
  | 'setProxy'
  | 'settings'
  | 'switchGlobalShortcutStatusTemporary'
  | 'updateShortcut'
  | 'updateTrayIcon'
  | 'updateTrayLikeState'
  | 'updateTrayPlayState'
  | 'updateTrayTooltip';

type OnChannel =
  | 'changeRouteTo'
  | 'decreaseVolume'
  | 'increaseVolume'
  | 'isMaximized'
  | 'like'
  | 'next'
  | 'nextUp'
  | 'play'
  | 'previous'
  | 'rememberCloseAppOption'
  | 'repeat'
  | 'routerGo'
  | 'search'
  | 'setPosition'
  | 'shuffle';

const sendChannels = new Set<SendChannel>([
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

const onChannels = new Set<OnChannel>([
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
  send(channel: string, ...args: unknown[]) {
    if (sendChannels.has(channel as SendChannel)) {
      ipcRenderer.send(channel, ...args);
    }
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    if (!onChannels.has(channel as OnChannel)) return undefined;
    const listener = (_event, ...args) => callback(...args);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },
});
