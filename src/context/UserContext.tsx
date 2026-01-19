import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
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
  setAuthData: (payload: LoginResponse | LoginResponse["data"]) => void;
  logout: () => void;
  isLoading: boolean;
  refreshMe: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => {},
  token: null,
  setToken: () => {},
  setAuthData: () => {},
  logout: () => {},
  isLoading: true,
  refreshMe: async () => {},
});

function safeParseUser(): User | null {
  const raw = localStorage.getItem("userData");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem("userData");
    return null;
  }
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("accessToken"));
  const [userData, setUserData] = useState<User | null>(() => safeParseUser());
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    setToken(null);
    setUserData(null);
  };

  const setAuthData = (payload: LoginResponse | LoginResponse["data"]) => {
    const data = "data" in payload ? payload.data : payload;

    const tokenWithBearer = data?.token;
    const user = data?.user;

    if (!tokenWithBearer || !user) {
      console.error("Invalid auth payload:", payload);
      return;
    }

    const cleanToken = tokenWithBearer.replace(/^Bearer\s+/i, "");

    // persist first
    localStorage.setItem("accessToken", cleanToken);
    localStorage.setItem("userData", JSON.stringify(user));

    // set state
    setToken(cleanToken);
    setUserData(user); // immediate UI update (optimistic)
  };

  const refreshMe = async () => {
    if (!token) return;

    try {
      // ✅ Force token into request so it works immediately after login
      const res = await AuthService.me({
        headers: { Authorization: `Bearer ${token}` },
      });

      const meUser = res?.data as User | undefined;
      console.log(meUser);
      if (meUser) {
        setUserData(meUser);
        localStorage.setItem("userData", JSON.stringify(meUser));
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.warn("Session expired. Please login again.");
        logout();
      } else {
        console.error("refreshMe failed:", error);
      }
    }
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // whenever token changes, we are "checking auth"
      setIsLoading(true);

      if (!token) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      await refreshMe();

      if (!cancelled) setIsLoading(false);
    };

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = useMemo(
    () => ({
      userData,
      setUserData,
      token,
      setToken,
      setAuthData,
      logout,
      isLoading,
      refreshMe,
    }),
    [userData, token, isLoading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
