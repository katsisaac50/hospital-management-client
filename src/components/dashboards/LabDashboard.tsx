import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";
import ProtectedRoute from "../ProtectedRoute";

const LabDashboard = () => {
  const { user } = useAppContext();
  
  const { data: testResults = [], isLoading } = useQuery(["labResults"], async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/labResults`);
    return data;
  });

  return (
    <div>
        <ProtectedRoute allowedRoles={["labTechnician"]}>
      <h2>Lab Technician Dashboard</h2>
      <p>Welcome, {user?.fullName}</p>

      {isLoading ? <p>Loading...</p> : (
        <ul>
          {testResults.map((result) => (
            <li key={result._id}>
              <strong>{result.testName}:</strong> {result.result}
            </li>
          ))}
        </ul>
      )}

    </div>
  );
};

export default LabDashboard;
