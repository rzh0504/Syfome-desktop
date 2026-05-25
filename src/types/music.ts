export type TrackId = string | number;

export type ArtistSummary = {
  id?: TrackId;
  name?: string;
};

export type AlbumSummary = {
  id?: TrackId;
  name?: string;
  picUrl?: string;
};

export type Track = {
  id: TrackId;
  uid?: TrackId;
  source?: string;
  sourceId?: TrackId;
  sourceType?: string;
  name?: string;
  dt?: number;
  streamUrl?: string;
  ar?: ArtistSummary[];
  artists?: ArtistSummary[];
  al?: AlbumSummary;
  album?: AlbumSummary;
  [key: string]: unknown;
};

export type TrackListTrack = Partial<Track> & {
  songId?: TrackId;
  songName?: string;
  simpleSong?: TrackListTrack;
  privilege?: { pl?: number };
  playable?: boolean;
  reason?: string;
  playCount?: number;
  tns?: string[];
  alia?: string[];
  mark?: number;
  al?: AlbumSummary & { name?: string };
  ar?: ArtistSummary[];
  [key: string]: any;
};

export type PlayerTrack = TrackListTrack;

export type PlayerState = {
  currentTrack: PlayerTrack;
  currentTrackDuration: number;
  volume: number;
  progress: number;
  playing: boolean;
  isCurrentTrackLiked?: boolean;
  isPersonalFM?: boolean;
  repeatMode?: string;
  shuffle?: boolean;
  _howler?: { _src?: string };
  seek: (position?: number | null, shouldPlay?: boolean) => number | undefined;
  playPrevTrack: () => void;
  playOrPause: () => void;
  playNextFMTrack: () => void;
  playNextTrack: () => void;
  play: () => void;
  moveToFMTrash: () => void;
  switchRepeatMode: () => void;
  switchShuffle: () => void;
  mute: () => void;
};

export type PlaylistTrackRef = {
  id: TrackId;
};

export type PlaylistDetail = {
  id?: TrackId;
  name?: string;
  coverImgUrl?: string;
  tracks: Track[];
  trackIds: PlaylistTrackRef[];
  [key: string]: unknown;
};
