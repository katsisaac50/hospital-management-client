import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { 
  TextField, Button, Grid, Typography, Container, Box, CircularProgress, Paper 
} from "@mui/material";
import { useTheme } from "@mui/material/styles"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DischargeForm = () => {
  const router = useRouter();
  const theme = useTheme(); // Get global theme
  const [saving, setSaving] = useState(false);
  const { patientId } = router.query;

  const [formData, setFormData] = useState({
    finalDiagnosis: "",
    medicationsOnDischarge: [],
    followUpAppointments: [{ date: "", reason: "" }],
    dischargeInstructions: "",
    doctorNotes: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!patientId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/discharge/${patientId}`);
        console.log(data)
        setFormData(data);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(`${API_URL}/discharge/${patientId}`, formData);
      alert("Saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  // if (loading) return <Typography>Loading...</Typography>;
  if (loading) return <Box sx={{ textAlign: "center", mt: 4 }}><CircularProgress /></Box>;


  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mt: 4,
          borderRadius: 3,
          backdropFilter: "blur(10px)",
          // backgroundColor:
          //   theme.palette.mode === "dark"
          //     ? "rgba(240, 237, 237, 0.3)"
          //     : "rgba(255, 255, 255, 0.2)",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Discharge Summary
        </Typography>

        {error && <Typography color="error">{error}</Typography>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Final Diagnosis"
                name="finalDiagnosis"
                variant="outlined"
                fullWidth
                value={formData.finalDiagnosis}
                onChange={handleChange}
                sx={{ bgcolor: "transparent", color: "inherit" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Medications on Discharge"
                name="medicationsOnDischarge"
                variant="outlined"
                fullWidth
                value={formData.medicationsOnDischarge?.join(", ") || ""}
                onChange={(e) =>
                  handleChange({
                    target: { name: "medicationsOnDischarge", value: e.target.value.split(", ") },
                  })
                }
                sx={{ bgcolor: "transparent", color: "inherit" }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Follow-up Appointments</Typography>
              {formData.followUpAppointments.map((appointment, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      type="date"
                      name="date"
                      variant="outlined"
                      fullWidth
                      value={appointment.date}
                      onChange={(e) =>
                        setFormData((prev) => {
                          const newAppointments = [...prev.followUpAppointments];
                          newAppointments[index].date = e.target.value;
                          return { ...prev, followUpAppointments: newAppointments };
                        })
                      }
                      sx={{ bgcolor: "transparent", color: "inherit" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Reason"
                      name="reason"
                      variant="outlined"
                      fullWidth
                      value={appointment.reason}
                      onChange={(e) =>
                        setFormData((prev) => {
                          const newAppointments = [...prev.followUpAppointments];
                          newAppointments[index].reason = e.target.value;
                          return { ...prev, followUpAppointments: newAppointments };
                        })
                      }
                      sx={{ bgcolor: "transparent", color: "inherit" }}
                    />
                  </Grid>
                </Grid>
              ))}
              <Button variant="outlined" color="secondary" fullWidth onClick={() => {
                if (
                    formData.followUpAppointments.some(
                      (app) => !app.date || !app.reason
                    )
                  ) {
                    alert("Please fill in the existing appointment before adding a new one.");
                    return;
                  }
                setFormData((prev) => ({
                  ...prev,
                  followUpAppointments: [...prev.followUpAppointments, { date: "", reason: "" }],
                }));
              }} sx={{ mb: 2 }}>
                + Add Follow-up Appointment
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Discharge Instructions"
                name="dischargeInstructions"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={formData.dischargeInstructions}
                onChange={handleChange}
                sx={{ bgcolor: "transparent", color: "inherit" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Doctor's Notes"
                name="doctorNotes"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={formData.doctorNotes}
                onChange={handleChange}
                sx={{ bgcolor: "transparent", color: "inherit" }}
              />
            </Grid>

            <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }} disabled={saving}>
              {saving ? "Saving..." : "Save Discharge Form"}
            </Button>
            </Grid>
          </Grid>
        </Box>
        {formData && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Existing Discharge Summary</Typography>
            <Typography><strong>Final Diagnosis:</strong> {formData.finalDiagnosis}</Typography>
            <Typography><strong>Medications on Discharge:</strong> {formData.medicationsOnDischarge.join(', ')}</Typography>
            <Typography><strong>Follow-up Appointments:</strong></Typography>
            {formData.followUpAppointments.map((appointment, index) => (
              <Typography key={index}>
                {appointment.date} - {appointment.reason}
              </Typography>
            ))}
            <Typography><strong>Discharge Instructions:</strong> {formData.dischargeInstructions}</Typography>
            <Typography><strong>Doctor's Notes:</strong> {formData.doctorNotes}</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default DischargeForm;
