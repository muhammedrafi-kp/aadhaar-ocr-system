import {Request,Response,NextFunction} from "express";
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg')  {
      cb(null, true);
    } else {
      cb(new Error('Only png, jpeg and jpg image files are allowed'));
    }
  };

export const upload = multer({ storage, fileFilter }).fields([
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 }
]);