import React from "react";
import styles from "./CatsList.module.css";

function CatsList({ cats }) {
  return (
    <div className={styles.catsList}>
      {cats.map((cat, index) => (
        <div key={index} className={styles.catItem}>
          {" "}
          <img src={cat.image} alt={cat.name} />
          <p>{cat.name}</p>
        </div>
      ))}
    </div>
  );
}

export default CatsList;
