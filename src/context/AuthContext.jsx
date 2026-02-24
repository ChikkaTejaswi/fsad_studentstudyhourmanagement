import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const ADMIN_EMAIL = "admin@college.edu";
const ADMIN_PASSWORD = "Admin@123";

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("adminAuth");
    if (stored) {
      try {
        setAdmin(JSON.parse(stored));
      } catch (_) {}
    }
  }, []);

  const loginAdmin = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = { email, role: "admin" };
      setAdmin(adminUser);
      sessionStorage.setItem("adminAuth", JSON.stringify(adminUser));
      return { success: true };
    }
    return { success: false, message: "Invalid admin email or password." };
  };

  const logoutAdmin = () => {
    setAdmin(null);
    sessionStorage.removeItem("adminAuth");
  };

  return (
    <AuthContext.Provider value={{ admin, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
