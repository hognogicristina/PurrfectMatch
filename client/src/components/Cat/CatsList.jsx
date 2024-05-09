import React, { useEffect } from "react";
import "./CatsList.css";
import { useToast } from "../Util/Custom/ToastProvider.jsx";

function CatsList({ cats }) {
  const { notifyError } = useToast();

  useEffect(() => {
    if (cats.error) {
      notifyError(cats.error[0].message);
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
    </div>
  );
}

export default CatsList;
