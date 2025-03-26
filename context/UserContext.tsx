'use client'

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface UserContextType {
  username: string | null;
  email: string | null;
  role: string | null;
  _id: string | null;
  setUserData: (data: {
    username: string;
    email: string;
    role: string;
    _id: string;
  }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<{
    username: string | null;
    email: string | null;
    role: string | null;
    _id: string | null;
  }>({
    username: null,
    email: null,
    role: null,
    _id: null,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
  }, []);

  const updateUserData = (data: {
    username: string;
    email: string;
    role: string;
    _id: string;
  }) => {
    setUserData(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  return (
    <UserContext.Provider value={{ ...userData, setUserData: updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
