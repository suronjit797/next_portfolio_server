import multer from "multer";

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import config from "../../config";

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: config.CLOUD_FOLDER_NAME,
    // allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [
      { width: 1024 },
      { quality: "auto:eco" }, // Use 'eco' mode for aggressive size reduction
      { fetch_format: "webp" }, // Automatically choose the best format (e.g., WebP if supported)
    ],
  } as Record<string, any>,
});

export const uploadCloudinary = multer({ storage });
