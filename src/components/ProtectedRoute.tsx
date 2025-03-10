import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

// Define the shape of your user object
interface User {
  role: string;
  // Add other user properties as needed
}

// Define the props for ProtectedRoute
interface ProtectedRouteProps {
  allowedRoles: string[];
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user } = useAppContext() as { user: User | null }; // Ensure user is typed correctly
  const router = useRouter();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, router, allowedRoles]);

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;