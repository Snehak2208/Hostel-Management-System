import React, { useState, useEffect } from 'react';
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
  MenuItem,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckInIcon,
  ExitToApp as CheckOutIcon
} from '@mui/icons-material';
import api from '../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState({
    table: true,
    action: false
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    room_id: '' // Changed from roomId to match backend
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(prev => ({ ...prev, table: true }));
      const [studentsRes, roomsRes] = await Promise.all([
        api.get('/students?_embed=room'),
        api.get('/rooms')
      ]);
      
      // Normalize student data to match frontend expectations
      const normalizedStudents = studentsRes.data.map(student => ({
        ...student,
        id: student.id,
        name: student.name,
        email: student.email,
        roomId: student.room_id, // Map backend field to frontend
        checkIn: student.check_in || false,
        checkOut: student.check_out || false,
        room: student.room || null
      }));
      
      setStudents(normalizedStudents);
      setRooms(roomsRes.data);
    } catch (error) {
      console.error('Fetch error:', error);
      showSnackbar(
        error.response?.data?.message || 
        'Failed to fetch data', 
        'error'
      );
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  const validateStudentData = (data) => {
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error('Please enter a valid email address');
    }
    
    if (!data.room_id) {
      throw new Error('Please select a room');
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
      setLoading(prev => ({ ...prev, action: true }));
      
      // Prepare data with correct field names for backend
      const studentData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        room_id: formData.room_id // Match backend field name
      };
      
      validateStudentData(studentData);

      if (currentStudent) {
        // Use PUT instead of PATCH for full updates
        const response = await api.put(`/students/${currentStudent.id}`, studentData);
        
        // Update local state with response data
        const updatedStudent = {
          ...response.data,
          roomId: response.data.room_id, // Map back to frontend field
          room: rooms.find(room => room.id === response.data.room_id) || null
        };
        
        setStudents(students.map(student => 
          student.id === currentStudent.id ? updatedStudent : student
        ));
        
        showSnackbar('Student updated successfully');
      } else {
        const response = await api.post('/students', studentData);
        
        // Add new student with proper field mapping
        const newStudent = {
          ...response.data,
          roomId: response.data.room_id,
          room: rooms.find(room => room.id === response.data.room_id),
          checkIn: false,
          checkOut: false
        };
        
        setStudents([...students, newStudent]);
        showSnackbar('Student added successfully');
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Operation error:', error);
      const errorMessage = error.message || 
                          error.response?.data?.message || 
                          error.response?.data?.error ||
                          'Operation failed';
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      await api.delete(`/students/${id}`);
      
      // Optimistic update
      setStudents(students.filter(student => student.id !== id));
      
      showSnackbar('Student deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      showSnackbar(
        error.response?.data?.message || 
        'Failed to delete student', 
        'error'
      );
      // Re-fetch to ensure consistency
      fetchData();
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleCheckIn = async (id) => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      const response = await api.post(`/students/${id}/checkin`);
      
      setStudents(students.map(student => 
        student.id === id ? { 
          ...student, 
          checkIn: response.data.check_in, // Match backend field
          checkOut: false
        } : student
      ));
      
      showSnackbar(response.data.message || 'Check-in successful');
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 
        'Check-in failed', 
        'error'
      );
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleCheckOut = async (id) => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      const response = await api.post(`/students/${id}/checkout`);
      
      setStudents(students.map(student => 
        student.id === id ? { 
          ...student, 
          checkOut: response.data.check_out, // Match backend field
          checkIn: false
        } : student
      ));
      
      showSnackbar(response.data.message || 'Check-out successful');
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 
        'Check-out failed', 
        'error'
      );
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleOpenDialog = (student = null) => {
    setCurrentStudent(student);
    setFormData(student ? {
      name: student.name,
      email: student.email,
      room_id: student.roomId // Map to backend field name
    } : {
      name: '',
      email: '',
      room_id: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentStudent(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getStatusInfo = (student) => {
    if (student.checkOut) {
      return { 
        text: `Checked out: ${new Date(student.checkOut).toLocaleString()}`, 
        color: 'default' 
      };
    }
    if (student.checkIn) {
      return { 
        text: `Checked in: ${new Date(student.checkIn).toLocaleString()}`, 
        color: 'success' 
      };
    }
    return { 
      text: 'Not checked in', 
      color: 'warning' 
    };
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 3 }}>
        Student Management
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        sx={{ mb: 3 }}
        disabled={loading.action}
      >
        Add Student
      </Button>

      {loading.table ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Email</TableCell>
                <TableCell sx={{ color: 'white' }}>Room</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => {
                const status = getStatusInfo(student);
                const isCheckedIn = student.checkIn && !student.checkOut;
                const canCheckIn = !student.checkIn || student.checkOut;
                
                return (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      {student.room?.number || 'N/A'}
                      <br />
                      <small>Capacity: {student.room?.capacity || 'N/A'}</small>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={status.text} 
                        color={status.color} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => handleOpenDialog(student)}
                        disabled={loading.action}
                      >
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDelete(student.id)}
                        disabled={loading.action}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>

                      {canCheckIn && (
                        <IconButton 
                          onClick={() => handleCheckIn(student.id)}
                          disabled={loading.action}
                        >
                          <CheckInIcon color="success" />
                        </IconButton>
                      )}

                      {isCheckedIn && (
                        <IconButton 
                          onClick={() => handleCheckOut(student.id)}
                          disabled={loading.action}
                        >
                          <CheckOutIcon color="secondary" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Student Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{currentStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Full Name"
              type="text"
              fullWidth
              variant="standard"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={loading.action}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="standard"
              value={formData.email}
              onChange={handleInputChange}
              required
              sx={{ mt: 2 }}
              disabled={loading.action}
            />
            <TextField
              select
              margin="dense"
              name="room_id"  // Changed to match backend field
              label="Room"
              fullWidth
              variant="standard"
              value={formData.room_id}
              onChange={handleInputChange}
              required
              sx={{ mt: 2 }}
              disabled={loading.action}
            >
              {rooms.map((room) => {
                const isAvailable = room.occupied < room.capacity;
                const isCurrentRoom = currentStudent && currentStudent.roomId === room.id;
                const isSelectable = isAvailable || isCurrentRoom;
                
                return (
                  <MenuItem 
                    key={room.id} 
                    value={room.id}
                    disabled={!isSelectable}
                  >
                    {room.number} (Cap: {room.capacity}, Avail: {room.capacity - room.occupied})
                    {!isSelectable && ' - Full'}
                  </MenuItem>
                );
              })}
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={handleCloseDialog}
              disabled={loading.action}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={loading.action}
            >
              {loading.action ? (
                <CircularProgress size={24} color="inherit" />
              ) : currentStudent ? 'Update' : 'Add'} Student
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Students;