import React, { useEffect } from "react";
import "./CatsList.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CatsList({ cats }) {
  useEffect(() => {
    if (cats.error) {
      toast.error(cats.error[0].message);
    }
  }, [cats]);

  return (
    <div className="catsList">
      {cats.map((cat, index) => (
        <div key={index} className="catItem">
          <img src={cat.image} alt={cat.name} />
          <p>{cat.name}</p>
        </div>
      ))}
      <ToastContainer
        position="top-center"
        autoClose={6000}
        closeButton={false}
      />
    </div>
  );
}

export default CatsList;
