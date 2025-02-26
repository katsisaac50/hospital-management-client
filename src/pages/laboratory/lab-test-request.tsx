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


// const testOptions = ["Blood Test", "X-ray", "Urinalysis", "MRI", "CT Scan"];
const testOptions = ["Blood Pressure", "Glucose Level", "Cholesterol", "Hemoglobin"];

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
    <Dialog className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
        Request Lab Test
      </DialogTitle>
      <DialogContent sx={{ p: 3, bgcolor: theme === "dark" ? "rgba(20, 20, 20, 0.9)" : "rgba(255, 255, 255, 0.9)",
            color: theme === "dark" ? "white" : "#2196F3"}}>
        <Stack spacing={3} marginTop={2}>
        <TextField
  select
  label="Select Test"
  name="testName"
  value={formData.testName}
  onChange={handleChange}
  fullWidth
  variant="outlined"
  sx={{
    marginTop: "",
    bgcolor: theme === "dark" ? "rgba(50, 50, 50, 0.8)" : "white", // Transparent background for input fields
    color: theme === "dark" ? "white" : "black", // Text color for inputs
    fontSize: "1rem", // Adjust input text size
    "& .MuiSelect-root": {
      color: theme === "dark" ? "white" : "black", // Color for selected text
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme === "dark" ? "white" : "black", // Border color
    },
  }}
  inputProps={{
    style: {
      color: theme === "dark" ? "white" : "black", // Change text color inside input fields
      fontSize: "1rem", // Font size inside input
    },
  }}
  InputLabelProps={{
    style: {
      color: theme === "dark" ? "white" : "black", // Change label color
      fontSize: "1rem", // Font size for the label
    },
  }}
>
  {testOptions.map((test) => (
    <MenuItem key={test} value={test} sx={{
      fontSize: "1rem", // Set the font size for each menu item
      color: theme === "dark" ? "white" : "black", // Adjust the text color based on the theme
      backgroundColor: theme === "dark" ? "rgba(50, 50, 50, 0.8)" : "white", // Optional background color for the items
      '&:hover': {
        backgroundColor: theme === "dark" ? "rgba(80, 80, 80, 0.8)" : "#f0f0f0", // Hover effect for each menu item
      },
    }}>
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
            sx={{
              bgcolor: theme === "dark" ? "rgba(50, 50, 50, 0.8)" : "white", // Transparent background for input fields
              color: theme === "dark" ? "white" : "black", // Text color for inputs
              fontSize: "1rem", // Adjust input text size
            }}
            inputProps={{
              style: {
                color: theme === "dark" ? "white" : "black", // Change text color inside text fields
                fontSize: "1rem", // Font size inside input
              },
            }}
            InputLabelProps={{
              style: {
                color: theme === "dark" ? "white" : "black", // Change label color
                fontSize: "1rem", // Font size for the label
              },
            }}
          />
          <TextField
            label="Diagnosis Hypothesis"
            name="diagnosisHypothesis"
            fullWidth
            multiline
            rows={2}
            value={formData.diagnosisHypothesis}
            onChange={handleChange}
            sx={{
              borderRadius: "15px",
              bgcolor: theme === "dark" ? "rgba(50, 50, 50, 0.8)" : "white", // Transparent background for input fields
              color: theme === "dark" ? "white" : "black", // Text color for inputs
              fontSize: "1rem", // Adjust input text size
            }}
            inputProps={{
              style: {
                color: theme === "dark" ? "white" : "black", // Change text color inside text fields
                fontSize: "1rem", // Font size inside input
              },
            }}
            InputLabelProps={{
              style: {
                color: theme === "dark" ? "white" : "black", // Change label color
                fontSize: "1rem", // Font size for the label
              },
            }}
          />
          <TextField
            label="Sample Type"
            name="sampleType"
            fullWidth
            value={formData.sampleType}
            onChange={handleChange}
            sx={{
              borderRadius: "15px",
              bgcolor: theme === "dark" ? "rgba(50, 50, 50, 0.8)" : "white", // Transparent background for input fields
              color: theme === "dark" ? "white" : "black", // Text color for inputs
              fontSize: "1rem", // Adjust input text size
            }}
            inputProps={{
              style: {
                color: theme === "dark" ? "white" : "black", // Change text color inside text fields
                fontSize: "1rem", // Font size inside input
              },
            }}
            InputLabelProps={{
              style: {
                color: theme === "dark" ? "white" : "black", // Change label color
                fontSize: "1rem", // Font size for the label
              },
            }}
          /><TextField
          label="Sample Collection Date"
          name="sampleCollectionDate"
          type="datetime-local"
          fullWidth
          value={formData.sampleCollectionDate}
          onChange={handleChange}
          sx={{
            bgcolor: theme === "dark" ? "rgba(50, 50, 50, 0.8)" : "white", // Background color based on theme
            color: theme === "dark" ? "white" : "black", // Text color for the input
            "& .MuiInputBase-root": {
              color: theme === "dark" ? "white" : "black", // Text color inside the input field
            },
            "& .MuiInputLabel-root": {
              color: theme === "dark" ? "white" : "black", // Label color based on theme
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme === "dark" ? "white" : "black", // Border color based on theme
            },
            fontSize: "1rem", // Font size for the text field
          }}
          inputProps={{
            style: {
              fontSize: "1rem", // Font size inside input
            },
          }}
          InputLabelProps={{
            style: {
              fontSize: "1rem", // Font size for label
            },
            shrink: true, // Ensures the label stays above the placeholder
          }}
        
        />
        
        
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: theme === "dark" ? "rgba(50, 50, 50, 0.8)" : "white", // Background color based on theme
    color: theme === "dark" ? "white" : "black", }}>
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
