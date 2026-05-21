export function resizeImageUrl(imgUrl, size = 512) {
  if (!imgUrl) return '';
  if (/^(data|blob|file):/i.test(imgUrl)) return imgUrl;
  if (imgUrl.startsWith('http://127.0.0.1:')) return imgUrl;
  if (!/^https?:\/\//i.test(imgUrl)) return imgUrl;

  if (imgUrl.includes('/rest/getCoverArt.view')) {
    const separator = imgUrl.includes('?') ? '&' : '?';
    return `${imgUrl}${separator}size=${size}`;
  }

  const httpsImgUrl = imgUrl.replace(/^http:\/\//i, 'https://');
  const separator = httpsImgUrl.includes('?') ? '&' : '?';
  return `${httpsImgUrl}${separator}param=${size}y${size}`;
}
