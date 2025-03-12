import multer, { diskStorage } from "multer";
import { extname } from "path";
 
const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");  
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + extname(file.originalname)); 
  }
});
 
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and JPG images are allowed"), false);
  }
};
 
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },  
  fileFilter: fileFilter
});

export default upload;
