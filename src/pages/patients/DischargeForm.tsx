import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useTheme } from '../../context/ThemeContext';
import {
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
// import { useTheme } from "@mui/material/styles";
import DischargeFormDialog from "../../components/DischargeFormDialog";

interface DischargeForm {
  _id?: string;
  finalDiagnosis: string;
  medicationsOnDischarge: string[];
  followUpAppointments: { date: string; reason: string }[];
  dischargeInstructions: string;
  doctorNotes: string;
  createdAt?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DischargeForm = () => {
  const router = useRouter();
  const { patientId } = router.query;
  const { theme } = useTheme();
  const [formData, setFormData] = useState<DischargeForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<DischargeForm | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDarkMode = theme === "dark";

  const fetchDischargeForms = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/discharge/${patientId}`);
      console.log(data)
      setFormData(data || []);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "No discharge form found.");
      setFormData([]);
    } finally {
      setLoading(false);
    }
  }, [patientId, setError]);

  useEffect(() => {
    if (!patientId) return;
    fetchDischargeForms();
  }, [patientId, fetchDischargeForms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
   
    try {
      if (selectedForm?._id) {
        await axios.put(`${API_URL}/discharge/${patientId}/${selectedForm.index}`, selectedForm);
      } else {
        await axios.post(`${API_URL}/discharge/${patientId}`, selectedForm);
      }
      alert("Saved successfully!");
      fetchDischargeForms();
      setIsEditing(false);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (index) => {
    console.log(index)
    setSelectedForm({ ...formData[index], index });
    setSelectedIndex(index);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (!selectedForm) return;
    try {
      await axios.put(`${API_URL}/discharge/${patientId}/${selectedForm.index}`, selectedForm);
      alert("Form updated!");
      fetchDischargeForms();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      alert("Failed to update form.");
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;

    try {
      await axios.delete(`${API_URL}/discharge/${patientId}/${formData[index]._id}`);
      alert("Form deleted!");
      fetchDischargeForms();
    } catch (error) {
      console.log(error);
      alert("Failed to delete form.");
    }
  };

  const handleCreateNew = () => {
    setSelectedForm({
      finalDiagnosis: "",
      medicationsOnDischarge: [],
      followUpAppointments: [{ date: "", reason: "" }],
      dischargeInstructions: "",
      doctorNotes: "",
    });
    setSelectedIndex(null);
    setIsEditing(true);
  };
  

  if (loading) return <Box sx={{ textAlign: "center", mt: 4 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography
  variant="h4"
  sx={{
    textAlign: "center",
    fontWeight: "bold",
    mb: 2,
    color: isDarkMode ? "#FFF" : "#333"
  }}
>
Discharge Section
</Typography>
      {/* Select Discharge Form */}
      <FormControl fullWidth>
      <InputLabel 
        sx={{
          color: isDarkMode ? "#B0B0B0" : "#333",
          "&.Mui-focused": { color: "primary.main" }
        }}
      >Select Discharge Form</InputLabel>
        <Select
        value={selectedIndex ?? ""}
        onChange={(e) => setSelectedIndex(e.target.value)}
        variant="outlined"
        sx={{
          bgcolor: isDarkMode ? "#2A2A2A" : "#FFF",
          borderRadius: 2,
          color: isDarkMode ? "#E0E0E0" : "#333",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: isDarkMode ? "#444" : "#CCC "
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.main"
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.main"
          }
        }}
      >
          {formData.map((form, index) => (
            <MenuItem key={index} value={index}  sx={{
              bgcolor: isDarkMode ? "#333" : "#FFF",
              color: isDarkMode ? "#FFF" : "#333",
              "&:hover": { bgcolor: "primary.light" }
            }}>
              {new Date(form.createdAt).toLocaleDateString()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedIndex !== null && formData[selectedIndex] && (
        <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
          <Typography><strong>Final Diagnosis:</strong> {formData[selectedIndex].finalDiagnosis}</Typography>
          <Typography><strong>Medications:</strong> {formData[selectedIndex].medicationsOnDischarge.join(", ")}</Typography>
          <Typography><strong>Discharge Instructions:</strong> {formData[selectedIndex].dischargeInstructions}</Typography>

          <Button variant="contained" color="primary" sx={{ mt: 1, mr: 1 }} onClick={() => handleEdit(selectedIndex)}>
            Edit
          </Button>
          <Button variant="contained" color="secondary" sx={{ mt: 1 }} onClick={() => handleDelete(selectedIndex)}>
            Delete
          </Button>
        </Paper>
      )}

      {/* Create or Edit Form Dialog */}
      {isEditing && (
        <DischargeFormDialog
        isEditing = {isEditing}
        setIsEditing = {setIsEditing}
        selectedForm = {selectedForm}
        setFormData = {setFormData}
        handleChange = {handleChange}
        handleSubmit = {handleSubmit}
        handleUpdate = {handleUpdate}
        handleDelete = {() => handleDelete(selectedIndex)}
        isDeleting = {isDeleting}
        />
      )}

      <Button variant="outlined" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleCreateNew}>
        Create New Discharge Form
      </Button>
    </Container>
  );
};

export default DischargeForm;