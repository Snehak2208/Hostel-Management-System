const sequelize = require("../config");
const Student = require("./student");
const Room = require("./room");
const Payment = require("./payment");

Student.belongsTo(Room, { foreignKey: "roomId" });
Room.hasMany(Student, { foreignKey: "roomId" });

Payment.belongsTo(Student, { foreignKey: "studentId" });

sequelize.sync();

module.exports = { Student, Room, Payment };