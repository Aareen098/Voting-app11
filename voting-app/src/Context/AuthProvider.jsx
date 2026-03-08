import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import React from "react";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user from localStorage on refresh
  useEffect(() => {

    const verifyUser = async () => {
  
      const storedUser = localStorage.getItem("user");
  
      if (!storedUser) {
        setLoading(false);
        return;
      }
  
      const parsedUser = JSON.parse(storedUser);
  
      try {
  
        const res = await fetch("https://voting-backend-tdci.onrender.com/api/auth/verifyToken", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${parsedUser.token}`
          }
        });
  
        const data = await res.json();
  
        if (data.valid) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("user");
          setUser(null);
        }
  
      } catch (error) {
        localStorage.removeItem("user");
        setUser(null);
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  const login = (token, userData) => {
    const userObject = {
      token,
      ...userData,
    };

    localStorage.setItem("user", JSON.stringify(userObject));
    setUser(userObject);
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;