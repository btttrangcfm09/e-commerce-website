const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads/products'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const tempName = `${crypto.randomBytes(32).toString('hex')}` + ext;
        cb(null, tempName);
    },
});

const productUpload = multer({
    storage: productStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
        fieldSize: 50 * 1024 * 1024 // 50MB for form fields (including base64)
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname && file.mimetype.startsWith('image/')) {
            return cb(null, true);
        } else {
            cb(new Error('Only accept JPEG,JPG and PNG format.'));
        }
    },
});

const upload = multer({
    dest: 'uploads/users',
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files allowed'));
        }
        cb(null, true);
    },
});

module.exports = { upload, productUpload };
