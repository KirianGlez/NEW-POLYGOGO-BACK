const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const authMiddleware = require("../middlewares/authMiddelware");

router.use(authMiddleware);

router.get("/search-game", gameController.search);

router.get("/check-ingame", gameController.checkGameInGame);

module.exports = router;
