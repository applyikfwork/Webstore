'use server';

import { v2 as cloudinary } from 'cloudinary';

export async function uploadToCloudinary(
  formData: FormData,
  resource_type: 'image' | 'raw' | 'video' | 'auto'
) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials are not configured. Please check your .env file.');
  }
  
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file provided');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const results = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          tags: ['app-showcase'],
          resource_type
        },
        function (error, result) {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Failed to upload file to Cloudinary.'));
            return;
          }
          resolve(result);
        }
      )
      .end(buffer);
  });

  return results as { secure_url: string };
}
