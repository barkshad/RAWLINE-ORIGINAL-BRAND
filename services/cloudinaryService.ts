
const CLOUD_NAME = "ds2mbrzcn";
const UPLOAD_PRESET = "real_unsigned";
const FOLDER = "rawline";

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", FOLDER);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

/**
 * Generates an optimized Cloudinary URL
 */
export const getOptimizedUrl = (url: string, width: number = 1200): string => {
  if (!url.includes("cloudinary.com")) return url;
  const baseUrl = url.split("/upload/")[0];
  const tail = url.split("/upload/")[1];
  return `${baseUrl}/upload/f_auto,q_auto,w_${width}/${tail}`;
};
