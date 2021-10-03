const express = require('express');
const router = express.Router();
const fileController = require('../../controllers/fileController.js');

router.get('/:file_name', fileController.search);
router.post('', fileController.create);

module.exports = router;