const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: '/multer',
    format: async (req, file) => {
      const VALID_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

      if (!VALID_FILE_TYPES.includes(file.mimetype)) {
        //formato no valido de imagen (ver error)
      } else {
        //devolver formato con el string cortado.
        var type = file.mimetype.substring(file.mimetype.indexOf('/')+1);
        return type;
      }
    },  
    public_id: (req, file) => {
      const imageName = file.originalname.substring(0 ,file.originalname.indexOf('.'));

      if(imageName != null){
        return imageName
      }else{
        return 'nombre por defecto'
      }
    }
  },
});

const parser = multer({ storage: storage });

module.exports = { parser };