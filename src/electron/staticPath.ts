import path from 'path';

const isDev = Boolean(process.env.ELECTRON_RENDERER_URL);

const staticRoot = isDev
  ? path.join(__dirname, '../../public')
  : path.join(__dirname, '../renderer');

export function getStaticPath(...segments: string[]): string {
  return path.join(staticRoot, ...segments);
}
