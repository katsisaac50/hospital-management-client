import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Select, MenuItem, FormControl, InputLabel, TextField, CircularProgress, Button, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { toast } from "react-toastify"; // Import toast

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

const LaboratoryPage = ({ patientId }: { patientId: string | number }) => {
  const queryClient = useQueryClient();
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  const { data: availableTests = [], isLoading, error } = useQuery<Test[]>({
    queryKey: ["medicalTests"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/medicaltests`);
      return data;
    },
  });

  const { data: testResults = [] } = useQuery<TestResult[]>({
    queryKey: ["testResults", patientId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/medicalTestResults?patientId=${patientId}`);
      return data;
    },
  });

  const saveTestResultMutation = useMutation({
    mutationFn: async (newTestResult: { patientId: string | number; testId: string; result: string }) => {
      const { data } = await axios.post(`${API_URL}/medicalTestResults`, newTestResult);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["testResults", patientId] as const);
      toast.success("Test result saved successfully!"); // Show success toast
    },
    onError: (error) => {
      toast.error("Error saving test result."); // Show error toast
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(schema),
  });

  // Use useEffect to set testId when selectedTest changes
  useEffect(() => {
    if (selectedTest) {
      setValue("testId", selectedTest._id); // Update the testId value in the form
    }
  }, [selectedTest, setValue]);

  const onSubmit = (data: { testId: string; result: string }) => {
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