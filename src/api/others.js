import { navidromeProvider } from '@/providers';

/**
 * 搜索
 * 说明 : 调用此接口 , 传入搜索关键词可以搜索该音乐 / 专辑 / 歌手 / 歌单 / 用户 , 关键词可以多个 , 以空格隔开 ,
 * 如 " 周杰伦 搁浅 "( 不需要登录 ), 搜索获取的 mp3url 不能直接用 , 可通过 /song/url 接口传入歌曲 id 获取具体的播放链接
 * - keywords : 关键词
 * - limit : 返回数量 , 默认为 30
 * - offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * - type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
 * - 调用例子 : /search?keywords=海阔天空 /cloudsearch?keywords=海阔天空(更全)
 * @param {Object} params
 * @param {string} params.keywords
 * @param {number=} params.limit
 * @param {number=} params.offset
 * @param {number=} params.type
 */
export function search(params) {
  return navidromeProvider.searchAll(params);
}

export function personalFM() {
  return Promise.resolve({ data: [] });
}

export function fmTrash() {
  return Promise.resolve({ code: 200 });
}

/**
 * 首页：今日推荐（随机歌曲）
 * @param {number=} limit
 */
export function homeRecommendTracks(limit = 24) {
  return navidromeProvider
    .getRandomSongs(limit)
    .then(songs => ({ songs }))
    .catch(() => ({ songs: [] }));
}

/**
 * 首页：按类型获取专辑
 * @param {Object} params
 * @param {'newest'|'recent'|'random'|'frequent'} params.type
 * @param {number=} params.limit
 * @param {number=} params.offset
 */
export function homeAlbumsByType(params = {}) {
  const { type = 'random', limit = 24, offset = 0 } = params;
  return navidromeProvider
    .getAlbumListByType({ type, size: limit, offset })
    .then(albums => ({
      albums,
      hasMore: albums.length >= limit,
    }))
    .catch(() => ({ albums: [], hasMore: false }));
}

/**
 * 首页：全部艺人（前端自行随机/分页）
 */
export function homeAllArtists() {
  return navidromeProvider
    .getAllArtists()
    .then(artists => ({ artists }))
    .catch(() => ({ artists: [] }));
}
