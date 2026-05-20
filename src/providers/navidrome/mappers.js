import { buildCoverArtUrl, buildStreamUrl } from './client';

const SOURCE = 'navidrome';

function sourceUid(type, id) {
  return id ? `${SOURCE}:${type}:${id}` : '';
}

export function mapArtist(raw = {}) {
  return {
    id: raw.id,
    uid: sourceUid('artist', raw.id),
    source: SOURCE,
    sourceId: raw.id,
    sourceType: SOURCE,
    name: raw.name || 'Unknown Artist',
    img1v1Url: buildCoverArtUrl(raw.coverArt, 1024),
    briefDesc: '',
    musicSize: raw.songCount || 0,
    albumSize: raw.albumCount || (raw.album?.length ?? 0),
    mvSize: 0,
    followed: Boolean(raw.starred),
  };
}

export function mapAlbum(raw = {}) {
  const artistId = raw.artistId || raw.artist?.id || '';
  const artistName =
    raw.artist || raw.artistName || raw.artist?.name || 'Unknown Artist';
  const year = Number(raw.year) || new Date().getFullYear();

  return {
    id: raw.id,
    uid: sourceUid('album', raw.id),
    source: SOURCE,
    sourceId: raw.id,
    sourceType: SOURCE,
    name: raw.name || raw.title || 'Unknown Album',
    picUrl: buildCoverArtUrl(raw.coverArt, 1024),
    artist: {
      id: artistId,
      name: artistName,
    },
    artists: [
      {
        id: artistId,
        name: artistName,
      },
    ],
    publishTime: new Date(`${year}-01-01T00:00:00.000Z`).getTime(),
    size: raw.songCount || raw.song?.length || 0,
    type: '专辑',
    company: '',
    description: raw.comment || '',
    mark: 0,
  };
}

export function mapSong(raw = {}) {
  const artists =
    raw.artists?.length > 0
      ? raw.artists.map(artist => ({
          id: artist.id,
          name: artist.name,
        }))
      : [
          {
            id: raw.artistId || '',
            name: raw.artist || 'Unknown Artist',
          },
        ];

  const album = {
    id: raw.albumId || '',
    name: raw.album || 'Unknown Album',
    picUrl: buildCoverArtUrl(raw.coverArt, 512),
  };

  const durationInMs = Math.max(1, Number(raw.duration || 0) * 1000);

  return {
    id: raw.id,
    uid: sourceUid('song', raw.id),
    source: SOURCE,
    sourceId: raw.id,
    sourceType: SOURCE,
    name: raw.title || raw.name || 'Unknown Track',
    dt: durationInMs,
    no: raw.track || 0,
    cd: raw.discNumber || 1,
    ar: artists,
    artists,
    al: album,
    album,
    alia: [],
    tns: [],
    fee: 0,
    mark: 0,
    streamUrl: buildStreamUrl(raw.id),
    playable: true,
    reason: '',
    privilege: {
      id: raw.id,
      pl: 320000,
      fee: 0,
      st: 0,
      cs: false,
    },
  };
}

export function mapPlaylist(raw = {}) {
  const entries = (raw.entry || []).map(mapSong);
  const owner = raw.owner || raw.username || 'Navidrome';

  return {
    id: raw.id,
    uid: sourceUid('playlist', raw.id),
    source: SOURCE,
    sourceId: raw.id,
    sourceType: SOURCE,
    name: raw.name || 'Untitled Playlist',
    coverImgUrl:
      entries[0]?.al?.picUrl ||
      buildCoverArtUrl(raw.coverArt, 1024) ||
      '/img/logos/yesplaymusic.png',
    creator: {
      userId: owner,
      nickname: owner,
    },
    updateTime: new Date(raw.changed || raw.created || Date.now()).getTime(),
    trackCount: Number(raw.songCount || entries.length || 0),
    tracks: entries,
    trackIds: entries.map(song => ({ id: song.id })),
    description: raw.comment || '',
    privacy: raw.public === false ? 10 : 0,
    subscribed: true,
  };
}

export function mapLyrics(raw = {}) {
  const lines = raw.value || raw.lyrics || raw.syncedLyrics || '';
  return {
    lrc: {
      lyric: lines || '',
    },
    tlyric: {
      lyric: '',
    },
    romalrc: {
      lyric: '',
    },
  };
}
