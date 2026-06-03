"use server";

import { uploadImage, deleteImage } from "@/lib/cloudinary/config";

/**
 * Server Action: Uploads an image from base64 string to a specific Cloudinary folder.
 */
export async function uploadToCloudinary(base64Data: string, folder: string): Promise<string> {
  try {
    return await uploadImage(base64Data, folder);
  } catch (error: any) {
    console.error("Cloudinary server action upload error:", error);
    throw new Error(error.message || "Failed to upload image to server.");
  }
}

/**
 * Server Action: Deletes an image from Cloudinary based on its URL.
 */
export async function deleteFromCloudinary(url: string): Promise<void> {
  try {
    await deleteImage(url);
  } catch (error) {
    console.error("Cloudinary server action delete error:", error);
  }
}
