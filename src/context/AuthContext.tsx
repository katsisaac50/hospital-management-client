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

// import { createContext, useState, useEffect } from "react";
// import { setAuthToken, removeAuthToken } from "../utils/auth";
// const API = = process.env.NEXT_PUBLIC_API_URL;

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const { data } = await API.get("/auth/me");
//         setUser(data);
//       } catch (error) {
//         console.error("Not authenticated");
//       }
//       setLoading(false);
//     };

//     fetchUser();
//   }, []);

//   const login = async (email, password) => {
//     const { data } = await API.post("/auth/login", { email, password });
//     setAuthToken(data.token);
//     setUser(data);
//   };

//   const logout = () => {
//     removeAuthToken();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
