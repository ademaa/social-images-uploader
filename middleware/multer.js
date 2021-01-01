const multer = require('multer');

const storage =multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'uploads')
    },
    filename:(req,file,callback)=>{
        const ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
        callback(null,`${file.fieldname}-${Date.now()}${ext}`)
    }
});
module.exports = store = multer({storage});