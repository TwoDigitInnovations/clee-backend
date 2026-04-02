const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// 🔹 Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 S3 Setup (Commented as it is)
// const multerS3 = require('multer-s3');
// const { S3Client } = require('@aws-sdk/client-s3');

// const s3 = new S3Client({
//   credentials: {
//     secretAccessKey: process.env.AWS_SECRET_KEY,
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//   },
//   region: process.env.BUCKET_REGION,
// });


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // folder name in cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    public_id: (req, file) => {
      return `${Date.now()}-${file.originalname.replaceAll(' ', '')}`;
    },
  },
});

module.exports = {
  upload: multer({
    storage: storage,
  }),
};
