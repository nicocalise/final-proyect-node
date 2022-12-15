const multer = require('multer');
const path = require('path');

const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

/*const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public'))
    },
});*/

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'temp',
    format: async (req, file) => 'png',  // supports promises as well
    public_id: (req, file) => 'computed-filename-using-request',
  },
});

/*const VALID_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
    if (!VALID_FILE_TYPES.includes(file.mimetype)) {
        const error = new Error('Invalid file type');
        cb(error)
    } else {
        cb(null, true);
    }
};

const upload = multer({
    storage,
    fileFilter,
});*/

const parser = multer({ storage: storage });


const uploadToCloudinary = async (req, res, next) => {
	if (req.file) {
    try{
		const filePath = req.file.path;
    const image = await cloudinary.uploader.upload(filePath);

    //await fs.unlinkSync(filePath);

    req.file_url = image.secure_url;
		return next();
    }catch(error){
      return next(error)
    }
  } else {
    return next();
  }
};

module.exports = { uploadToCloudinary, parser };