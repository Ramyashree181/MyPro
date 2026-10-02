const cloudinary = require('cloudinary').v2;

//joining our backend with our cloudinary account
cloudinary.config({
    //by default cant change name -> cloud_name , api_key , api_secret
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

const storage = {
  _handleFile(req, file, callback) {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'wonderlust_DEV',
        allowed_formats: ['png', 'jpg', 'jpeg'],
      },
      (error, result) => {
        if (error) return callback(error);
        callback(null, { path: result.secure_url, filename: result.public_id });
      }
    );
    file.stream.pipe(uploadStream);
  },

  _removeFile(req, file, callback) {
    cloudinary.uploader.destroy(file.filename, { invalidate: true })
      .then(() => callback(null), callback);
  },
};

module.exports={
    cloudinary,
    storage,
};