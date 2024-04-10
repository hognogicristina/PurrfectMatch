import React, { useEffect, useState } from "react";
import axios from "axios";
import openSocket from "socket.io-client";

function CatList() {
  const [cats, setCats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await axios.get("http://localhost:3000/cats");
        setCats(response.data.data);
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

    fetchCats();

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h1>Cat List</h1>
      {error && <p>{error}</p>}
      {cats.map((cat, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <h3>{cat.name}</h3>
          {Object.entries(cat).map(([key, value]) => {
            if (key !== "name") {
              return (
                <div key={key}>
                  {key.charAt(0).toUpperCase() +
                    key
                      .slice(1)
                      .replace(/([A-Z])/g, " $1")
                      .trim()}
                  : {value.toString()}
                </div>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
}

export default CatList;
