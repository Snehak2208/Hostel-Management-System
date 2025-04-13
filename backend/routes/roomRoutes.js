// routes/roomRoutes.js
const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

router.post("/", roomController.addRoom);
router.get("/", roomController.getRooms);
router.delete("/:id", roomController.deleteRoom);
router.put('/:id', roomController.updateRoom);
module.exports = router;