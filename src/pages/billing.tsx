import ProtectedRoute from "../components/ProtectedRoute";

const BillingPage = () => {
  return (
    <ProtectedRoute allowedRoles={["admin", "doctor"]}>
      <h1>Billing & Insurance</h1>
    </ProtectedRoute>
  );
};

export default BillingPage;
