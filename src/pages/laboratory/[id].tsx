import { useState, useEffect, useMemo } from "react";
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
  TextField,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import AddTestResultModal from "./../../components/addTestResultModal";



const LabTechnicianPatientPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const [token, setToken] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTest, setNewTest] = useState("");
  const [newResult, setNewResult] = useState("");
  const [availableTests, setAvailableTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tests, setTests] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!id) return;

    if (typeof window !== "undefined") {
      const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];
      setToken(authToken || "");
    }
  }, [id]);

  // Fetch test history
  const { data: testHistory = [], isLoading } = useQuery({
    queryKey: ["testHistory", id],
    queryFn: async () => {
      if (!id) return [];
      const { data } = await axios.get(`${API_URL}/medicalTestResults/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { patientId: id },
      });
      console.log(data)
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
    enabled: !!id && !!token,
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

      const payload = { patientId: id, testId: newTest, result: newResult };
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

  const handleUpdateStatus = async (newStatus,testId ) => {
    console.log(testId, newStatus)
    try {
      const response = await fetch(`${API_URL}/update-status/${testId.row._id}`, {
        method: 'PUT',
        body: JSON.stringify({ testStatus: newStatus.target.value }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Optionally, update the local state to reflect the change immediately
        const updatedTests = tests.map((test) =>
          test._id === testId ? { ...test, testStatus: newStatus } : test
        );
        setTests(updatedTests);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Mutation for updating a test result
  const updateTestMutation = useMutation({
    mutationFn: async (params) => {
      await axios.put(
        `${API_URL}/medicalTestResults/${params.row._id}`,
        { result: params.row.result, testId: params.row._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      queryClient.invalidateQueries(["testHistory", id]);
      toast.success("Test result updated!");
    },
  });

  // Mutation for deleting a test result
  const deleteTestMutation = useMutation({
    mutationFn: async (params) => {
      const testId = params.row._id;

      await axios.delete(`${API_URL}/medicalTestResults/${testId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      queryClient.invalidateQueries(["testHistory", id]);
      toast.success("Test result deleted!");
    },
  });

  // Filtered test history based on search term and date range
  const filteredTestHistory = useMemo(() => {
    let filtered = testHistory;

    if (searchTerm) {
      filtered = filtered.filter((test) =>
        test.testId.testName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter(
        (test) =>
          dayjs(test.collectionDate).isAfter(dayjs(startDate)) &&
          dayjs(test.collectionDate).isBefore(dayjs(endDate))
      );
    }

    return filtered;
  }, [testHistory, searchTerm, startDate, endDate]);

  const columns = useMemo(
    () => [
      {
        field: "testId.testName",
        headerName: "Test Name",
        flex: 1,
        valueGetter: (value, row) => `${row.testId.testName || "N/A"}`,
      },
      {
        field: "result",
        headerName: "Result",
        flex: 1,
        editable: true,
      },
      {
        field: "testId.referenceValue",
        headerName: "Reference",
        flex: 1,
        valueGetter: (value, row) => `${row.testId.referenceValue || "N/A"}`,
      },
      {
        field: "testStatus",
        headerName: "Status",
        flex: 1,
        editable: true, 
        renderCell: (value, row) => (
          <Select
            value={value.row.testStatus}
            onChange={(e) => handleUpdateStatus(e, value)}
            fullWidth
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        ),
      },
      {
        field: "date",
        headerName: "Date",
        flex: 1,
        valueFormatter: (value, row) =>
          row.date ? dayjs(row.date).format("YYYY-MM-DD") : "N/A",
      },
      {
        field: "testNotes",
        headerName: "Doctor's Notes",
        flex: 1,
      },
      {
        field: "diagnosisHypothesis",
        headerName: "Diagnosis",
        flex: 1,
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: (params) => (
          <>
            <IconButton onClick={() => updateTestMutation.mutate(params)} color="primary">
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => deleteTestMutation.mutate(params)}
              color="secondary"
            >
              <Delete />
            </IconButton>
          </>
        ),
      },
    ],
    [deleteTestMutation]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader title="Patient Information" />
          <CardContent>
            {isPatientLoading ? (
              <CircularProgress />
            ) : (
              <div>
                <Typography>
                  <strong>Patient ID:</strong> {patientData.patientID}
                </Typography>
                <Typography>
                  <strong>Full Name:</strong> {patientData.name}
                </Typography>
                <Typography>
                  <strong>Date of Birth:</strong>{" "}
                  {dayjs(patientData.dob).format("YYYY-MM-DD")}
                </Typography>
                <Typography>
                  <strong>Gender:</strong> {patientData.gender}
                </Typography>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Test History" />
          <CardContent>
            <div className="flex gap-4 mb-4">
              <TextField
                label="Search Test Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
              />
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newDate) => setStartDate(newDate)}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newDate) => setEndDate(newDate)}
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsModalOpen(true)}
              sx={{ my: 2 }}
            >
              Add Test Result
            </Button>
            {isLoading ? (
              <CircularProgress />
            ) : !testHistory || testHistory.length === 0 ? (
              <Typography>No test history available.</Typography>
            ) : (
              <DataGrid
                rows={filteredTestHistory}
                pagination
                paginationMode="server"
                rowCount={filteredTestHistory?.length ?? 0}
                getRowId={(row) => row._id}
                columns={columns}
                pageSize={10}
                autoHeight
              />
            )}
          </CardContent>
        </Card>
         {/* Modal for Adding New Test */}
         <AddTestResultModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  availableTests={availableTests}
  newTest={newTest}
  setNewTest={setNewTest}
  newResult={newResult}
  setNewResult={setNewResult}
  addTestMutation={addTestMutation}
/>
      </div>
    </LocalizationProvider>
  );
};

export default LabTechnicianPatientPage;