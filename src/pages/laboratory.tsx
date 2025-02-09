import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Select, MenuItem, FormControl, InputLabel, TextField, CircularProgress, Button, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAppContext } from "../context/AppContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const schema = z.object({
  testId: z.string().nonempty("Test is required"),
  result: z.string().nonempty("Result is required"),
});

interface Test {
  _id: string;
  testName: string;
  referenceValue: string;
  unit: string;
  category: string;
}

interface TestResult {
  test: { testName: string };
  result: string;
  date: string;
}

const LaboratoryPage = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const queryClient = useQueryClient();
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);

  // Ensure patientId is set when available
  useEffect(() => {
    if (router.query.patientId) {
      setPatientId(router.query.patientId as string);
    }
  }, [router.query.patientId]);

  if (!patientId || user?.role !== "labTechnician") {
    return <p>Access Denied</p>;
  }

  // Fetch available tests
  const { data: availableTests = [], isLoading, error } = useQuery<Test[]>({
    queryKey: ["medicalTests"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/medicaltests`);
      return data;
    },
  });

  // Fetch test results for the patient
  const { data: testResults = [] } = useQuery<TestResult[]>({
    queryKey: ["testResults", patientId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/medicalTestResults?patientId=${patientId}`);
      return data;
    },
    enabled: !!patientId, // Only fetch if patientId is available
  });

  // Save test result mutation
  const saveTestResultMutation = useMutation({
    mutationFn: async (newTestResult: { patientId: string; testId: string; result: string }) => {
      const { data } = await axios.post(`${API_URL}/medicalTestResults`, newTestResult);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["testResults", patientId] as const);
      toast.success("Test result saved successfully!");
    },
    onError: () => {
      toast.error("Error saving test result.");
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (selectedTest) {
      setValue("testId", selectedTest._id);
    }
  }, [selectedTest, setValue]);

  const onSubmit = (data: { testId: string; result: string }) => {
    if (!patientId) {
      toast.error("Patient ID is missing.");
      return;
    }
    console.log("Submitting test result with patientId:", patientId); // Debugging log
    saveTestResultMutation.mutate({ patientId, ...data });
    reset();
    setSelectedTest(null);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader title={<Typography variant="h6">Laboratory Test Entry</Typography>} />
        <CardContent>
          {isLoading && <CircularProgress />}
          {error && <p className="text-red-500">Error loading tests.</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormControl fullWidth>
              <InputLabel>Select a Test</InputLabel>
              <Select
                value={selectedTest ? selectedTest._id : ""}
                onChange={(e) => setSelectedTest(availableTests.find((t) => t._id === e.target.value) || null)}
                label="Select a Test"
              >
                {availableTests.map((test) => (
                  <MenuItem key={test._id} value={test._id}>
                    {test.testName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.testId && <p className="text-red-500">{errors.testId.message}</p>}

            {selectedTest && (
              <div className="text-sm text-gray-700">
                <p><strong>Reference:</strong> {selectedTest.referenceValue}</p>
                <p><strong>Unit:</strong> {selectedTest.unit}</p>
                <p><strong>Category:</strong> {selectedTest.category}</p>
              </div>
            )}

            <TextField
              fullWidth
              label="Enter result"
              {...register("result")}
              error={!!errors.result}
              helperText={errors.result?.message}
            />

            <Button type="submit" variant="contained" disabled={saveTestResultMutation.isLoading}>
              {saveTestResultMutation.isLoading ? <CircularProgress size={24} /> : "Save Test Result"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Typography variant="h6">Test Results</Typography>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {testResults.map((testResult, index) => (
              <li key={index} className="border p-2 rounded-md">
                <p><strong>{testResult.test.testName}</strong></p>
                <p>Result: {testResult.result} ({testResult.date})</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaboratoryPage;