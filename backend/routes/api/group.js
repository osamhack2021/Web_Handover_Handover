const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/groupController.js');

router.get('', groupController.search);
router.post('', groupController.create);
router.put('', groupController.update);
router.delete('', groupController.delete);

module.exports = router;