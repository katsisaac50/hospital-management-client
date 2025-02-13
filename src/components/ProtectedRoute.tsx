import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return user ? children : null;
};

export default ProtectedRoute;