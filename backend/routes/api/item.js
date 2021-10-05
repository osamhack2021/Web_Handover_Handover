const express = require('express');
const router = express.Router();
const itemController = require('../../controllers/itemController.js');

router.get('', itemController.search);
router.get('/algolia/:query', itemController.algoliaSearch);
router.get('/:item_id', itemController.read);
router.post('/', itemController.create);
router.put('/:item_id', itemController.update);
router.delete('/:item_id', itemController.delete);

module.exports = router;