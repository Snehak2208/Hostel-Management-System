const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Room = sequelize.define("Room", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  number: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  capacity: { type: DataTypes.INTEGER, allowNull: false },
  occupied: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Room;