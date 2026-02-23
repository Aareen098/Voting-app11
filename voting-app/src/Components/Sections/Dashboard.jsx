import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const candidates = [
  { id: 1, name: "John Doe", party: "Party A" },
  { id: 2, name: "Jane Smith", party: "Party B" },
  { id: 3, name: "Alex Brown", party: "Party C" },
];

const Dashboard = () => {
  const [voted, setVoted] = useState(false);
  const [message, setMessage] = useState("");
  const [results, setResults] = useState([]);

  const handleVote = async (candidate) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/vote",
        { candidate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVoted(true);
      setMessage("✅ Vote submitted successfully!");
    } catch (error) {
      console.log(error.response);
      console.log(error.response?.data);
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
  const fetchResults = async () => {
    const res = await axios.get("http://localhost:5000/api/vote/results");
    setResults(res.data);
  };

  fetchResults();
}, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-center mb-10">
          Cast Your Vote
        </h2>

        {message && (
          <div className="text-center mb-6 font-semibold">{message}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition"
            >
              <h3 className="text-xl font-bold mb-2">
                {candidate.name}
              </h3>
              <p className="text-white/80 mb-4">
                {candidate.party}
              </p>

              <button
                disabled={voted}
                onClick={() => handleVote(candidate.name)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  voted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-white text-purple-700 hover:bg-opacity-90"
                }`}
              >
                {voted ? "Voted" : "Vote"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-12 text-center">
  Live Results
</h2>

<div className="mt-6 space-y-4">
  {results.map((item, index) => (
    <div
      key={index}
      className="bg-white/20 p-4 rounded-lg flex justify-between"
    >
      <span>{item._id}</span>
      <span>{item.totalVotes} votes</span>
    </div>
  ))}
</div>
    </div>
  );
};

export default Dashboard;
