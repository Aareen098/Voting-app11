import React, { useContext } from 'react'
import axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import {AuthContext} from '../Context/AuthContext';

const Login = () => {
  const {login} = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      login(res.data.token);
      localStorage.setItem("token", res.data.token);
      alert("Login successful");
    } catch (err) {
      console.log(err.response.data);
      alert(err.response.data.message);
    }

  };

  return (
    <div className='min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-4'>
       <div className="w-full max-w-5xl bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-white/30">

       {/* Left Info (Desktop Only) */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome Back 👋</h1>
          <p className="text-white/80 text-lg text-center">
            Login to access your dashboard and continue your journey.
          </p>
        </div>

        {/* Form */}
        <div className='p-6 sm:p-8 md:p-10'>
          <h2 className='text-2xl sm:text-3xl font-bold text-white text-center mb-6'>
            Login
          </h2>

          <form className='space-y-4 sm:space-y-5' onSubmit={handleSubmit}>
            <input type="email" onChange={handleChange} placeholder='Email address' className='w-full px-4 py-3 rounded-xl bg-white/30 text-white
           placeholder-white/70 focus:outline-none
           focus:ring-2 focus:ring-white transition'/>
            <br />
            <input type="password" onChange={handleChange} placeholder='Password' className='w-full px-4 py-3 rounded-xl bg-white/30 text-white
           placeholder-white/70 focus:outline-none
           focus:ring-2 focus:ring-white transition' />
            <br />
            <button className='w-full py-3 rounded-xl bg-white text-purple-700
           font-semibold hover:bg-opacity-90 transition'>Login</button>
          </form>

          <p className='text-center text-white/80 mt-6 text-sm sm:text-base'>
            Don't have an account?{""}
            <span
            onClick={()=> navigate("/register")}
            className='text-white font-semibold cursor-pointer hover:underline'>
              Register
            </span>
          </p>

        </div>

       </div>
    </div>
  )
}

export default Login
