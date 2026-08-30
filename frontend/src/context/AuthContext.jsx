import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hrms_user") || "null");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("hrms_token")));

  useEffect(() => {
    if (!localStorage.getItem("hrms_token")) {
      setLoading(false);
      return;
    }

    api.me()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("hrms_user", JSON.stringify(res.data));
      })
      .catch(() => {
        localStorage.removeItem("hrms_token");
        localStorage.removeItem("hrms_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  function login(data) {
    localStorage.setItem("hrms_token", data.token);
    localStorage.setItem("hrms_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("hrms_token");
    localStorage.removeItem("hrms_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
