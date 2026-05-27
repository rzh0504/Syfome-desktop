<template>
  <div class="newAlbum">
    <h1>{{ $t('home.newAlbum') }}</h1>
    <div class="playlist-row">
      <div class="playlists">
        <CoverRow
          type="album"
          :items="albums"
          sub-text="artist"
          :show-play-button="true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { newAlbums } from '@/api/album';
import NProgress from 'nprogress';
import type { TrackId } from '@/types/music';

import CoverRow from '@/components/CoverRow.vue';

type AlbumItem = {
  id: TrackId;
  name: string;
  [key: string]: unknown;
};

export default defineComponent({
  components: {
    CoverRow,
  },
  data() {
    return {
      albums: [] as AlbumItem[],
    };
  },
  created() {
    newAlbums({
      area: 'EA',
      limit: 100,
    }).then(data => {
      this.albums = data.albums;
      NProgress.done();
    });
  },
});
</script>

<style lang="scss" scoped>
h1 {
  color: var(--color-text);
  font-size: 56px;
}
</style>
