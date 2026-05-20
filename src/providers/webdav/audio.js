const AUDIO_EXTENSIONS = new Set([
  'aac',
  'aif',
  'aiff',
  'alac',
  'ape',
  'dsf',
  'flac',
  'm4a',
  'm4b',
  'mp3',
  'oga',
  'ogg',
  'opus',
  'wav',
  'webm',
  'wma',
]);

function getExtension(name = '') {
  const cleanName = String(name).split('?')[0].split('#')[0];
  const index = cleanName.lastIndexOf('.');
  if (index < 0) return '';
  return cleanName.slice(index + 1).toLowerCase();
}

export function isAudioEntry(entry = {}) {
  if (entry.isDirectory) return false;
  const contentType = String(entry.contentType || '').toLowerCase();
  if (contentType.startsWith('audio/')) return true;
  return AUDIO_EXTENSIONS.has(getExtension(entry.name || entry.path));
}

export function withAudioMetadata(entry = {}) {
  return {
    ...entry,
    extension: getExtension(entry.name || entry.path),
    isAudio: isAudioEntry(entry),
  };
}
