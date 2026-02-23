const cloudinary = require("cloudinary").v2;

const configure = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn("Cloudinary environment variables are not fully set. File uploads will fail.");
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
};

const uploadBuffer = (buffer, filename, folder = "delta-tenders") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

const destroyPublicId = async (public_id) => {
  if (!public_id) return null;
  try {
    const res = await cloudinary.uploader.destroy(public_id);
    return res;
  } catch (err) {
    console.warn("Failed to destroy Cloudinary public_id:", public_id, err.message || err);
    return null;
  }
};

module.exports = { configure, uploadBuffer, destroyPublicId };
