import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Typography, Stack } from "@mui/material";
import { useTheme } from '../context/ThemeContext';
import { IconButton } from "@mui/material";
import { Close as CloseIcon } from '@mui/icons-material';

// Define the types of the props

interface FollowUpAppointment {
  date: string;
  reason: string;
}

interface DischargeForm {
  _id?: string;
  finalDiagnosis: string;
  dischargeInstructions: string;
  medicationsOnDischarge: string[];
  followUpAppointments: FollowUpAppointment[];
  doctorNotes: string;
}

interface DischargeFormDialogProps {
  isDeleting: boolean;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  selectedForm: DischargeForm | null; // Update this with the actual type of selectedForm
  setFormData: (formData: DischargeForm) => void;// Update this with the actual type of formData
  handleChange: (e: { target: { name: string; value: string | string[] } }) => void;
  handleSubmit: () => void;
  handleUpdate: () => void;
  handleDelete: (id: string) => void;
}

const DischargeFormDialog: React.FC<DischargeFormDialogProps> = ({ isDeleting, isEditing, setIsEditing, selectedForm, setFormData, handleChange, handleSubmit, handleUpdate, handleDelete }) => {
  const { theme } = useTheme();


  return (
    <Dialog
      open={isEditing}
      onClose={() => setIsEditing(false)}
      fullWidth
      maxWidth="md"
      TransitionProps={{
        onEnter: () => document.body.style.overflow = 'hidden',
        onExited: () => document.body.style.overflow = 'auto',
      }}
      className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
    >
      <DialogTitle sx={{ bgcolor: "primary.main", color: "white", textAlign: "center", borderRadius: "8px 8px 0 0" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{selectedForm?._id ? "Edit Discharge Form" : "Create New Discharge Form"}</Typography>
          <IconButton onClick={() => setIsEditing(false)} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>

          {/* Final Diagnosis */}
          <TextField
            label="Final Diagnosis"
            name="finalDiagnosis"
            fullWidth
            variant="outlined"
            value={selectedForm?.finalDiagnosis || ""}
            onChange={handleChange}
            sx={{
              borderRadius: 2,
              '& .MuiInputBase-root': {
                borderRadius: 2,
                boxShadow: 1,
              }
            }}
          />

          {/* Discharge Instructions */}
          <TextField
            label="Discharge Instructions"
            name="dischargeInstructions"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={selectedForm?.dischargeInstructions || ""}
            onChange={handleChange}
            sx={{
              borderRadius: 2,
              '& .MuiInputBase-root': {
                borderRadius: 2,
                boxShadow: 1,
              }
            }}
          />

          {/* Medications on Discharge */}
          <TextField
  label="Medications on Discharge"
  name="medicationsOnDischarge"
  fullWidth
  variant="outlined"
  value={selectedForm?.medicationsOnDischarge?.join(", ") || ""}
  onChange={(e) =>
    setFormData({
      ...selectedForm,
      medicationsOnDischarge: e.target.value.split(", "),
    } as DischargeForm)
  }
  sx={{
    borderRadius: 2,
    '& .MuiInputBase-root': {
      borderRadius: 2,
      boxShadow: 1,
    }
  }}
/>
          {/* Follow-up Appointments */}
          <Typography variant="h6" sx={{ mt: 2 }}>Follow-up Appointments</Typography>
          {selectedForm?.followUpAppointments?.map((appointment, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={appointment.date}
                  onChange={(e) => {
                    const newAppointments = [...selectedForm.followUpAppointments];
                    newAppointments[index].date = e.target.value;
                    setFormData({ ...selectedForm, followUpAppointments: newAppointments } as DischargeForm);
                  }}
                  sx={{
                    borderRadius: 2,
                    '& .MuiInputBase-root': {
                      borderRadius: 2,
                      boxShadow: 1,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Reason"
                  fullWidth
                  variant="outlined"
                  value={appointment.reason}
                  onChange={(e) => {
                    const newAppointments = [...selectedForm.followUpAppointments];
                    newAppointments[index].reason = e.target.value;
                    setFormData({ ...selectedForm, followUpAppointments: newAppointments } as DischargeForm);
                  }}
                  sx={{
                    borderRadius: 2,
                    '& .MuiInputBase-root': {
                      borderRadius: 2,
                      boxShadow: 1,
                    }
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
            variant="outlined"
            value={selectedForm?.doctorNotes || ""}
            onChange={handleChange}
            sx={{
              borderRadius: 2,
              '& .MuiInputBase-root': {
                borderRadius: 2,
                boxShadow: 1,
              }
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button onClick={() => setIsEditing(false)} color="inherit" sx={{ borderRadius: 2 }}>Cancel</Button>
        <Stack direction="row" spacing={2}>
          {selectedForm?._id ? (
            <Button onClick={handleUpdate} color="primary" variant="contained" sx={{ borderRadius: 2 }}>Update</Button>
          ) : (
            <Button onClick={handleSubmit} color="primary" variant="contained" sx={{ borderRadius: 2 }}>Create</Button>
          )}
          {selectedForm?._id && (
            <Button variant="contained" color="error" onClick={() => handleDelete(selectedForm._id!)} sx={{ borderRadius: 2 }}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );};

export default DischargeFormDialog;