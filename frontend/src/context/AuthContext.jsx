import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
  });

  api.interceptors.request.use((cfg) => {
    const token = localStorage.getItem("token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    toast.success("Logged in!");
  };

  const register = async (form) => {
    const { data } = await api.post("/auth/register", form);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    toast.success("Account created!");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out");
  };

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/user/profile");
      setUser(data);
    } catch (e) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) fetchProfile();
        else logout();
      } catch {
        logout();
      }
    } else setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, api, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);