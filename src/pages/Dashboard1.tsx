import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LabDashboard from "../components/dashboards/LabDashboard";
import DoctorDashboard from "../components/dashboards/DoctorDashboard";
import AdminDashboard from "../components/dashboards/AdminDashboard";
import CircularProgress from "@mui/material/CircularProgress";

const Dashboard = () => {
  const { user, loading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <CircularProgress />;

  return (
    <div>
      {user?.role === "labTechnician" && <LabDashboard />}
      {user?.role === "doctor" && <DoctorDashboard />}
      {user?.role === "admin" && <AdminDashboard />}
    </div>
  );
};

export default Dashboard;
