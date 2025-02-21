import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import { useAppContext } from "../../context/AppContext";


const testOptions = ["Blood Test", "X-ray", "Urinalysis", "MRI", "CT Scan"];

const LabRequestForm = ({ open, onClose, onSubmit, selectedPatient }) => {
  const { theme } = useTheme();
  const { user, setUser } = useAppContext();
  console.log(selectedPatient?._id)
  const [formData, setFormData] = useState({
    testName: "",
    testNotes: "",
    diagnosisHypothesis: "",
    sampleType: "",
    sampleCollectionDate: "",
    patientId: "", 
    doctorId: user?._id, 
  });

   // Ensure patientId is updated when selectedPatient changes
   useEffect(() => {
    if (selectedPatient?._id) {
      setFormData((prevState) => ({
        ...prevState,
        patientId: selectedPatient._id, // Update patientId if selectedPatient is available
      }));
    }
  }, [selectedPatient]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
        Request Lab Test
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <TextField
            select
            label="Select Test"
            name="testName"
            value={formData.testName}
            onChange={handleChange}
            fullWidth
          >
            {testOptions.map((test) => (
              <MenuItem key={test} value={test}>
                {test}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Special Instructions"
            name="testNotes"
            fullWidth
            multiline
            rows={3}
            value={formData.testNotes}
            onChange={handleChange}
          />
          <TextField
            label="Diagnosis Hypothesis"
            name="diagnosisHypothesis"
            fullWidth
            multiline
            rows={2}
            value={formData.diagnosisHypothesis}
            onChange={handleChange}
          />
          <TextField
            label="Sample Type"
            name="sampleType"
            fullWidth
            value={formData.sampleType}
            onChange={handleChange}
          />
          <TextField
            label="Sample Collection Date"
            name="sampleCollectionDate"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.sampleCollectionDate}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LabRequestForm;
