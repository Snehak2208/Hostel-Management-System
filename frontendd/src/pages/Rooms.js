import React, { useState, useEffect ,useCallback} from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Add, 
  Delete, 
  Edit,
  MeetingRoom 
} from '@mui/icons-material';
import api from '../services/api';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formData, setFormData] = useState({
    number: '',
    capacity: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      showSnackbar('Failed to fetch rooms', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const roomData = {
        number: parseInt(formData.number),
        capacity: parseInt(formData.capacity)
      };

      if (currentRoom) {
        await api.put(`/rooms/${currentRoom.id}`, roomData);
        showSnackbar('Room updated successfully');
      } else {
        await api.post('/rooms', roomData);
        showSnackbar('Room added successfully');
      }

      fetchRooms();
      handleClose();
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/rooms/${id}`);
      showSnackbar('Room deleted successfully');
      fetchRooms();
    } catch (error) {
      showSnackbar('Failed to delete room', 'error');
    }
  };

  const handleEdit = (room) => {
    setCurrentRoom(room);
    setFormData({
      number: room.number.toString(),
      capacity: room.capacity.toString()
    });
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
    setCurrentRoom(null);
    setFormData({ number: '', capacity: '' });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        <MeetingRoom sx={{ verticalAlign: 'middle', mr: 1 }} />
        Room Management
      </Typography>
      
      <Button 
        variant="contained" 
        startIcon={<Add />}
        onClick={() => setOpenForm(true)}
        sx={{ mb: 3 }}
      >
        Add Room
      </Button>
      
      {/* Room Form Dialog */}
      <Dialog open={openForm} onClose={handleClose}>
        <DialogTitle>{currentRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="number"
              label="Room Number"
              type="number"
              fullWidth
              variant="standard"
              value={formData.number}
              onChange={handleInputChange}
              required
              inputProps={{ min: 1 }}
            />
            <TextField
              margin="dense"
              name="capacity"
              label="Capacity"
              type="number"
              fullWidth
              variant="standard"
              value={formData.capacity}
              onChange={handleInputChange}
              required
              inputProps={{ min: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {currentRoom ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Rooms Table */}
      {loading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Room #</TableCell>
                <TableCell sx={{ color: 'white' }}>Capacity</TableCell>
                <TableCell sx={{ color: 'white' }}>Occupied</TableCell>
                <TableCell sx={{ color: 'white' }}>Availability</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.number}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>{room.occupied}</TableCell>
                    <TableCell>
                      <span style={{ 
                        color: room.capacity - room.occupied > 0 ? 'green' : 'red',
                        fontWeight: 'bold'
                      }}>
                        {room.capacity - room.occupied}
                      </span>
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary"
                        onClick={() => handleEdit(room)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error"
                        onClick={() => handleDelete(room.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No rooms found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Rooms;