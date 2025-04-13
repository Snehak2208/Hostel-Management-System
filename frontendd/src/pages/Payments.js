import React, { useState, useEffect,useCallback } from 'react';
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
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import api from '../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    status: 'Completed',
    paymentDate: new Date()
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, studentsRes] = await Promise.all([
        api.get('/payments'),
        api.get('/students')
      ]);
      setPayments(paymentsRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      showSnackbar('Failed to fetch data', 'error');
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

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      paymentDate: date
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        paymentDate: format(formData.paymentDate, 'yyyy-MM-dd')
      };

      if (currentPayment) {
        await api.put(`/payments/${currentPayment.id}`, payload);
        showSnackbar('Payment updated successfully');
      } else {
        await api.post('/payments', payload);
        showSnackbar('Payment recorded successfully');
      }
      fetchData();
      handleCloseDialog();
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/payments/${id}`);
      showSnackbar('Payment deleted successfully');
      fetchData();
    } catch (error) {
      showSnackbar('Failed to delete payment', 'error');
    }
  };

  const handleOpenDialog = (payment = null) => {
    setCurrentPayment(payment);
    setFormData(payment ? {
      studentId: payment.studentId,
      amount: payment.amount.toString(),
      status: payment.status,
      paymentDate: new Date(payment.paymentDate)
    } : {
      studentId: '',
      amount: '',
      status: 'Completed',
      paymentDate: new Date()
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPayment(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 3 }}>
        <PaymentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Payment Management
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        sx={{ mb: 3 }}
      >
        Record Payment
      </Button>

      {loading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Receipt #</TableCell>
                <TableCell sx={{ color: 'white' }}>Student</TableCell>
                <TableCell sx={{ color: 'white' }}>Amount</TableCell>
                <TableCell sx={{ color: 'white' }}>Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <ReceiptIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {payment.id}
                  </TableCell>
                  <TableCell>
                    {students.find(s => s.id === payment.studentId)?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    ₹{payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(payment.paymentDate), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={payment.status}
                      color={getStatusColor(payment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(payment)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(payment.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Payment Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentPayment ? 'Edit Payment Record' : 'Record New Payment'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              select
              margin="dense"
              name="studentId"
              label="Student"
              fullWidth
              variant="standard"
              value={formData.studentId}
              onChange={handleInputChange}
              required
            >
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.name} ({student.email})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              margin="dense"
              name="amount"
              label="Amount (₹)"
              type="number"
              fullWidth
              variant="standard"
              value={formData.amount}
              onChange={handleInputChange}
              required
              inputProps={{ step: "0.01", min: "0" }}
              sx={{ mt: 2 }}
            />

            <TextField
              select
              margin="dense"
              name="status"
              label="Status"
              fullWidth
              variant="standard"
              value={formData.status}
              onChange={handleInputChange}
              required
              sx={{ mt: 2 }}
            >
              {['Completed', 'Pending', 'Failed'].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>

            <DatePicker
              label="Payment Date"
              value={formData.paymentDate}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  fullWidth
                  variant="standard"
                  sx={{ mt: 2 }}
                />
              )}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {currentPayment ? 'Update' : 'Record'} Payment
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

export default Payments;