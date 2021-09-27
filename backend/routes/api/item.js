const express = require('express');
const router = express.Router();
const itemController = require('../../controllers/itemController.js');


router.get('', itemController.search);

router.post('', itemController.create);

router.put('', itemController.update);

router.delete('', itemController.delete);

router.get('/:itemId');

module.exports = router;