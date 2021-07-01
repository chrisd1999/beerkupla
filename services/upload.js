const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    fs.mkdir(`./download/${req.params.id}`, { recursive: true }, (err) => {
      if (err) throw err;
    });
    const url = `./download/${req.params.id}`;
    cb(null, url);
  },
  filename(req, file, cb) {
    console.log(`Mimetype: ${file.mimetype}`);
    const extension = file.originalname.split('.')[1];
    file.originalname = `${req.params.id}.${extension}`;
    cb(null, `${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == 'application/pdf' ||
    file.mimetype == 'application/octet-stream' ||
    file.originalname.split('.')[1] == 'bsmx'
  ) {
    cb(null, true);
  } else {
    req.fileValidationError = 'Forbidden extension';
    return cb(null, false, req.fileValidationError);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
