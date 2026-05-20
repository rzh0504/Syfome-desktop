import {
  listDirectory,
  normalizeWebdavPath,
  normalizeWebdavUrl,
  testConnection,
} from './client';

export const key = 'webdav';

export const name = 'WebDAV';

export const capabilities = {
  canBrowseFiles: true,
  canLocalIndex: true,
  canScrobble: false,
  canServerPlaylist: false,
  canStar: false,
  requiresLocalIndex: true,
};

export async function login(params = {}) {
  const result = await testConnection(params);
  return {
    code: 200,
    profile: {
      userId: params.username || result.serverUrl,
      nickname: params.username || 'WebDAV',
      avatarUrl: '/img/logos/yesplaymusic.png',
      signature: `${normalizeWebdavUrl(params.serverUrl)}${normalizeWebdavPath(
        params.path
      )}`,
      vipType: 0,
    },
  };
}

export function logout() {
  return Promise.resolve({ code: 200 });
}

export function isLoggedIn() {
  return false;
}

export function getProfile() {
  return Promise.resolve({
    userId: '',
    nickname: 'WebDAV',
    avatarUrl: '/img/logos/yesplaymusic.png',
    signature: '',
    vipType: 0,
  });
}

function notImplemented(feature) {
  return Promise.reject(new Error(`WebDAV ${feature} is not implemented yet`));
}

export function getLibrarySongs() {
  return Promise.resolve({ songs: [], hasMore: false });
}

export function browseDirectory(params) {
  return listDirectory(params);
}

export function getSongDetails() {
  return notImplemented('song details');
}

export function getLyrics() {
  return Promise.resolve({
    lrc: { lyric: '' },
    tlyric: { lyric: '' },
    romalrc: { lyric: '' },
  });
}

export function searchAll() {
  return Promise.resolve({ result: {} });
}

export function getPlaylistList() {
  return Promise.resolve([]);
}

export function getPlaylistDetail() {
  return notImplemented('playlist detail');
}

export function createPlaylist() {
  return notImplemented('playlist creation');
}

export function deletePlaylist() {
  return notImplemented('playlist deletion');
}

export function updatePlaylistTracks() {
  return notImplemented('playlist updates');
}

export function getAlbumDetail() {
  return notImplemented('album detail');
}

export function getArtistDetail() {
  return notImplemented('artist detail');
}

export function getArtistAlbums() {
  return Promise.resolve({ hotAlbums: [] });
}

export function getRandomSongs() {
  return Promise.resolve([]);
}

export function getAlbumListByType() {
  return Promise.resolve([]);
}

export function getAllArtists() {
  return Promise.resolve([]);
}

export function getStarred() {
  return Promise.resolve({ songs: [], albums: [], artists: [] });
}

export function starSong() {
  return notImplemented('favorites');
}

export function starAlbum() {
  return notImplemented('album favorites');
}

export function starArtist() {
  return notImplemented('artist favorites');
}

export function scrobbleSong() {
  return Promise.resolve({ code: 200 });
}
