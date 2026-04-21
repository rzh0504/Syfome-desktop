import Vue from 'vue';
import VueRouter from 'vue-router';
import { isLooseLoggedIn, isAccountLoggedIn } from '@/utils/auth';

Vue.use(VueRouter);
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home.vue'),
    meta: {
      keepAlive: true,
      savePosition: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/loginAccount.vue'),
  },
  {
    path: '/login/account',
    name: 'loginAccount',
    component: () => import('@/views/loginAccount.vue'),
  },
  {
    path: '/playlist/:id',
    name: 'playlist',
    component: () => import('@/views/playlist.vue'),
  },
  {
    path: '/album/:id',
    name: 'album',
    component: () => import('@/views/album.vue'),
  },
  {
    path: '/artist/:id',
    name: 'artist',
    component: () => import('@/views/artist.vue'),
    meta: {
      keepAlive: true,
      savePosition: true,
    },
  },
  {
    path: '/next',
    name: 'next',
    component: () => import('@/views/next.vue'),
    meta: {
      keepAlive: true,
      savePosition: true,
    },
  },
  {
    path: '/search/:keywords?',
    name: 'search',
    component: () => import('@/views/search.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/search/:keywords/:type',
    name: 'searchType',
    component: () => import('@/views/searchType.vue'),
  },
  {
    path: '/library',
    name: 'library',
    component: () => import('@/views/library.vue'),
    meta: {
      requireLogin: true,
      keepAlive: true,
      savePosition: true,
    },
  },
  {
    path: '/library/liked-songs',
    name: 'likedSongs',
    component: () => import('@/views/playlist.vue'),
    meta: {
      requireLogin: true,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/settings.vue'),
  },
  {
    path: '/home/catalog/:kind',
    name: 'homeCatalog',
    component: () => import('@/views/homeCatalog.vue'),
    meta: {
      requireLogin: true,
      keepAlive: true,
      savePosition: true,
    },
  },
];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  routes,
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

router.beforeEach((to, from, next) => {
  // 需要登录的逻辑
  if (to.meta.requireAccountLogin) {
    if (isAccountLoggedIn()) {
      next();
    } else {
      next({ path: '/login/account' });
    }
  }
  if (to.meta.requireLogin) {
    if (isLooseLoggedIn()) {
      next();
    } else {
      if (process.env.IS_ELECTRON === true) {
        next({ path: '/login/account' });
      } else {
        next({ path: '/login' });
      }
    }
  } else {
    next();
  }
});

export default router;
