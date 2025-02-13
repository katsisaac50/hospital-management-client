import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const LabTechnicianPatientPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAppContext();
  const queryClient = useQueryClient();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (user && user.role !== "labTechnician") {
      toast.error("Access denied");
      router.push("/"); // Redirect unauthorized users
    }
  }, [user, router]);

  // Fetch single patient instead of treating it as an array
  const { data: patient, isLoading: loadingPatient, error: patientError } = useQuery({
    queryKey: ["patient", id],
    queryFn: async () => {
      if (!id) return null; // Prevent unnecessary fetches

      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("authToken="))
          ?.split("=")[1];

        const { data } = await axios.get(`${API_URL}/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        return data;
      } catch (error) {
        console.error("Error fetching patient:", error);
        throw new Error("Failed to load patient data");
      }
    },
    enabled: !!id, // Only fetch if `id` exists
  });

  const { data: tests = [], isLoading: loadingTests, error: testError } = useQuery({
    queryKey: ["medicalTests"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${API_URL}/medicaltests`);
        return data;
      } catch (error) {
        console.error("Error fetching tests:", error);
        throw new Error("Failed to load medical tests");
      }
    },
  });

  const saveTestMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPatient || !selectedTest || !result) {
        toast.error("All fields are required");
        return;
      }

      try {
        const payload = {
          patientId: selectedPatient._id,
          testId: selectedTest._id,
          result,
        };

        await axios.post(`${API_URL}/medicalTestResults`, payload);

        toast.success("Test result saved successfully");
        queryClient.invalidateQueries(["testResults"]);
        setOpenModal(false);
        setResult("");
      } catch (error) {
        console.error("Error saving test result:", error);
        toast.error("Failed to save test result");
      }
    },
  });

  console.log(selectedPatient)

  if (!id) return <p>Invalid Patient ID</p>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader title={<Typography variant="h6">Patient Details</Typography>} />
        <CardContent>
          {loadingPatient ? (
            <CircularProgress />
          ) : patientError ? (
            <Typography color="error">Error loading patient</Typography>
          ) : (
            patient && (
              <div className="border p-4 rounded-md">
                <Typography variant="h6">{patient.name}</Typography>
                <Typography>Age: {patient.age}</Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSelectedPatient(patient);
                    setOpenModal(true);
                  }}
                >
                  Enter Test Result
                </Button>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Test Entry Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Enter Test Result</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Patient: {selectedPatient?.fullName}</Typography>
          {loadingTests ? (
            <CircularProgress />
          ) : testError ? (
            <Typography color="error">Error loading tests</Typography>
          ) : (
            <Select
              fullWidth
              value={selectedTest ? selectedTest._id : ""}
              onChange={(e) => setSelectedTest(tests.find((t) => t._id === e.target.value))}
            >
              {tests.map((test) => (
                <MenuItem key={test._id} value={test._id}>
                  {test.testName}
                </MenuItem>
              ))}
            </Select>
          )}
          <TextField
            fullWidth
            label="Result"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={() => saveTestMutation.mutate()} disabled={saveTestMutation.isLoading}>
            {saveTestMutation.isLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LabTechnicianPatientPage;
