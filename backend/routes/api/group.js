const express = require("express");
const router = express.Router();
const groupController = require("../../controllers/groupController.js");

router.get("", groupController.search);
router.get("/:group_id", groupController.read);
router.post("", groupController.create);
router.put("/:group_id", groupController.update);
router.delete("/:group_id", groupController.delete);

module.exports = router;
