export const checkAccess = (allowedRoles: string[]) => {
    if (typeof window !== "undefined") {
      const userRole = localStorage.getItem("userRole"); // Fetch role from localStorage (or use context)
      return userRole && allowedRoles.includes(userRole);
    }
    return false;
  };
  