const express = require('express');
const router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'files/',
    filename: function(req, file, callback) {
        let ext = file.originalname.split('.').slice(-1);
        callback( null, Date.now() + '.' + ext ); // 1633269573153.ext
    }
});
const upload = multer({ storage });

const fileController = require('../../controllers/fileController.js');

router.post('/upload', upload.array('file'), fileController.create);
router.get('/:file_name', fileController.read);

module.exports = router;