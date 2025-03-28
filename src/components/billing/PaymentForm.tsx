import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Box, Typography, Autocomplete } from "@mui/material";
import axios from "axios";
import * as cookie from "cookie";

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
    date: new Date().toISOString().split("T")[0], 
    total: 0,
    discount: 0, // New field
    paid: 0,
    balance: 0,
    paymentMethod: "Cash", // User selects
    paymentStatus: "Unpaid", // Auto-calculated
    notes: "",
  });
  

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      // Get token from cookies or localStorage
      const cookies = document.cookie;
      const parsedCookies = cookie.parse(cookies);
      const token = parsedCookies.authToken || localStorage.getItem("authToken");
  
      if (!token) {
        console.error("No token found, redirecting to login.");
        window.location.href = "/login"; // Redirect manually in client
        return;
      }
  
      // Fetch Patients
      const response = await axios.get<Patient[]>(`${API_URL}/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Patients fetched:", response.data);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
  
      // Convert to numbers
      const total = Number(updated.total);
      const discount = Number(updated.discount);
      const paid = Number(updated.paid);
  
      // Ensure discount does not exceed total
      updated.discount = Math.min(discount, total);
  
      // Calculate new balance
      updated.balance = total - updated.discount - paid;
  
      // Auto-detect payment status
      if (updated.balance === 0) {
        updated.paymentStatus = "Cleared"; 
      } else if (paid === 0) {
        updated.paymentStatus = "Unpaid"; 
      } else if (updated.balance < 0) {
        updated.paymentStatus = "Overpaid";
      } else {
        updated.paymentStatus = "Partially Paid";
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
      await axios.post(`${API_URL}/payments`, formData);
      onPaymentAdded(); // Refresh data
      setFormData({
        patientId: "",
        name: "",
        date: new Date().toISOString().split("T")[0], 
        total: 0,
        discount: 0, // New field
        paid: 0,
        balance: 0,
        paymentMethod: "Cash", // User selects
        paymentStatus: "Unpaid", // Auto-calculated
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
        getOptionLabel={(patient) => `${patient.name} (ID: ${patient._id})`}
        onChange={(_, newValue) => {
          setSelectedPatient(newValue);
          setFormData((prev) => ({
            ...prev,
            patientId: newValue ? newValue._id : "",
            name: newValue ? newValue.name : "",
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
      
      {/* discount */}
        <TextField label="Discount" name="discount" type="number" value={formData.discount} onChange={handleChange} fullWidth required />


      {/* Paid Amount */}
      <TextField label="Paid" name="paid" type="number" value={formData.paid} onChange={handleChange} fullWidth required />


      {/* Balance (Auto-calculated) */}
      <TextField label="Balance" name="balance" type="number" value={formData.balance} fullWidth InputProps={{ readOnly: true }} />

      {/* payment status */}
      <TextField label="Payment Status" name="paymentStatus" value={formData.paymentStatus} fullWidth InputProps={{ readOnly: true }} />


      {/* Payment method */}
      <TextField select label="Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} fullWidth required>
        {["Cash", "Card", "Mobile Money", "Insurance", "Bank Transfer", "Other"].map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField label="Payment Status" name="paymentStatus" value={formData.paymentStatus} fullWidth InputProps={{ readOnly: true }} />


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
