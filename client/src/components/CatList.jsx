import React, { useEffect, useState } from "react";
import { fetchCats } from "../services/catService";
import CatItem from "./CatItem";
import openSocket from "socket.io-client";

function CatList() {
  const [cats, setCats] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCats(currentPage);
        setCats(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError("Failed to fetch cats");
        console.error(error);
      }
    };

    const socket = openSocket("http://localhost:3000");
    socket.on("cats", (data) => {
      if (data.action === "create") {
        setCats((prevCats) => [...prevCats, data.cat]);
      } else if (data.action === "update") {
        setCats((prevCats) =>
          prevCats.map((cat) => (cat.id === data.cat.id ? data.cat : cat)),
        );
      }
    });

    fetchData();

    return () => socket.disconnect();
  }, [currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <h1>Cat List</h1>
      {error && <p>{error}</p>}
      {cats.map((cat, index) => (
        <CatItem key={index} cat={cat} />
      ))}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous Page
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next Page
        </button>
      </div>
    </div>
  );
}

export default CatList;
