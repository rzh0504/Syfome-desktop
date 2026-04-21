import router from '@/router';
import { doLogout } from '@/utils/auth';
import axios from 'axios';

let baseURL = '';
// Web 和 Electron 跑在不同端口避免同时启动时冲突
if (process.env.IS_ELECTRON) {
  if (process.env.NODE_ENV === 'production') {
    baseURL = process.env.VUE_APP_ELECTRON_API_URL || '';
  } else {
    baseURL = process.env.VUE_APP_ELECTRON_API_URL_DEV || '';
  }
} else {
  baseURL = process.env.VUE_APP_ELECTRON_API_URL || '';
}

const service = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

service.interceptors.request.use(function (config) {
  if (!config.params) config.params = {};
  if (!baseURL.length) {
    console.error("You must set up the baseURL in the service's config");
  }

  return config;
});

service.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  },
  async error => {
    /** @type {import('axios').AxiosResponse | null} */
    let response;
    let data;
    if (error === 'TypeError: baseURL is undefined') {
      response = error;
      data = error;
      console.error("You must set up the baseURL in the service's config");
    } else if (error.response) {
      response = error.response;
      data = response.data;
    }

    if (response && typeof data === 'object' && data.code === 401) {
      doLogout();
      router.push({ name: 'login' });
    }
  }
);

export default service;
