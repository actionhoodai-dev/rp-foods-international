import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "djwogp0es",
  api_key: process.env.CLOUDINARY_API_KEY || "463128111381314",
  api_secret: process.env.CLOUDINARY_API_SECRET || "etiz6-qg_CIw0fmKPOiJBCa5X5o",
  secure: true
});

/**
 * Uploads an image (base64 string or file buffer) to Cloudinary.
 * Automatically converts and optimizes the image to WebP format.
 * 
 * @param fileUri - Base64 data URI or public url of the image
 * @param folder - Folder path (e.g., 'rp-foods/products')
 */
export async function uploadImage(fileUri: string, folder: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(fileUri, {
      folder,
      transformation: [
        { quality: "auto:good", fetch_format: "webp" }
      ]
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
}

/**
 * Deletes an image from Cloudinary based on its URL.
 * Extracts the public ID containing folder paths and triggers deletion.
 * 
 * @param url - Full secure URL of the image
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    // Cloudinary URLs look like:
    // https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/products/sambar-powder.webp
    const parts = url.split("/");
    const filenameWithExt = parts.pop() || "";
    const filename = filenameWithExt.split(".")[0];
    
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) {
      console.warn("Invalid Cloudinary URL, skipping deletion:", url);
      return;
    }
    
    // Skip "upload" and the version folder (e.g. v1717436000)
    // and grab the folders path.
    const folderParts = parts.slice(uploadIndex + 2);
    const publicId = [...folderParts, filename].join("/");
    
    console.log("Deleting Cloudinary publicId:", publicId);
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
  }
}

export { cloudinary };
