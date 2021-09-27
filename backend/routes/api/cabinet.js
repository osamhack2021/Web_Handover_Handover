const express = require('express');
const router = express.Router();
const cabinetController = require('../../controllers/cabinetController.js');


router.get('', cabinetController.search);
router.get('/:title', cabinetController.read);
router.post('/:title', cabinetController.create);
router.put('/:title', cabinetController.update);
router.delete('/:title', cabinetController.delete);



module.exports = router;