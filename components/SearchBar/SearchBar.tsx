import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  placeholder?: string;
}

export default function SearchBar({ placeholder = "Search for products..." }: Props) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}&page=1`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
      >
        Search
      </button>
    </form>
  );
}
