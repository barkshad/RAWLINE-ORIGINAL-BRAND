
export const isVideoUrl = (url?: string) => {
  if (!url) return false;
  // Cloudinary video URLs usually contain '/video/' or common video extensions
  return url.includes('/video/') || url.match(/\.(mp4|webm|ogg|mov)$/i);
};

export const getUnitLabel = (classification?: string): string => {
  switch (classification) {
    case 'Flower':
    case 'Concentrates':
      return 'g';
    case 'Pre-Rolls':
      return 'stick';
    case 'Vapes':
      return 'pc';
    case 'Edibles':
    case 'Topicals':
      return 'unit';
    default:
      return 'unit';
  }
};
