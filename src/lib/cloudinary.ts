'use server';

import { v2 as cloudinary } from 'cloudinary';

export async function uploadToCloudinary(
  formData: FormData,
  resource_type: 'image' | 'raw' | 'video' | 'auto',
  cloudName: string,
  apiKey: string,
  apiSecret: string
) {
  
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
            reject(error);
            return;
          }
          resolve(result);
        }
      )
      .end(buffer);
  });

  return results as { secure_url: string };
}
