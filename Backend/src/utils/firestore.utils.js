import { Storage } from '@google-cloud/storage';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configure your Google Cloud Storage bucket
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_KEYFILE // path to your service account key
});
const bucketName = process.env.GCLOUD_STORAGE_BUCKET;
const bucket = storage.bucket(bucketName);

/**
 * Uploads a file to Google Cloud Storage and returns the public URL.
 * @param {object} file - Multer file object
 * @returns {Promise<string>} - Public URL of the uploaded image
 */
export async function uploadImageToFirestore(file) {
  if (!file) throw new Error('No file provided');
  const ext = path.extname(file.originalname);
  const gcsFileName = `${uuidv4()}${ext}`;
  const blob = bucket.file(gcsFileName);

  // Create a stream to upload the file
  const stream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
    public: true
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (err) => reject(err));
    stream.on('finish', async () => {
      // Make the file public
      await blob.makePublic();
      // Return the public URL
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;
      resolve(publicUrl);
    });
    stream.end(file.buffer);
  });
} 