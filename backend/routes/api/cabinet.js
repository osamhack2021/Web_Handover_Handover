const express = require('express');
const router = express.Router();
const cabinetController = require('../../controllers/cabinetController.js');


router.get('', cabinetController.search);
router.get('/:cabinetId', cabinetController.read);
router.post('', cabinetController.create);
router.put('', cabinetController.update);
router.delete('', cabinetController.delete);



module.exports = router;