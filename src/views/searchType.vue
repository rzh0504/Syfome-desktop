<template>
  <div v-show="show" class="search">
    <h1>
      <span>{{ $t('search.searchFor') }} {{ typeNameTable[type] }}</span> "{{
        keywords
      }}"
    </h1>

    <div v-if="type === 'artists'">
      <CoverRow type="artist" :items="result" :column-number="6" />
    </div>
    <div v-if="type === 'albums'">
      <CoverRow
        type="album"
        :items="result"
        sub-text="artist"
        sub-text-font-size="14px"
      />
    </div>
    <div v-if="type === 'tracks'">
      <TrackList
        :tracks="result"
        type="playlist"
        dbclick-track-func="playAList"
      />
    </div>
    <div v-if="type === 'playlists'">
      <CoverRow type="playlist" :items="result" sub-text="title" />
    </div>

    <div class="load-more">
      <ButtonTwoTone v-show="hasMore" color="grey" @click="fetchData">{{
        $t('explore.loadMore')
      }}</ButtonTwoTone>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getTrackDetail } from '@/api/track';
import { search } from '@/api/others';
import locale from '@/locale';
import { camelCase } from 'change-case';
import NProgress from 'nprogress';
import type { TrackId } from '@/types/music';

import TrackList from '@/components/TrackList.vue';
import CoverRow from '@/components/CoverRow.vue';
import ButtonTwoTone from '@/components/ButtonTwoTone.vue';

type SearchType = 'tracks' | 'albums' | 'artists' | 'playlists';
type SearchItem = {
  id: TrackId;
  name: string;
  [key: string]: unknown;
};
type SearchResult = {
  hasMore?: boolean;
  songs?: SearchItem[];
  artists?: SearchItem[];
  albums?: SearchItem[];
  playlists?: SearchItem[];
  albumCount?: number;
};

export default defineComponent({
  name: 'Search',
  components: {
    TrackList,
    CoverRow,
    ButtonTwoTone,
  },
  data() {
    return { show: false, result: [] as SearchItem[], hasMore: true };
  },
  computed: {
    keywords(): string {
      const keywords = this.$route.params.keywords;
      return Array.isArray(keywords) ? keywords[0] : keywords;
    },
    type(): SearchType {
      const routeType = this.$route.params.type;
      const type = Array.isArray(routeType) ? routeType[0] : routeType;
      return camelCase(type) as SearchType;
    },
    typeNameTable(): Record<SearchType, string> {
      return {
        tracks: locale.global.t('search.song'),
        albums: locale.global.t('search.album'),
        artists: locale.global.t('search.artist'),
        playlists: locale.global.t('search.playlist'),
      };
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      const typeTable: Record<SearchType, number> = {
        tracks: 1,
        albums: 10,
        artists: 100,
        playlists: 1000,
      };
      return search({
        keywords: this.keywords,
        type: typeTable[this.type],
        offset: this.result.length,
      }).then(result => {
        const data = result.result as SearchResult;
        this.hasMore = data.hasMore ?? true;
        switch (this.type) {
          case 'artists':
            this.result.push(...(data.artists || []));
            break;
          case 'albums':
            this.result.push(...(data.albums || []));
            if ((data.albumCount || 0) <= this.result.length) {
              this.hasMore = false;
            }
            break;
          case 'tracks':
            this.result.push(...(data.songs || []));
            this.getTracksDetail();
            break;
          case 'playlists':
            this.result.push(...(data.playlists || []));
            break;
        }
        NProgress.done();
        this.show = true;
      });
    },
    getTracksDetail(): void {
      const trackIDs = this.result.map(t => t.id);
      if (trackIDs.length === 0) return;
      getTrackDetail(trackIDs.join(',')).then(result => {
        this.result = result.songs;
      });
    },
  },
});
</script>

<style lang="scss" scoped>
h1 {
  margin-top: 32px;
  margin-bottom: 28px;
  color: var(--color-text);
  span {
    opacity: 0.58;
  }
}
.load-more {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.button.more {
  .svg-icon {
    height: 24px;
    width: 24px;
  }
}
</style>
