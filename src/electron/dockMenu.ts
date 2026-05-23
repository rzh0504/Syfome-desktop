import { Menu } from 'electron';
import type { BrowserWindow } from 'electron';

export function createDockMenu(win: BrowserWindow) {
  return Menu.buildFromTemplate([
    {
      label: 'Play',
      click() {
        win.webContents.send('play');
      },
    },
    { type: 'separator' },
    {
      label: 'Next',
      click() {
        win.webContents.send('next');
      },
    },
    {
      label: 'Previous',
      click() {
        win.webContents.send('previous');
      },
    },
  ]);
}
