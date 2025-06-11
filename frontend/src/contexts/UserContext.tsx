import React, { createContext, useContext, useState, useEffect } from "react";

type User = { username: string; mentor: boolean } | null;
type UserContextType = {
  user: User;
  login: (user: { username: string; mentor: boolean }) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const u = localStorage.getItem("speed-user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const login = (u: { username: string; mentor: boolean }) => {
    setUser(u);
    localStorage.setItem("speed-user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("speed-user");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}