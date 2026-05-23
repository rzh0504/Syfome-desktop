<template>
  <Modal
    class="add-track-to-playlist-modal"
    :show="show"
    :close="close"
    :show-footer="false"
    title="添加到歌单"
    width="25vw"
  >
    <template #default>
      <div class="new-playlist-button" @click="newPlaylist"
        ><svg-icon icon-class="plus" />新建歌单</div
      >
      <div
        v-for="playlist in ownPlaylists"
        :key="playlist.id"
        class="playlist"
        @click="addTrackToPlaylist(playlist.id)"
      >
        <img :src="resizeImage(playlist.coverImgUrl, 224)" loading="lazy" />
        <div class="info">
          <div class="title">{{ playlist.name }}</div>
          <div class="track-count">{{ playlist.trackCount }} 首</div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Modal from '@/components/Modal.vue';
import locale from '@/locale';
import { addOrRemoveTrackFromPlaylist } from '@/api/playlist';
import { resizeImage } from '@/utils/filters';
import type { TrackId } from '@/types/music';

type Playlist = {
  id: TrackId;
  name: string;
  coverImgUrl: string;
  trackCount: number;
  creator: { userId: TrackId };
};

type AddTrackModalState = {
  show: boolean;
  selectedTrackID: TrackId;
};

type ModalsState = {
  addTrackToPlaylistModal: AddTrackModalState;
};

type DataState = {
  user?: { userId?: TrackId };
  likedSongPlaylistID?: TrackId;
};

type LikedState = {
  playlists: Playlist[];
};

export default defineComponent({
  name: 'ModalAddTrackToPlaylist',
  components: {
    Modal,
  },
  data() {
    return {
      playlists: [] as Playlist[],
    };
  },
  computed: {
    modals(): ModalsState {
      return this.$store.state.modals as ModalsState;
    },
    data(): DataState {
      return this.$store.state.data as DataState;
    },
    liked(): LikedState {
      return this.$store.state.liked as LikedState;
    },
    show: {
      get(): boolean {
        return this.modals.addTrackToPlaylistModal.show;
      },
      set(value: boolean) {
        this.updateModal({
          modalName: 'addTrackToPlaylistModal',
          key: 'show',
          value,
        });
        if (value) {
          this.$store.commit('enableScrolling', false);
        } else {
          this.$store.commit('enableScrolling', true);
        }
      },
    },
    ownPlaylists(): Playlist[] {
      return this.liked.playlists.filter(
        p =>
          p.creator.userId === this.data.user.userId &&
          p.id !== this.data.likedSongPlaylistID
      );
    },
  },
  methods: {
    resizeImage,
    updateModal(payload: { modalName: string; key: string; value: unknown }) {
      this.$store.commit('updateModal', payload);
    },
    showToast(text: string) {
      return this.$store.dispatch('showToast', text);
    },
    close() {
      this.show = false;
    },
    addTrackToPlaylist(playlistID: TrackId) {
      addOrRemoveTrackFromPlaylist({
        op: 'add',
        pid: playlistID,
        tracks: this.modals.addTrackToPlaylistModal.selectedTrackID,
      }).then(data => {
        if (data.body.code === 200) {
          this.show = false;
          this.showToast(locale.global.t('toast.savedToPlaylist'));
        } else {
          this.showToast(data.body.message);
        }
      });
    },
    newPlaylist() {
      this.updateModal({
        modalName: 'newPlaylistModal',
        key: 'afterCreateAddTrackID',
        value: this.modals.addTrackToPlaylistModal.selectedTrackID,
      });
      this.close();
      this.updateModal({
        modalName: 'newPlaylistModal',
        key: 'show',
        value: true,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.new-playlist-button {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
  background: var(--color-secondary-bg-for-transparent);
  border-radius: 8px;
  height: 48px;
  margin-bottom: 16px;
  margin-right: 6px;
  margin-left: 6px;
  cursor: pointer;
  transition: 0.2s;
  .svg-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
  &:hover {
    color: var(--color-primary);
    background: var(--color-primary-bg-for-transparent);
  }
}
.playlist {
  display: flex;
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: var(--color-secondary-bg-for-transparent);
  }
  img {
    border-radius: 8px;
    height: 42px;
    width: 42px;
    margin-right: 12px;
    border: 1px solid rgba(0, 0, 0, 0.04);
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .title {
    font-size: 16px;
    font-weight: 500;
    color: var(--color-text);
    padding-right: 16px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }
  .track-count {
    margin-top: 2px;
    font-size: 13px;
    opacity: 0.68;
    color: var(--color-text);
  }
}
</style>
