const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Room = require("./room"); // Make sure to import Room model

const Student = sequelize.define("Student", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  roomId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    field: 'room_id'  // Maps to snake_case in database
  },
  checkIn: { 
    type: DataTypes.DATE, 
    allowNull: true,
    field: 'check_in'  // Maps camelCase to snake_case
  },
  checkOut: { 
    type: DataTypes.DATE, 
    allowNull: true,
    field: 'check_out'  // Maps camelCase to snake_case
  }
}, {
  tableName: 'students',
  underscored: true,  // Converts camelCase to snake_case for all fields
  timestamps: true,   // Adds createdAt and updatedAt
  paranoid: true ,     // Optional: adds deletedAt for soft deletes
  hooks: {
    afterCreate: async (student) => {
      await Room.increment('occupied', { where: { id: student.roomId } });
    },
    afterDestroy: async (student) => {
      await Room.decrement('occupied', { where: { id: student.roomId } });
    },
    afterUpdate: async (student) => {
      if (student.changed('roomId')) {
        await Room.increment('occupied', { where: { id: student.roomId } });
        await Room.decrement('occupied', { where: { id: student.previous('roomId') } });
      }
    }}
});

module.exports = Student;