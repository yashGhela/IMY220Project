import { useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../config";

export function SearchItem() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event) {
    event.preventDefault();

    if (!searchTerm.trim()) {
      setError("Enter a name or username");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API}/api/users/search?q=${encodeURIComponent(searchTerm.trim())}`
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Search failed");
        return;
      }

      setResults(await response.json());
      setSearched(true);
    } catch {
      setError("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className="m-10" onSubmit={handleSearch}>
        <input
        className="border border-gray-300 p-1"
          value={searchTerm}
          placeholder="search users"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="ml-5 bg-black text-white p-1 cursor-pointer" type="submit">Search</button>
      </form>

      {loading && <p>Searching...</p>}
      {error && <p>{error}</p>}
      {searched && !loading && results.length === 0 && <p>No users found</p>}

      {results.map((user) => (
        <Link key={user._id} to={`/profile/${user._id}`}>
          <img
            src={user.profile_pic ? API + user.profile_pic : "/default-avatar.png"}
            alt={user.username}
            width="40"
          />
          <p>{user.name}</p>
          <p>@{user.username}</p>
        </Link>
      ))}
    </div>
  );
}