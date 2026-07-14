import cloudinary from '../config/cloudinary.js';
import logger from '../utils/logger.js';

export const uploadToCloudinary = (fileBuffer, folder, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    // If mock keys are active, return a simulated URL
    if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === 'your_api_key') {
      logger.info(`[MOCK CLOUDINARY UPLOAD] Simulating file upload to folder: ${folder}`);
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fallbackUrl = resourceType === 'raw' 
        ? `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`
        : `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80`;
      return resolve({ secure_url: fallbackUrl });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `job_portal/${folder}`,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          logger.error(`Cloudinary upload failed: ${error.message}`);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};
