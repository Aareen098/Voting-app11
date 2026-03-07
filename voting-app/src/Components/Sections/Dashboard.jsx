import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { io } from "socket.io-client";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Dashboard = () => {

const socketRef = useRef(null);

const [candidates, setCandidates] = useState([]);
const [results, setResults] = useState([]);

const [voted, setVoted] = useState(false);
const [myVote, setMyVote] = useState(null);
const [message, setMessage] = useState("");

const [search, setSearch] = useState("");
const [currentPage, setCurrentPage] = useState(1);

const candidatesPerPage = 4;

// ADMIN STATES
const [candidateName, setCandidateName] = useState("");
const [candidateParty, setCandidateParty] = useState("");
const [candidateImage, setCandidateImage] = useState(null);
const [preview, setPreview] = useState(null);
const [editingId, setEditingId] = useState(null);
const [adding, setAdding] = useState(false);

const storedUser = JSON.parse(localStorage.getItem("user"));
const token = storedUser?.token;
const isAdmin = storedUser?.role === "admin";

const DEFAULT_AVATAR = "/default-avatar.png";


// ================= SOCKET =================

useEffect(() => {

socketRef.current = io("https://voting-backend-tdci.onrender.com");

socketRef.current.on("voteUpdated", fetchResults);
socketRef.current.on("candidateUpdated", fetchCandidates);

return () => socketRef.current.disconnect();

}, []);


// ================= FETCH =================

const fetchCandidates = async () => {
const res = await axios.get("https://voting-backend-tdci.onrender.com/api/candidates");
setCandidates(res.data);
};

const fetchResults = async () => {
const res = await axios.get("https://voting-backend-tdci.onrender.com/api/vote/results");
setResults(res.data);
};

const fetchMyVote = async () => {

if (!token) return;

const res = await axios.get(
"https://voting-backend-tdci.onrender.com/api/vote/my-vote",
{ headers: { Authorization: `Bearer ${token}` } }
);

if (res.data.voted) {
setVoted(true);
setMyVote(res.data.candidate);
}

};

useEffect(() => {
fetchCandidates();
fetchResults();
fetchMyVote();
}, []);


// ================= VOTE =================

const handleVote = async (candidate) => {

const confirmVote = window.confirm(
`Are you sure you want to vote for ${candidate}?`
);

if (!confirmVote) return;

try {

await axios.post(
"https://voting-backend-tdci.onrender.com/api/vote",
{ candidate },
{ headers: { Authorization: `Bearer ${token}` } }
);

setVoted(true);
setMyVote(candidate);
setMessage("Vote submitted successfully");

} catch (error) {

setMessage(error.response?.data?.message || "Vote failed");

}

};


// ================= ADD / UPDATE =================

const handleAddOrUpdate = async (e) => {

e.preventDefault();

if (!candidateName || !candidateParty) {
setMessage("All fields required");
return;
}

const confirmAction = window.confirm(
editingId
? "Update this candidate?"
: "Add this candidate?"
);

if (!confirmAction) return;

try {

setAdding(true);

const formData = new FormData();

formData.append("name", candidateName);
formData.append("party", candidateParty);

if (candidateImage) {
formData.append("image", candidateImage);
}

if (editingId) {

await axios.put(
`https://voting-backend-tdci.onrender.com/api/candidates/${editingId}`,
formData,
{ headers: { Authorization: `Bearer ${token}` } }
);

setMessage("Candidate updated");

} else {

await axios.post(
"https://voting-backend-tdci.onrender.com/api/candidates",
formData,
{ headers: { Authorization: `Bearer ${token}` } }
);

setMessage("Candidate added");

}

fetchCandidates();

setCandidateName("");
setCandidateParty("");
setCandidateImage(null);
setPreview(null);
setEditingId(null);

} catch {

setMessage("Error saving candidate");

} finally {

setAdding(false);

}

};


// ================= DELETE =================

const handleDelete = async (id) => {

const confirmDelete = window.confirm(
"Delete this candidate?"
);

if (!confirmDelete) return;

await axios.delete(
`https://voting-backend-tdci.onrender.com/api/candidates/${id}`,
{ headers: { Authorization: `Bearer ${token}` } }
);

fetchCandidates();

};


// ================= SEARCH =================

const filteredCandidates = candidates.filter((c) =>
c.name.toLowerCase().includes(search.toLowerCase())
);


// ================= PAGINATION =================

const indexOfLast = currentPage * candidatesPerPage;
const indexOfFirst = indexOfLast - candidatesPerPage;

const currentCandidates = filteredCandidates.slice(
indexOfFirst,
indexOfLast
);

const totalPages = Math.ceil(
filteredCandidates.length / candidatesPerPage
);


// ================= RESULTS =================

const totalVotes = results.reduce(
(acc, item) => acc + item.totalVotes,
0
);

const winner = results.reduce((max, candidate) => {
return candidate.totalVotes > (max?.totalVotes || 0)
? candidate
: max;
}, null);


// ================= CHART =================

const chartData = {

labels: results.map((r) => r._id),

datasets: [
{
label: "Votes",
data: results.map((r) => r.totalVotes),
backgroundColor: [
"#facc15",
"#38bdf8",
"#f472b6",
"#34d399"
],
borderRadius: 6
}
]

};


return (

<div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">

<Navbar />

<div className="container mx-auto px-4 py-10">

<h2 className="text-3xl font-bold text-center mb-6">
Cast Your Vote
</h2>


<input
placeholder="Search candidate..."
value={search}
onChange={(e) => setSearch(e.target.value)}
className="mb-6 p-2 rounded text-black w-full"
/>


{myVote && (
<div className="text-center mb-6 text-xl font-bold">
🎉 You voted for
<span className="text-yellow-300 ml-2">
{myVote}
</span>
</div>
)}


{message && (
<div className="text-center mb-6 font-semibold">
{message}
</div>
)}



{/* Candidates */}

<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

{currentCandidates.map((candidate) => (

<div
key={candidate._id}
className="bg-white/20 p-6 rounded-2xl text-center"
>

<div className="w-full h-48 bg-white/10 flex items-center justify-center rounded mb-3">

<img
src={candidate.image || DEFAULT_AVATAR}
alt={candidate.name}
className="max-h-full max-w-full object-contain"
/>

</div>


<h3 className="text-xl font-bold flex justify-center gap-2">

{candidate.name}

{winner && winner._id === candidate.name && (
<span className="animate-bounce text-yellow-300">
👑
</span>
)}

</h3>


<p className="mb-3">{candidate.party}</p>


{!isAdmin && (

<button
disabled={voted}
onClick={() => handleVote(candidate.name)}
className="bg-white text-purple-700 px-4 py-2 rounded"
>

{voted ? "Voted" : "Vote"}

</button>

)}


{isAdmin && (

<div className="flex gap-2 justify-center">

<button
onClick={() => {

setEditingId(candidate._id);
setCandidateName(candidate.name);
setCandidateParty(candidate.party);

}}
className="bg-blue-600 px-3 py-1 rounded text-sm"
>

Edit

</button>


<button
onClick={() => handleDelete(candidate._id)}
className="bg-red-600 px-3 py-1 rounded text-sm"
>

Delete

</button>

</div>

)}

</div>

))}

</div>


{/* Pagination */}

<div className="flex justify-center mt-8 gap-2">

{Array.from({ length: totalPages }, (_, i) => (

<button
key={i}
onClick={() => setCurrentPage(i + 1)}
className="bg-white text-purple-700 px-3 py-1 rounded"
>

{i + 1}

</button>

))}

</div>


{/* Chart */}

{results.length > 0 && (

<>

<h2 className="text-2xl font-bold mt-12 text-center">
Results Chart
</h2>

<div className="text-center mt-4 font-semibold">
Total Votes: {totalVotes}
</div>

<div className="bg-white/20 p-6 rounded-2xl mt-6">
<Bar data={chartData} />
</div>

</>

)}


{/* Progress Bars */}

<h2 className="text-2xl font-bold mt-12 text-center">
Live Vote Results
</h2>

<div className="mt-6 space-y-4">

{results.map((candidate, index) => {

const percentage = totalVotes
? ((candidate.totalVotes / totalVotes) * 100).toFixed(1)
: 0;

return (

<div key={index} className="bg-white/20 p-4 rounded-lg">

<div className="flex justify-between mb-2">

<span>{candidate._id}</span>

<span>{percentage}%</span>

</div>

<div className="w-full bg-white/30 h-4 rounded">

<div
className="bg-yellow-300 h-4 rounded transition-all duration-700"
style={{ width: `${percentage}%` }}
></div>

</div>

</div>

);

})}

</div>


{/* ADMIN FORM */}

{isAdmin && (

<div className="mt-12 bg-white/20 p-6 rounded-xl">

<h3 className="text-xl font-bold mb-4">
{editingId ? "Edit Candidate" : "Add Candidate"}
</h3>

<form onSubmit={handleAddOrUpdate} className="space-y-3">

<input
value={candidateName}
onChange={(e) => setCandidateName(e.target.value)}
placeholder="Candidate Name"
className="w-full p-2 rounded text-black"
/>

<input
value={candidateParty}
onChange={(e) => setCandidateParty(e.target.value)}
placeholder="Party Name"
className="w-full p-2 rounded text-black"
/>

<input
type="file"
onChange={(e) => {
const file = e.target.files[0];
setCandidateImage(file);
setPreview(URL.createObjectURL(file));
}}
className="w-full p-2 rounded text-black"
/>


{preview && (

<img
src={preview}
className="w-32 h-32 object-contain rounded"
/>

)}


<button
disabled={adding}
className="bg-green-600 px-4 py-2 rounded"
>

{adding ? "Saving..." : editingId ? "Update" : "Add"}

</button>

</form>

</div>

)}

</div>

</div>

);

};

export default Dashboard;