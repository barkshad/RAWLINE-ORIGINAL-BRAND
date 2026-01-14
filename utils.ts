
export const isVideoUrl = (url?: string) => {
  if (!url) return false;
  // Cloudinary video URLs usually contain '/video/' or common video extensions
  return url.includes('/video/') || url.match(/\.(mp4|webm|ogg|mov)$/i);
};
