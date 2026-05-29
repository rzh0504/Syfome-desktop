<template>
  <div v-show="show" class="today-recommend-page">
    <div class="page-head">
      <h1>今日推荐</h1>
      <div class="button-group">
        <button
          class="action-btn"
          :disabled="todayRecommendTracks.length === 0"
          @click="playTodayRecommend()"
        >
          <svg-icon icon-class="play" />
          播放全部
        </button>
        <button
          class="action-btn secondary"
          :disabled="todayRecommendTracks.length === 0"
          @click="shuffleTodayRecommend"
        >
          <svg-icon icon-class="shuffle" />
          随机播放
        </button>
      </div>
    </div>

    <TrackList
      v-if="todayRecommendTracks.length > 0"
      :tracks="todayRecommendTracks"
      type="playlist"
      dbclick-track-func="todayRecommend"
    />
    <div v-else class="empty-state">暂无推荐歌曲</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NProgress from 'nprogress';
import shuffle from 'lodash/shuffle';
import { homeRecommendTracks } from '@/api/others';
import TrackList from '@/components/TrackList.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import type { Track, TrackId } from '@/types/music';

type PlayerLike = {
  replacePlaylist: (
    trackIDs: TrackId[],
    source: string,
    sourceType: string,
    currentTrackID: TrackId | undefined
  ) => void;
};

export default defineComponent({
  name: 'TodayRecommend',
  components: {
    TrackList,
    SvgIcon,
  },
  inject: {
    scrollMainTo: {
      default: () => {},
    },
  },
  data() {
    return {
      show: false,
      todayRecommendTracks: [] as Track[],
    };
  },
  created() {
    setTimeout(() => {
      if (!this.show) NProgress.start();
    }, 1000);
    this.loadTodayRecommendTracks();
    (this.scrollMainTo as (x: number, y: number) => void)(0, 0);
  },
  methods: {
    loadTodayRecommendTracks(): void {
      homeRecommendTracks(24)
        .then(({ songs }) => {
          this.todayRecommendTracks = songs || [];
        })
        .finally(() => {
          NProgress.done();
          this.show = true;
        });
    },
    playTodayRecommend(trackId?: TrackId): void {
      if (this.todayRecommendTracks.length === 0) return;
      const trackIDs = this.todayRecommendTracks.map(track => track.id);
      const player = this.$store.state.player as PlayerLike;
      player.replacePlaylist(
        trackIDs,
        '/home/today-recommend',
        'url',
        trackId || trackIDs[0]
      );
    },
    shuffleTodayRecommend(): void {
      if (this.todayRecommendTracks.length === 0) return;
      const trackIDs = shuffle(this.todayRecommendTracks.map(track => track.id));
      const player = this.$store.state.player as PlayerLike;
      player.replacePlaylist(
        trackIDs,
        '/home/today-recommend',
        'url',
        trackIDs[0]
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.today-recommend-page {
  padding-bottom: 64px;
}

.page-head {
  margin-top: 36px;
  margin-bottom: 28px;
  color: var(--color-text);

  h1 {
    margin: 0 0 18px;
    font-size: 34px;
    line-height: 1.15;
    font-weight: 800;
  }
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 999px;
  background: var(--color-primary-bg);
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 700;
  transition: 0.2s;

  &.secondary {
    background: var(--color-secondary-bg);
    color: var(--color-text);
  }

  .svg-icon {
    width: 14px;
    height: 14px;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.empty-state {
  padding: 48px 0;
  border-radius: 14px;
  background: var(--color-secondary-bg);
  text-align: center;
  color: var(--color-text);
  opacity: 0.68;
}

@media (max-width: 768px) {
  .page-head {
    margin-top: 28px;
  }

  .page-head h1 {
    font-size: 28px;
  }
}
</style>
