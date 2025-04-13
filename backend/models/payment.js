const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Payment = sequelize.define("Payment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  studentId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    defaultValue: "Pending", 
    validate: { isIn: [["Pending", "Completed", "Failed"]] } 
  },
  paymentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = Payment;