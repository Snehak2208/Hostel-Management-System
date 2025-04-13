// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router.post("/", studentController.addStudent);
router.get("/", studentController.getStudents);
router.post("/assign", studentController.assignRoom);
router.post("/:id/checkin", studentController.checkInStudent);
router.post("/:id/checkout", studentController.checkOutStudent);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);
module.exports = router;