import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types/user";
import { AuthService } from "../services/services";
import { toast } from "react-toastify";

type LoginResponse = {
  status: "success" | "error";
  message: string;
  data: {
    token: string; // "Bearer xxx"
    user: User;
  };
};

type UserContextType = {
  userData: User | null;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setAuthData: (payload: LoginResponse | LoginResponse["data"]) => void; // ✅ NEW
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => {},
  token: null,
  setToken: () => {},
  setAuthData: () => {},
  logout: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<User | null>(null);
  console.log("userData in context", userData);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("accessToken"));

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    setToken(null);
    setUserData(null);
  };

  // ✅ SINGLE place that stores token + user
  const setAuthData = (payload: LoginResponse | LoginResponse["data"]) => {
    // allow passing full response or just response.data
    const data = "data" in payload ? payload.data : payload;

    const tokenWithBearer = data?.token;
    const user = data?.user;

    if (!tokenWithBearer || !user) {
      console.error("Invalid auth payload:", payload);
      return;
    }

    const cleanToken = tokenWithBearer.replace(/^Bearer\s+/i, "");

    localStorage.setItem("accessToken", cleanToken);
    localStorage.setItem("userData", JSON.stringify(user));

    setToken(cleanToken);
    setUserData(user);
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await AuthService.me();
      const meUser = res?.data as User | undefined;
      console.log("meUser in context", meUser);
      if (meUser) {
        setUserData(meUser);
        localStorage.setItem("userData", JSON.stringify(meUser));
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.warn("Session expired. Please login again.");
        logout();
      }
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUserData = localStorage.getItem("userData");

    if (storedToken) {
      setToken(storedToken);

      if (storedUserData) {
        try {
          setUserData(JSON.parse(storedUserData));
        } catch {
          localStorage.removeItem("userData");
        }
      }

      fetchCurrentUser();
    } else {
      setUserData(null);
      setToken(null);
    }
  }, []);

  return <UserContext.Provider value={{ userData, setUserData, token, setToken, setAuthData, logout }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
