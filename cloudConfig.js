const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//joining our backend with our cloudinary account
cloudinary.config({
    //by default cant change name -> cloud_name , api_key , api_secret
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

//konse folder me we want to store our info on cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wonderlust_DEV',
    allowedFormats:["png" , "jpg" , "jpeg" ],
  },
});

module.exports={
    cloudinary,
    storage,
};