import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: `${__dirname}/../public`,
  filename: (req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname);
    if (ext == ".png" || ext == ".jpg" || ext == ".jpeg") {
      return cb(
        null,
        `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
      );
    } else {
      return cb(new Error("Only images file are allowed"));
    }
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000000,
  },
});

export default upload;