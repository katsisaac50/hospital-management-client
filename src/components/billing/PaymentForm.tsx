import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Box, Typography, Autocomplete } from "@mui/material";
import axios from "axios";
import * as cookie from "cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Patient {
  _id: string;
  fullName: string;
}

interface Service {
  _id: string;
  name: string;
  price: number;
}

interface PaymentFormProps {
  onPaymentAdded: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentAdded }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    patientId: "",
    name: "",
    date: new Date().toISOString().split("T")[0],
    services: [],
    total: 0,
    discount: 0,
    paid: 0,
    balance: 0,
    paymentMethod: "Cash",
    paymentStatus: "Unpaid",
    notes: "",
  });

  useEffect(() => {
    fetchPatients();
    fetchServices();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      const response = await axios.get<Patient[]>(`${API_URL}/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get<Service[]>(`${API_URL}/services`);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleServiceChange = (_, newValue) => {
    if (newValue) {
      const newService = {
        _id: newValue._id,
        name: newValue.name,
        price: newValue.price,
      };
      setFormData((prev) => {
        const updatedServices = [...prev.services, newService];
        const updatedTotal = updatedServices.reduce((sum, s) => sum + s.price, 0);
        return { ...prev, services: updatedServices, total: updatedTotal, balance: updatedTotal - prev.discount - prev.paid };
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      updated.balance = updated.total - updated.discount - updated.paid;
      updated.paymentStatus = updated.balance === 0 ? "Cleared" : updated.paid === 0 ? "Unpaid" : updated.balance < 0 ? "Overpaid" : "Partially Paid";
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId) {
      alert("Please select a patient.");
      return;
    }
    try {
      await axios.post(`${API_URL}/payments`, formData);
      onPaymentAdded();
      setFormData({
        patientId: "",
        name: "",
        date: new Date().toISOString().split("T")[0],
        services: [],
        total: 0,
        discount: 0,
        paid: 0,
        balance: 0,
        paymentMethod: "Cash",
        paymentStatus: "Unpaid",
        notes: "",
      });
      setSelectedPatient(null);
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 500 }}>
      <Typography variant="h6">Add Payment</Typography>

      <Autocomplete options={patients} getOptionLabel={(patient) => `${patient.fullName}`} onChange={(_, newValue) => setSelectedPatient(newValue)} renderInput={(params) => <TextField {...params} label="Select Patient" fullWidth required />} />

      <Autocomplete options={services} getOptionLabel={(service) => service.name} onChange={handleServiceChange} renderInput={(params) => <TextField {...params} label="Select Service" fullWidth required />} />

      {formData.services.map((service, index) => (
        <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography>{service.name} - ${service.price}</Typography>
          <Button color="error" onClick={() => {
            setFormData((prev) => {
              const updatedServices = prev.services.filter((_, i) => i !== index);
              const updatedTotal = updatedServices.reduce((sum, s) => sum + s.price, 0);
              return { ...prev, services: updatedServices, total: updatedTotal, balance: updatedTotal - prev.discount - prev.paid };
            });
          }}>
            Remove
          </Button>
        </Box>
      ))}

      <TextField label="Total Amount" name="total" type="number" value={formData.total} fullWidth InputProps={{ readOnly: true }} />
      <TextField label="Discount" name="discount" type="number" value={formData.discount} onChange={handleChange} fullWidth required />
      <TextField label="Paid" name="paid" type="number" value={formData.paid} onChange={handleChange} fullWidth required />
      <TextField label="Balance" name="balance" type="number" value={formData.balance} fullWidth InputProps={{ readOnly: true }} />
      <TextField label="Payment Status" name="paymentStatus" value={formData.paymentStatus} fullWidth InputProps={{ readOnly: true }} />
      <TextField select label="Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} fullWidth required>
        {["Cash", "Card", "Mobile Money", "Insurance", "Bank Transfer", "Other"].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <TextField label="Notes" name="notes" value={formData.notes} onChange={handleChange} fullWidth multiline rows={3} />
      <Button type="submit" variant="contained" color="primary">Add Payment</Button>
    </Box>
  );
};

export default PaymentForm;
