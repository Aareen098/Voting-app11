import React, { useState } from "react";
import axios from "axios";

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;

  const [username, setUsername] = useState(storedUser?.username || "");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(
    storedUser?.profileImage
      ? `http://localhost:5000/uploads/${storedUser.profileImage}`
      : "/default-avatar.png"
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    const res = await axios.put(
      "http://localhost:5000/api/user/update",
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Profile updated successfully");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="bg-white/20 backdrop-blur p-8 rounded-2xl w-96 text-white">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Update Profile
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">

          <div className="flex justify-center">
            <img
              src={preview}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-white"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-2 rounded text-black"
          />

          <button className="w-full bg-green-600 py-2 rounded">
            Update Profile
          </button>

        </form>
      </div>
    </div>
  );
};

export default Profile;