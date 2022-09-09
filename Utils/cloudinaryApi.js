import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: 'dzofnuhqh',
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
  quality: 'auto',
});
export default cloudinary;
