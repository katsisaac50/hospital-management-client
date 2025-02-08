import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Select, MenuItem, FormControl, InputLabel, TextField, CircularProgress, Button, Card, CardContent, CardHeader, Typography } from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const schema = z.object({
  testId: z.string().nonempty("Test is required"),
  result: z.string().nonempty("Result is required"),
});

const LaboratoryPage = ({ patientId }) => {
  const queryClient = useQueryClient();
  const [selectedTest, setSelectedTest] = useState(null);

  // Fetch available tests
  const { data: availableTests = [], isLoading, error } = useQuery({
    queryKey: ["medicalTests"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/medicaltests`);
      return data;
    },
  });

  // Fetch test results
  const { data: testResults = [] } = useQuery({
    queryKey: ["testResults", patientId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/medicalTestResults?patientId=${patientId}`);
      return data;
    },
  });

  // Mutation to save test results
  const saveTestResultMutation = useMutation({
    mutationFn: async (newTestResult) => {
      const { data } = await axios.post(`${API_URL}/medicalTestResults`, newTestResult);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["testResults", patientId]);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
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
            {/* Test Selection */}
            <FormControl fullWidth>
              <InputLabel>Select a Test</InputLabel>
              <Select
                value={selectedTest ? selectedTest._id : ""}
                onChange={(e) => setSelectedTest(availableTests.find((t) => t._id === e.target.value))}
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

            {/* Display test details */}
            {selectedTest && (
              <div className="text-sm text-gray-700">
                <p><strong>Reference:</strong> {selectedTest.referenceValue}</p>
                <p><strong>Unit:</strong> {selectedTest.unit}</p>
                <p><strong>Category:</strong> {selectedTest.category}</p>
              </div>
            )}

            {/* Result Input */}
            <TextField
              fullWidth
              label="Enter result"
              {...register("result")}
              error={!!errors.result}
              helperText={errors.result?.message}
            />

            {/* Submit Button */}
            <Button type="submit" variant="contained" disabled={saveTestResultMutation.isLoading}>
              {saveTestResultMutation.isLoading ? <CircularProgress size={24} /> : "Save Test Result"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
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
