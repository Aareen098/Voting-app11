import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

const Navbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="bg-white/10 backdrop-blur-md shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">🗳 Voting App</h1>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
