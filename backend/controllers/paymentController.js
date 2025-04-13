const Payment = require("../models/payment");

// Create payment
const makePayment = async (req, res) => {
  try {
    const { studentId, amount } = req.body;
    const newPayment = await Payment.create({ 
      studentId, 
      amount, 
      status: "Completed",
      paymentDate: new Date() 
    });
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update payment
const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, amount, status } = req.body;
    
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Only update fields that are provided
    if (studentId) payment.studentId = studentId;
    if (amount) payment.amount = amount;
    if (status) payment.status = status;

    await payment.save();
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete payment
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    await payment.destroy();
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  makePayment, 
  getPayments, 
  updatePayment, 
  deletePayment 
};