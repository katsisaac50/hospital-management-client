import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const LabTechnicianPatientPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [filteredTests, setFilteredTests] = useState([]);

  console.log("Selected Test:", selectedTest);
  console.log("Filtered Tests:", filteredTests);

  const { data: testHistory = [], isLoading } = useQuery({
    queryKey: ["testHistory", id],
    queryFn: async () => {
      if (!id) return [];
      const { data } = await axios.get(`${API_URL}/medicalTestResults?patientId=${id}`);
      return data;
    },
  });

  const { data: patientData = {}, isLoading: isPatientLoading } = useQuery({
    queryKey: ["patient", id],
    queryFn: async () => {
      if (!id) return {};

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];
        
      const { data } = await axios.get(`${API_URL}/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  useEffect(() => {
    let filtered = testHistory;

    if (searchTerm) {
      filtered = filtered.filter((test) =>
        test.testName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTest) {
      filtered = filtered.filter((test) => test.testName === selectedTest);
    }

    if (startDate && endDate) {
      filtered = filtered.filter(
        (test) =>
          dayjs(test.collectionDate).isAfter(dayjs(startDate)) &&
          dayjs(test.collectionDate).isBefore(dayjs(endDate))
      );
    }

    setFilteredTests(filtered);
  }, [testHistory, searchTerm, selectedTest, startDate, endDate]);

  const getStatusColor = (result, reference) => {
    if (!reference) return "black";
    const [min, max] = reference.split("-").map(Number);
    const value = parseFloat(result);
    if (isNaN(value)) return "black";
    if (value < min) return "red";
    if (value > max) return "red";
    if (value === min || value === max) return "yellow";
    return "green";
  };
  console.log(patientData);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader title={<Typography variant="h6">Patient Information</Typography>} />
        <CardContent>
          {isPatientLoading ? (
            <CircularProgress />
          ) : (
            <div className="mb-4">
              <Typography variant="body1"><strong>Patient ID:</strong> {patientData.patientId}</Typography>
              <Typography variant="body1"><strong>Full Name:</strong> {patientData.name}</Typography>
              <Typography variant="body1"><strong>Date of Birth:</strong> {dayjs(patientData.dateOfBirth).format("YYYY-MM-DD")}</Typography>
              <Typography variant="body1"><strong>Gender:</strong> {patientData.gender}</Typography>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader title={<Typography variant="h6">Test History Overview</Typography>} />
        <CardContent>
          {isLoading ? (
            <CircularProgress />
          ) : testHistory.length === 0 ? (
            <Typography>No previous test results available.</Typography>
          ) : (
            <>
              <div className="flex gap-4 mb-4">
                <TextField
                  label="Search by Test Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                />
                <Select
                  value={selectedTest}
                  onChange={(e) => setSelectedTest(e.target.value)}
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="">All Tests</MenuItem>
                  {[...new Set(testHistory.map((t) => t.testName))].map((test) => (
                    <MenuItem key={test} value={test}>
                      {test}
                    </MenuItem>
                  ))}
                </Select>
                <DatePicker label="Start Date" value={startDate} onChange={(newDate) => setStartDate(newDate)} />
                <DatePicker label="End Date" value={endDate} onChange={(newDate) => setEndDate(newDate)} />
              </div>
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
                  {filteredTests.map((test) => (
                    <TableRow key={test._id}>
                      <TableCell>{test.testName}</TableCell>
                      <TableCell>{test.result}</TableCell>
                      <TableCell>{test.referenceValues || "N/A"}</TableCell>
                      <TableCell style={{ color: getStatusColor(test.result, test.referenceValues) }}>
                        {getStatusColor(test.result, test.referenceValues) === "green" ? "✅ Normal" :
                          getStatusColor(test.result, test.referenceValues) === "yellow" ? "⚠️ Borderline" :
                          "🔴 Abnormal"}
                      </TableCell>
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
    </div>
  );
};

export default LabTechnicianPatientPage;
