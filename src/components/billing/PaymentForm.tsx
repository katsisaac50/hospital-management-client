import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Box, Typography, Autocomplete } from "@mui/material";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Patient {
  _id: string;
  fullName: string;
}

interface PaymentFormProps {
  onPaymentAdded: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentAdded }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    patientId: "",
    name: "",
    date: new Date().toISOString().split("T")[0], // Default to today
    total: 0,
    paid: 0,
    balance: 0,
    transactionType: "Cash",
    notes: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get<Patient[]>(`${API_URL}/patients`);
      console.log(response);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-calculate balance
      if (name === "total" || name === "paid") {
        updated.balance = Number(updated.total) - Number(updated.paid);
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId) {
      alert("Please select a patient.");
      return;
    }

    try {
      await axios.post(`${API_URL}/billing`, formData);
      onPaymentAdded(); // Refresh data
      setFormData({
        patientId: "",
        name: "",
        date: new Date().toISOString().split("T")[0],
        total: 0,
        paid: 0,
        balance: 0,
        transactionType: "Cash",
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

      {/* Select Patient (Searchable) */}
      <Autocomplete
        options={patients}
        getOptionLabel={(patient) => `${patient.fullName} (ID: ${patient._id})`}
        onChange={(_, newValue) => {
          setSelectedPatient(newValue);
          setFormData((prev) => ({
            ...prev,
            patientId: newValue ? newValue._id : "",
            name: newValue ? newValue.fullName : "",
          }));
        }}
        renderInput={(params) => <TextField {...params} label="Select Patient" fullWidth required />}
      />

      {/* Patient ID (Read-only, auto-filled) */}
      <TextField label="Patient ID" name="patientId" value={formData.patientId} fullWidth InputProps={{ readOnly: true }} />

      {/* Date */}
      <TextField label="Date" name="date" type="date" value={formData.date} onChange={handleChange} fullWidth required />

      {/* Total Amount */}
      <TextField label="Total Amount" name="total" type="number" value={formData.total} onChange={handleChange} fullWidth required />

      {/* Paid Amount */}
      <TextField label="Paid" name="paid" type="number" value={formData.paid} onChange={handleChange} fullWidth required />

      {/* Balance (Auto-calculated) */}
      <TextField label="Balance" name="balance" type="number" value={formData.balance} fullWidth InputProps={{ readOnly: true }} />

      {/* Transaction Type */}
      <TextField select label="Transaction Type" name="transactionType" value={formData.transactionType} onChange={handleChange} fullWidth required>
        {["Cash", "TT", "Cleared", "Other"].map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      {/* Notes */}
      <TextField label="Notes" name="notes" value={formData.notes} onChange={handleChange} fullWidth multiline rows={3} />

      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary">
        Add Payment
      </Button>
    </Box>
  );
};

export default PaymentForm;
