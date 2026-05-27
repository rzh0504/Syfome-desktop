import initLocalStorage from './initLocalStorage';
import pkg from '../../package.json';
import updateApp from '@/utils/updateApp';
import type { TrackId } from '@/types/music';

type JsonRecord = Record<string, unknown>;
type PersistedPlayer = JsonRecord & {
  isPersonalFM: boolean;
  playlistSource: {
    id: TrackId;
    type: string;
  };
};

function readStorageObject<T extends JsonRecord = JsonRecord>(key: string): T {
  return JSON.parse(localStorage.getItem(key) || '{}') as T;
}

if (localStorage.getItem('appVersion') === null) {
  localStorage.setItem('settings', JSON.stringify(initLocalStorage.settings));
  localStorage.setItem('data', JSON.stringify(initLocalStorage.data));
  localStorage.setItem('appVersion', pkg.version);
}

updateApp();

export default {
  showLyrics: false,
  enableScrolling: true,
  title: 'YesPlayMusic',
  liked: {
    songs: [],
    songsWithDetails: [], // 只有前12首
    playlists: [],
    albums: [],
    artists: [],
    playHistory: {
      weekData: [],
      allData: [],
    },
  },
  contextMenu: {
    clickObjectID: 0,
    showMenu: false,
  },
  toast: {
    show: false,
    text: '',
    timer: null,
  },
  modals: {
    addTrackToPlaylistModal: {
      show: false,
      selectedTrackID: 0,
    },
    newPlaylistModal: {
      show: false,
      afterCreateAddTrackID: 0,
    },
  },
  dailyTracks: [],
  player: readStorageObject<PersistedPlayer>('player'),
  settings: readStorageObject('settings'),
  data: readStorageObject('data'),
};
