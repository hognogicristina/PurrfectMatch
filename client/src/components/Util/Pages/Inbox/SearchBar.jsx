import { useState, useEffect } from "react";
import { useToast } from "../../Custom/PageResponse/ToastProvider.jsx";
import { getAuthToken } from "../../../../util/auth.js";
import { FaXmark } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar({ onUserSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const { notifyError } = useToast();

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const fetchResults = async () => {
      const token = getAuthToken();
      const response = await fetch(
        `http://localhost:3000/inbox/search?user=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();
      if (response.ok) {
        setResults(result.data);
        setShowResults(true);
      } else {
        result.error.forEach((err) => {
          if (err.field === "server") {
            notifyError(err.message);
          }
        });
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, notifyError]);

  const handleUserSelect = (user) => {
    onUserSelect(user.id, user.displayName, user.image);
    setShowResults(false);
    setQuery("");
  };

  const renderUserImage = (user) => {
    if (user.image) {
      return (
        <img
          className="userImageLogout catAdopt"
          src={user.image}
          alt={user.username}
        />
      );
    } else {
      return (
        <FontAwesomeIcon icon={faUserCircle} className="userSearchImage" />
      );
    }
  };

  const renderResults = () =>
    results.map((user) => (
      <div
        key={user.id}
        className="userSearch"
        onClick={() => handleUserSelect(user)}
      >
        {renderUserImage(user)}
        <p>{user.displayName}</p>
      </div>
    ));

  const clearInput = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className="searchBar">
      <label className="chatInput">
        <div className="iconContainer">
          <IoSearch />
        </div>
        <input
          type="text"
          placeholder="Search for users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="clearInput" onClick={clearInput}>
          <FaXmark />
        </span>
      </label>
      {showResults && <div className="results">{renderResults()}</div>}
    </div>
  );
}
