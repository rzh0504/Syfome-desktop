# Navidrome and WebDAV Player Roadmap

This project is a fork of YesPlayMusic that is being reshaped into a desktop player for private music libraries. The current codebase already has a working Navidrome/OpenSubsonic adaptation, but it is not yet a mature multi-source player. WebDAV support is not implemented as a first-class music source yet.

## Current State

| Area | Status | Notes |
| --- | --- | --- |
| Navidrome login | Partial | `src/providers/navidrome/client.js` stores an OpenSubsonic token session locally and validates it with `ping.view`. |
| Navidrome playback | Partial | Tracks are mapped to YesPlayMusic-compatible objects and streamed through `stream.view`. |
| Navidrome library | Partial | Library songs, playlists, albums, artists, starred items, lyrics, and scrobbling have basic adapters. |
| WebDAV | Missing | No provider, login, directory browsing, scanning, metadata indexing, or playback integration exists yet. |
| Multi-source architecture | Missing | API modules import `navidromeProvider` directly, so the app is still effectively single-source. |
| Offline cache | Partial | Electron can cache complete track audio in IndexedDB, but cache keys are not source-aware yet. |
| Security | Weak | Sessions are stored in renderer `localStorage`; Electron still uses broad renderer privileges. |
| Testing | Weak | Provider, mapper, cache, scanner, and playback paths need automated coverage. |

## Product Goals

1. Provide a reliable Navidrome/OpenSubsonic desktop player.
2. Add WebDAV as a first-class music source, not as a legacy cloud-disk feature.
3. Support multiple sources without ID collisions or source-specific UI branching.
4. Build a local music index for WebDAV with metadata, covers, search, and incremental scans.
5. Make playback, cache, favorites, playlists, and history source-aware.
6. Improve credential handling and Electron security before storing WebDAV passwords.

## Target Architecture

```text
UI Views / Components
        |
Compatibility API Layer
        |
Provider Registry
        |
+-------------------+-------------------+
| NavidromeProvider | WebDAVProvider    |
+-------------------+-------------------+
        |                   |
OpenSubsonic API      WebDAV Client
        |                   |
        |             Metadata Scanner
        |                   |
        +--------- IndexedDB --------+
                  |
              Player Service
                  |
        Stream Resolver / Local Proxy
                  |
             Howler / HTMLAudio
```

## Standard Track Identity

Every track should have a stable source-aware identity while retaining the old YesPlayMusic-compatible fields required by existing UI components.

```js
{
  id: 'legacy-compatible-id',
  uid: 'navidrome:song:abc123',
  source: 'navidrome',
  sourceId: 'abc123',
  sourceType: 'navidrome'
}
```

For WebDAV, the source ID should be based on the source connection plus normalized path, not only the filename.

```js
{
  uid: 'webdav:file:<stable-hash>',
  source: 'webdav',
  sourceId: '/Music/Artist/Album/01.flac',
  path: '/Music/Artist/Album/01.flac'
}
```

## Phase 1: Stabilize Navidrome

1. Add `uid`, `source`, `sourceId`, and `sourceType` to mapped Navidrome tracks, albums, artists, and playlists.
2. Make audio cache keys source-aware while keeping fallback reads for previously cached tracks.
3. Make music quality settings affect Navidrome `stream.view` requests through `maxBitRate` or a provider option.
4. Add clearer errors for authentication failures, unsupported APIs, unreachable servers, and unplayable songs.
5. Add local play history so the library page is not empty when Navidrome does not expose the desired history shape.
6. Clean up obvious YesPlayMusic/Netease wording that conflicts with the new product direction.
7. Add unit tests for Navidrome URL building, response unwrapping, and mappers.

## Phase 2: Introduce Provider Registry

1. Add a provider registry with an active source selector.
2. Move API modules from direct `navidromeProvider` imports to `getActiveProvider()`.
3. Store configured sources and `activeSourceId` in app state/local storage.
4. Define source capabilities such as `canStar`, `canScrobble`, `canServerPlaylist`, `canBrowseFiles`, and `requiresLocalIndex`.
5. Update playback, favorites, cache, and queue code to use `track.uid` where possible.

## Phase 3: WebDAV MVP

1. Add WebDAV source creation and connection testing.
2. Implement directory browsing with `PROPFIND Depth: 1`.
3. Let users choose one or more music roots.
4. Scan audio files into a local IndexedDB index.
5. Parse basic metadata with `music-metadata` through Electron-safe code paths.
6. Display WebDAV songs in the library.
7. Resolve WebDAV tracks to playable URLs through a local proxy or authenticated request layer.
8. Support basic search over the local WebDAV index.
9. Show scan progress, skipped files, and recoverable errors.

## Phase 4: Mature WebDAV Library

1. Add incremental scanning with ETag, Last-Modified, and Content-Length checks.
2. Support embedded covers and sibling cover files such as `cover.jpg` and `folder.jpg`.
3. Support `.lrc` lyrics next to audio files.
4. Add album, artist, genre, year, and folder browsing.
5. Add local favorites, playlists, and play history for WebDAV.
6. Add source-aware offline downloads by song, album, playlist, and folder.
7. Improve large library performance with normalized search fields and paged queries.

## Phase 5: Player and Desktop Maturity

1. Add explicit player states: `idle`, `loading`, `playing`, `paused`, `buffering`, and `error`.
2. Improve playback error recovery and user-facing error messages.
3. Support more formats and MIME-aware playback decisions.
4. Ensure WebDAV streaming supports Range requests for seeking.
5. Improve MediaSession, MPRIS, tray, and global shortcut metadata.
6. Consider ReplayGain, volume normalization, and optional crossfade after the core library is stable.

## Security Work

1. Move credentials out of renderer `localStorage` before storing WebDAV passwords.
2. Use Electron main-process storage with OS-backed encryption where practical.
3. Avoid exposing authenticated stream URLs in DOM titles, tooltips, logs, or persisted track objects.
4. Gradually reduce renderer privileges by moving toward `contextIsolation: true` and removing unnecessary Node access.
5. Keep local proxy endpoints bound to `127.0.0.1` and validate requested track IDs against the local source registry.

## First Implementation Slice

The safest initial code changes are:

1. Add source-aware identity fields to Navidrome mapper output.
2. Make cached audio source keys source-aware with backward-compatible cache reads.
3. Add a provider registry skeleton while keeping Navidrome as the only active provider.
4. Add WebDAV provider skeletons only after the registry is in place.
5. Add small tests around the changed mapper/cache behavior before expanding the architecture further.
