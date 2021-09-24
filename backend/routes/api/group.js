const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/groupController.js');

router.get('', groupController.search);
router.post('', groupController.save);
router.put('', groupController.update);

module.exports = router;