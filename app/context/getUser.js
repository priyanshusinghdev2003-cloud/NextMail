"use client";
import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/users/me");
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
