/// <reference types="vite/client" />

import type { DefineComponent } from 'vue';
import type { filters } from '@/utils/filters';

declare module '*.vue' {
  const component: DefineComponent<
    Record<string, never>,
    Record<string, never>,
    unknown
  >;
  export default component;
}

declare global {
  interface Window {
    electronAPI?: {
      platform: string;
      send: (channel: string, ...args: unknown[]) => void;
      on: (
        channel: string,
        callback: (...args: unknown[]) => void
      ) => (() => void) | undefined;
    };
    require?: NodeJS.Require;
    resetApp?: () => string;
    yesplaymusic?: Record<string, unknown>;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: typeof filters;
    $copyText: (text: string) => Promise<string>;
  }
}
