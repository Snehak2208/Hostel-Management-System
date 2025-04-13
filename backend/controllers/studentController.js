const Student = require("../models/student");
const { sequelize } = require('../config');

const Room = require("../models/room");

const addStudent = async (req, res) => {
  try {
    const { name, email, roomId } = req.body;
    const newStudent = await Student.create({ name, email, roomId });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignRoom = async (req, res) => {
  try {
    const { studentId, roomId } = req.body;
    const student = await Student.findByPk(studentId);
    const room = await Room.findByPk(roomId);

    if (!student || !room) return res.status(404).json({ message: "Student or Room not found" });

    if (room.occupied >= room.capacity) return res.status(400).json({ message: "Room is full" });

    student.roomId = roomId;
    await student.save();

    room.occupied += 1;
    await room.save();

    res.status(200).json({ message: "Room assigned successfully", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Check-In Function
const checkInStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) return res.status(404).json({ message: "Student not found" });

    student.checkIn = new Date(); // Set current timestamp
    await student.save();

    res.status(200).json({ message: "Check-in successful", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkOutStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) return res.status(404).json({ message: "Student not found" });
    if (!student.checkIn) return res.status(400).json({ message: "Student is not checked in" });

    student.checkOut = new Date(); // Set current timestamp
    await student.save();

    res.status(200).json({ message: "Check-out successful", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// controllers/studentController.js

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const updatedStudent = await student.update({
      name: req.body.name,
      email: req.body.email,
      room_id: req.body.room_id
    });
    
    res.json(updatedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    await student.destroy({ force: req.query.force === 'true' });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};


// ✅ Make sure to export assignRoom
module.exports = { addStudent, getStudents, assignRoom ,checkInStudent, checkOutStudent,deleteStudent,updateStudent };