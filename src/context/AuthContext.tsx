"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as api from "@/lib/api";
import { toast } from "sonner";

type Profile = {
  id: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
};

interface AuthContextType {
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  reloadProfile: () => void;
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  reloadProfile: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userProfile = await api.getProfile();
      setProfile(userProfile);
    } catch (error: any) {
      // Don't show a console error for invalid tokens, as this is an expected state.
      if (error && typeof error.message === 'string' && error.message.toLowerCase().includes('token')) {
        console.log("Invalid token found, clearing session.");
      } else {
        console.error("Failed to fetch profile, logging out.", error);
      }
      localStorage.removeItem("authToken");
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (credentials: any) => {
    try {
      const { token } = await api.loginUser(credentials);
      localStorage.setItem("authToken", token);
      await fetchProfile();
      toast.success("Succesvol ingelogd!");
      router.push("/");
    } catch (error) {
      console.error("Login failed", error);
      // Error toast is handled by the api client
    }
  };

  const register = async (userData: any) => {
    try {
      await api.registerUser(userData);
      toast.success("Registratie succesvol! U kunt nu inloggen.");
      router.push("/login");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setProfile(null);
    toast.info("U bent uitgelogd.");
    router.push("/");
  };

  const reloadProfile = () => {
    fetchProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        isAuthenticated: !!profile,
        isLoading,
        login,
        register,
        logout,
        reloadProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};