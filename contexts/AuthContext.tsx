"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// Types for user roles
export type UserRole = "WARGA" | "STAFF" | "LURAH" | "SUPERADMIN";

export interface User {
  id: string;
  nik: string;
  name: string;
  role: UserRole;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (nik: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers: Record<string, { password: string; user: User }> = {
  "1234567890": {
    password: "password123",
    user: {
      id: "1",
      nik: "1234567890",
      name: "John Doe",
      role: "WARGA",
      email: "john@example.com",
    },
  },
  "0987654321": {
    password: "staff123",
    user: {
      id: "2",
      nik: "0987654321",
      name: "Jane Smith",
      role: "STAFF",
      email: "jane@kelurahan.gov.id",
    },
  },
  "1111222233": {
    password: "lurah123",
    user: {
      id: "3",
      nik: "1111222233",
      name: "Ahmad Rahman",
      role: "LURAH",
      email: "lurah@kelurahan.gov.id",
    },
  },
  "9999888877": {
    password: "admin123",
    user: {
      id: "4",
      nik: "9999888877",
      name: "Super Admin",
      role: "SUPERADMIN",
      email: "superadmin@kelurahan.gov.id",
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored user session on mount
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (nik: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser = mockUsers[nik];

    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user);
      localStorage.setItem("user", JSON.stringify(mockUser.user));

      // Redirect based on user role
      const roleRoutes = {
        WARGA: "/warga/dashboard",
        STAFF: "/staff/dashboard",
        LURAH: "/lurah/dashboard",
        SUPERADMIN: "/superadmin/dashboard",
      };

      router.push(roleRoutes[mockUser.user.role]);
      setIsLoading(false);

      return true;
    }

    setIsLoading(false);

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
