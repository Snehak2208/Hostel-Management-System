const Room = require("../models/room");

const addRoom = async (req, res) => {
  try {
    const { number, capacity } = req.body;
    const newRoom = await Room.create({ number, capacity });
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    await room.destroy();
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateRoom = async (req, res) => {
    try {
      const { id } = req.params;
      const { number, capacity } = req.body;
      
      const room = await Room.findByPk(id);
      if (!room) return res.status(404).json({ message: "Room not found" });
  
      await room.update({ number, capacity });
      res.status(200).json(room);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Then export it
  module.exports = { addRoom, getRooms, deleteRoom, updateRoom };
