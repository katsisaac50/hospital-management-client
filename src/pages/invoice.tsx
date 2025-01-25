import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';

interface Patient {
  _id: string;
  name: string;
}

interface Doctor {
  _id: string;
  name: string;
}

interface Service {
  description: string;
  cost: number;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  patient: Patient;
  doctor: Doctor;
  services: Service[];
  totalAmount: number;
  paymentStatus: string;
}

const InvoicePage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formValues, setFormValues] = useState<{
    invoiceNumber: string;
    patient: string;
    doctor: string;
    services: string;
    paymentStatus: string;
  }>({
    invoiceNumber: '',
    patient: '',
    doctor: '',
    services: '',
    paymentStatus: '',
  });

  const getToken = useCallback((): string | undefined => {
    return document.cookie.split('; ').find((row) => row.startsWith('authToken='))?.split('=')[1];
  }, []);

  const fetchData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      alert('Session expired. Redirecting to login...');
      window.location.href = '/login';
      return;
    }

    try {
      const [patientRes, doctorRes] = await Promise.all([
        axios.get('http://localhost:5000/api/patients', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5000/api/users?role=doctor', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setPatients(patientRes.data || []);
      setDoctors(doctorRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please check your connection or try again.');
    }
  }, [getToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchInvoices = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/invoices');
      setInvoices(response.data.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      alert('Failed to fetch invoices.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name) {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateInvoice = async () => {
    setCreating(true);
    try {
      const servicesArray = formValues.services
        .split(',')
        .map((service) => {
          const [description, cost] = service.split(':');
          return { description: description.trim(), cost: parseFloat(cost.trim()) };
        })
        .filter((service) => service.description && !isNaN(service.cost));

      const totalAmount = servicesArray.reduce((sum, service) => sum + service.cost, 0);

      const response = await axios.post('http://localhost:5000/api/invoices', {
        ...formValues,
        services: servicesArray,
        totalAmount,
      });

      setInvoices((prev) => [...prev, response.data.data]);
      setIsDialogOpen(false);
      setFormValues({ invoiceNumber: '', patient: '', doctor: '', services: '', paymentStatus: '' });
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Invoices</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsDialogOpen(true)}
        style={{ marginBottom: '20px' }}
      >
        Create Invoice
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice Number</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Payment Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.patient?.name}</TableCell>
                  <TableCell>{invoice.doctor?.name}</TableCell>
                  <TableCell>${invoice.totalAmount}</TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth>
        <DialogTitle>Create Invoice</DialogTitle>
        <DialogContent>
          <TextField
            name="invoiceNumber"
            label="Invoice Number"
            fullWidth
            margin="dense"
            value={formValues.invoiceNumber}
            onChange={handleTextFieldChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Select Patient</InputLabel>
            <Select name="patient" value={formValues.patient} onChange={handleSelectChange}>
              {patients.map((patient) => (
                <MenuItem key={patient._id} value={patient._id}>
                  {patient.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Select Doctor</InputLabel>
            <Select name="doctor" value={formValues.doctor} onChange={handleSelectChange}>
              {doctors.map((doctor) => (
                <MenuItem key={doctor._id} value={doctor._id}>
                  {doctor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="services"
            label="Services (e.g., Consultation:50, Medication:20)"
            fullWidth
            margin="dense"
            value={formValues.services}
            onChange={handleTextFieldChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Payment Status</InputLabel>
            <Select name="paymentStatus" value={formValues.paymentStatus} onChange={handleSelectChange}>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateInvoice} color="primary" variant="contained" disabled={creating}>
            {creating ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InvoicePage;
