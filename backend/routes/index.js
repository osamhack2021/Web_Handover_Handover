const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const userController = require("../controllers/userController.js");

const { init } = require("../InitDB.js");

router.get("/", (req, res) => {
  res.redirect(
    "https://github.com/osamhack2021/Web_Handover_Handover/wiki/API-Reference"
  );
});

router.get("/favicon.ico", (req, res) => {
  res.status(200).send("oK");
});

router.get("/initDB", async (req, res) => {
  try {
    await init();
    res.status(200).send("OK");
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/user", userController.save);
router.get("/check-service-number", userController.isExist);

module.exports = router;
