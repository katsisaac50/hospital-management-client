import { useEffect, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Select,
  MenuItem,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const LabTechnicianPatientPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [token, setToken] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTest, setNewTest] = useState("");
  const [newResult, setNewResult] = useState("");
  const [availableTests, setAvailableTests] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];
      setToken(authToken || "");
    }
  }, []);

  // Fetch test history
  const { data: testHistory = [], isLoading } = useQuery({
    queryKey: ["testHistory", id],
    queryFn: async () => {
      if (!id) return [];
      const { data } = await axios.get(`${API_URL}/medicalTestResults?patientId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: !!id,
  });

  // Fetch patient details
  const { data: patientData = {}, isLoading: isPatientLoading } = useQuery({
    queryKey: ["patient", id],
    queryFn: async () => {
      if (!id) return {};
      const { data } = await axios.get(`${API_URL}/patients/lab/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: !!id,
  });

  // Fetch available tests for the modal
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/medicaltests`);
        setAvailableTests(data);
      } catch (error) {
        toast.error("Failed to fetch test list");
      }
    };

    fetchTests();
  }, []);

  // Mutation for adding a new test result
  const addTestMutation = useMutation({
    mutationFn: async () => {
      if (!newTest || !newResult) {
        toast.error("Please select a test and enter a result");
        return;
      }

      const payload = {
        patientId: id,
        testId: newTest,
        result: newResult,
      };

      await axios.post(`${API_URL}/medicalTestResults/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("New test result added!");
      setIsModalOpen(false);
      setNewTest("");
      setNewResult("");
      queryClient.invalidateQueries(["testHistory", id]);
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className="p-6 space-y-6">
      {/* Patient Information */}
      <Card>
        <CardHeader title={<Typography variant="h6">Patient Information</Typography>} />
        <CardContent>
          {isPatientLoading ? (
            <CircularProgress />
          ) : (
            <div>
              <Typography><strong>Patient ID:</strong> {patientData.patientID}</Typography>
              <Typography><strong>Full Name:</strong> {patientData.name}</Typography>
              <Typography><strong>Date of Birth:</strong> {dayjs(patientData.dob).format("YYYY-MM-DD")}</Typography>
              <Typography><strong>Gender:</strong> {patientData.gender}</Typography>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test History */}
      <Card>
        <CardHeader title={<Typography variant="h6">Test History Overview</Typography>} />
        <CardContent>
          {isLoading ? (
            <CircularProgress />
          ) : testHistory.length === 0 ? (
            <Typography>No previous test results available.</Typography>
          ) : (
            <>
              {/* Filters */}
              <div className="flex gap-4 mb-4">
                <TextField label="Search by Test Name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} fullWidth />
                <Select value={selectedTest} onChange={(e) => setSelectedTest(e.target.value)} displayEmpty fullWidth>
                  <MenuItem value="">All Tests</MenuItem>
                  {console.log(testHistory)}
                  {[...new Set(testHistory.map((t) => t.testId.testName))].map((test) => (
                    <MenuItem key={id} value={test}>{test}</MenuItem>
                  ))}
                </Select>
                <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
                <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
              </div>

              {/* Add Test Result Button */}
              <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
                Add Test Result
              </Button>

              {/* Test History Table */}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Test Name</TableCell>
                    <TableCell>Result</TableCell>
                    <TableCell>Reference</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Doctor's Notes</TableCell>
                    <TableCell>Diagnosis Hypothesis</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((test) => (
                    <TableRow key={test._id}>
                      <TableCell>{test.testId.testName}</TableCell>
                      <TableCell>{test.result} {test.testId.unit}</TableCell>
                      <TableCell>{test.testId.referenceValue || "N/A"}</TableCell>
                      <TableCell>{test.testStatus}</TableCell>
                      <TableCell>{dayjs(test.collectionDate).format("YYYY-MM-DD")}</TableCell>
                      <TableCell>{test.testNotes || "N/A"}</TableCell>
                      <TableCell>{test.diagnosisHypothesis || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal for Adding New Test */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Add New Test Result</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Select Test</InputLabel>
            <Select value={newTest} onChange={(e) => setNewTest(e.target.value)}>
              {availableTests.map((test) => (
                <MenuItem key={test._id} value={test._id}>{test.testName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField fullWidth label="Result" value={newResult} onChange={(e) => setNewResult(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={addTestMutation.mutate} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  </LocalizationProvider>
    
  );
};

export default LabTechnicianPatientPage;