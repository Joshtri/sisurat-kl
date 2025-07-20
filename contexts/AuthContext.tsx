"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { getMe } from "@/services/authService";

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  refetchUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const userData = await getMe();

      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, refetchUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
