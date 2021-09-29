const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/groupController.js');

router.get('', groupController.searchAll);
router.get('/:group*', groupController.search);
router.post('/:group*', groupController.create);
router.put('/:group*', groupController.update);
router.delete('/:group*', groupController.delete);

module.exports = router;