import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Typography, Stack } from "@mui/material";
import { useTheme } from '../context/ThemeContext';

const DischargeFormDialog = ({ isEditing, setIsEditing, selectedForm, setFormData, handleChange, handleSubmit, handleUpdate, handleDelete }) => {
    const { theme, toggleTheme } = useTheme();
  return (
    <Dialog open={isEditing} 
    onClose={() => setIsEditing(false)} 
    fullWidth 
    maxWidth="md"
    className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-transparent text-gray-900'}`}>
      <DialogTitle sx={{ bgcolor: "primary.main", color: "white", textAlign: "center" }}>
        {selectedForm?._id ? "Edit Discharge Form" : "Create New Discharge Form"}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Final Diagnosis */}
          <TextField
            label="Final Diagnosis"
            name="finalDiagnosis"
            fullWidth
            value={selectedForm?.finalDiagnosis || ""}
            onChange={handleChange}
          />

          {/* Discharge Instructions */}
          <TextField
            label="Discharge Instructions"
            name="dischargeInstructions"
            fullWidth
            multiline
            rows={3}
            value={selectedForm?.dischargeInstructions || ""}
            onChange={handleChange}
          />

          {/* Medications on Discharge */}
          <TextField
            label="Medications on Discharge"
            name="medicationsOnDischarge"
            fullWidth
            value={selectedForm?.medicationsOnDischarge?.join(", ") || ""}
            onChange={(e) => handleChange({ target: { name: "medicationsOnDischarge", value: e.target.value.split(", ") } })}
          />

          {/* Follow-up Appointments */}
          <Typography variant="h6" sx={{ mt: 2 }}>Follow-up Appointments</Typography>
          {selectedForm?.followUpAppointments?.map((appointment, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  fullWidth
                  value={appointment.date}
                  onChange={(e) => {
                    const newAppointments = [...selectedForm.followUpAppointments];
                    newAppointments[index].date = e.target.value;
                    setFormData((prev) => ({ ...prev, followUpAppointments: newAppointments }));
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Reason"
                  fullWidth
                  value={appointment.reason}
                  onChange={(e) => {
                    const newAppointments = [...selectedForm.followUpAppointments];
                    newAppointments[index].reason = e.target.value;
                    setFormData((prev) => ({ ...prev, followUpAppointments: newAppointments }));
                  }}
                />
              </Grid>
            </Grid>
          ))}

          {/* Doctor's Notes */}
          <TextField
            label="Doctor's Notes"
            name="doctorNotes"
            fullWidth
            multiline
            rows={4}
            value={selectedForm?.doctorNotes || ""}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button onClick={() => setIsEditing(false)} color="inherit">Cancel</Button>
        <Stack direction="row" spacing={2}>
          {selectedForm?._id ? (
            <Button onClick={handleUpdate} color="primary" variant="contained">Update</Button>
          ) : (
            <Button onClick={handleSubmit} color="primary" variant="contained">Create</Button>
          )}
          {selectedForm?._id && (
            <Button variant="contained" color="error" onClick={() => handleDelete(selectedForm._id)}>
              Delete
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default DischargeFormDialog;
