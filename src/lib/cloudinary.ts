import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a base64/data-URI image (sent from the admin product form) to
 * Cloudinary under the indian-elixir/products folder.
 */
export async function uploadProductImage(dataUri: string) {
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "indian-elixir/products",
    resource_type: "image",
    transformation: [{ width: 1200, height: 1200, crop: "limit", quality: "auto" }],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteProductImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
