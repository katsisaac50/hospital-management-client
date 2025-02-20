import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useTheme } from '../../context/ThemeContext';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  Box,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
// import { useTheme } from "@mui/material/styles";
import DischargeFormDialog from "../../components/DischargeFormDialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DischargeForm = () => {
  const router = useRouter();
  const { patientId } = router.query;
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isDarkMode = theme === "dark";

  useEffect(() => {
    if (!patientId) return;
    fetchDischargeForms();
  }, [patientId]);

  const fetchDischargeForms = async () => {
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
   
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
      setSaving(false);
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
    <Container maxWidth="md">
      {/* Select Discharge Form */}
      <FormControl fullWidth>
      <InputLabel 
        sx={{
          color: isDarkMode ? "#B0B0B0" : "#333",
          "&.Mui-focused": { color: "primary.main" }
        }}
      >Select Discharge Form</InputLabel>
        <Select
        value={selectedIndex}
        onChange={(e) => setSelectedIndex(e.target.value)}
        variant="outlined"
        sx={{
          bgcolor: isDarkMode ? "#2A2A2A" : "#FFF",
          borderRadius: 2,
          color: isDarkMode ? "#E0E0E0" : "#333",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: isDarkMode ? "#444" : "#CCC"
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
        setFormData = {setSelectedForm}
        handleChange = {handleChange}
        handleSubmit = {handleSubmit}
        handleUpdate = {handleUpdate}
        handleDelete = {() => handleDelete(selectedIndex)}
        />
        // <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
        //   <DialogTitle>{selectedForm?._id ? "Edit Discharge Form" : "Create New Discharge Form"}</DialogTitle>
        //   <DialogContent>
        //     <TextField
        //       label="Final Diagnosis"
        //       name="finalDiagnosis"
        //       fullWidth
        //       value={selectedForm?.finalDiagnosis || ""}
        //       onChange={handleChange}
        //       sx={{ mt: 2 }}
        //     />
        //     <TextField
        //       label="Discharge Instructions"
        //       name="dischargeInstructions"
        //       fullWidth
        //       multiline
        //       rows={3}
        //       value={selectedForm?.dischargeInstructions || ""}
        //       onChange={handleChange}
        //       sx={{ mt: 2 }}
        //     />
        //     <TextField 
        //     label="Medications on Discharge" 
        //     name="medicationsOnDischarge" 
        //     variant="outlined" 
        //     fullWidth 
        //     value={selectedForm?.medicationsOnDischarge?.join(", ") || ""} 
        //     onChange={(e) => handleChange({ target: { name: "medicationsOnDischarge", value: e.target.value.split(", ") } })} />
        //     <Typography variant="h6">Follow-up Appointments</Typography>
        //         {selectedForm?.followUpAppointments.map((appointment, index) => (
        //           <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
        //             <Grid item xs={6}>
        //               <TextField type="date" name="date" variant="outlined" fullWidth value={appointment.date} onChange={(e) => {
        //                 const newAppointments = [...selectedForm.followUpAppointments];
        //                 newAppointments[index].date = e.target.value;
        //                 setFormData((prev) => ({ ...prev, followUpAppointments: newAppointments }));
        //               }} />
        //             </Grid>
        //             <Grid item xs={6}>
        //               <TextField label="Reason" name="reason" variant="outlined" fullWidth value={appointment.reason} onChange={(e) => {
        //                 const newAppointments = [...selectedForm.followUpAppointments];
        //                 newAppointments[index].reason = e.target.value;
        //                 setFormData((prev) => ({ ...prev, followUpAppointments: newAppointments }));
        //               }} />
        //             </Grid>
        //           </Grid>
        //         ))}
        //       <Grid item xs={12}>
        //         <TextField label="Discharge Instructions" name="dischargeInstructions" variant="outlined" fullWidth multiline rows={3} value={selectedForm?.dischargeInstructions || ""} onChange={handleChange} />
        //       </Grid>
        //       <Grid item xs={12}>
        //         <TextField label="Doctor's Notes" name="doctorNotes" variant="outlined" fullWidth multiline rows={4} value={selectedForm?.doctorNotes || ""} onChange={handleChange} />
        //       </Grid>
        //   </DialogContent>
        //   <DialogActions>
        //     <Button onClick={() => setIsEditing(false)}>Cancel</Button>
        //     {selectedForm?._id ? (
        //       <Button onClick={handleUpdate} color="primary">Update</Button>
        //     ) : (
        //       <Button onClick={handleSubmit} color="primary">Create</Button>
        //     )}
        //     {selectedForm?._id && (
        //       <Button variant="contained" color="secondary" onClick={() => handleDelete(selectedIndex)}>
        //         Delete
        //       </Button>
        //     )}
        //   </DialogActions>
        // </Dialog>
      )}

      <Button variant="outlined" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleCreateNew}>
        Create New Discharge Form
      </Button>
    </Container>
  );
};

export default DischargeForm;