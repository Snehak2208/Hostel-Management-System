// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/", paymentController.makePayment);
router.get("/", paymentController.getPayments);
router.put("/:id", paymentController.updatePayment); 
router.delete("/:id", paymentController.deletePayment);
module.exports = router;