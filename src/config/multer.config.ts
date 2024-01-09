// src/config/multer.config.ts
import { diskStorage } from 'multer';
import * as path from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const name = path.parse(file.originalname).name; // Gets the file name without extension
      const fileExtName = path.extname(file.originalname);
      const timestamp = new Date().getTime();
      callback(null, `${timestamp}-${name}${fileExtName}`);
    },
  }),
};
