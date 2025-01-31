import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DoctorForm from "./../components/DoctorForm";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Doctor {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  phone: string;
}

type DoctorFormValues = Omit<Doctor, "_id">;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [formValues, setFormValues] = useState<DoctorFormValues>({
    name: "",
    email: "",
    specialization: "",
    phone: "",
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const getAuthToken = () => {
    return document.cookie.split("; ").find((row) => row.startsWith("authToken="))?.split("=")[1];
  };

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Session expired");
      const response = await axios.get(`${API_BASE_URL}/api/users?role=doctor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(response.data.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setSnackbar({ open: true, message: "Failed to fetch doctors.", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleAddOrEditDoctor = async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Session expired");

      if (isEditing && currentDoctor) {
        await axios.put(`${API_BASE_URL}/${currentDoctor._id}`, formValues, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSnackbar({ open: true, message: "Doctor updated successfully.", severity: "success" });
      } else {
        await axios.post(
          `${API_BASE_URL}/api/users`,
          { ...formValues, role: "doctor" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSnackbar({ open: true, message: "Doctor added successfully.", severity: "success" });
      }

      fetchDoctors();
      setIsDialogOpen(false);
      setFormValues({ name: "", email: "", specialization: "", phone: "" });
    } catch (error) {
      console.error("Error saving doctor:", error);
      setSnackbar({ open: true, message: "Failed to save doctor.", severity: "error" });
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Session expired");

      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({ open: true, message: "Doctor deleted successfully.", severity: "success" });
      fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      setSnackbar({ open: true, message: "Failed to delete doctor.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const closeSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Doctors Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setIsDialogOpen(true);
          setIsEditing(false);
          setFormValues({ name: "", email: "", specialization: "", phone: "" });
        }}
        sx={{ marginBottom: 2 }}
      >
        Add Doctor
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Specialization</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor._id}>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>{doctor.phone}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setIsEditing(true);
                        setIsDialogOpen(true);
                        setCurrentDoctor(doctor);
                        setFormValues(doctor);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteDoctor(doctor._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{isEditing ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
        <DialogContent>
          <DoctorForm formValues={formValues} setFormValues={setFormValues} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleAddOrEditDoctor}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorsPage;
