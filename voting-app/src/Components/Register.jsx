import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      formData
    );

    login(res.data.token); // this saves token + navigates to dashboard

  } catch (err) {
    alert(err.response?.data?.message || "Something went wrong");
  }
};


  return (
    <div className="min-h-screen bg-linear-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center px-4">
      
      <div className="w-full max-w-5xl bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-white/30">

        {/* Left Side */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Create Account 🚀</h1>
          <p className="text-white/80 text-lg text-center">
            Join us and start building amazing experiences.
          </p>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8 md:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">
            Register
          </h2>

          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>

            <input
              type="text"
              name="username"   
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-4 py-3 rounded-xl bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white transition"
            />

            <input
              type="email"
              name="email"   
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white transition"
            />

            <input
              type="password"
              name="password"   
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white transition"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-white text-purple-700 font-semibold hover:bg-opacity-90 transition"
            >
              Create Account
            </button>

          </form>

          <p className="text-center text-white/80 mt-6 text-sm sm:text-base">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-white font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
