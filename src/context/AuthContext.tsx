// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// interface User {
//   username: string;
//   role: "admin" | "doctor" | "labTechnician" | "guest";
// }

// interface AuthContextProps {
//   user: User | null;
//   setUser: (user: User | null) => void;
// }

// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true); // Track loading state

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser)); // Load user from storage
//     }
//     setLoading(false); // Mark loading as complete
//   }, []);

//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user)); // Save user when it changes
//     } else {
//       localStorage.removeItem("user");
//     }
//   }, [user]);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {!loading && children} {/* Prevent rendering until loading is done */}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };