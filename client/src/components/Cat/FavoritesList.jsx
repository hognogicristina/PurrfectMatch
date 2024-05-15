import React from "react";
import { FaHeart } from "react-icons/fa";
import "./FavoritesList.css";

export default function FavoritesList({ favorites }) {
  return (
    <div className="favorites-container">
      <h1>Favorites</h1>
      <ul className="favorites-list">
        {favorites.data.map((favorite) => (
          <li key={favorite.id} className="favorite-item">
            <img
              src={favorite.image}
              alt={favorite.name}
              className="cat-image"
            />
            <div className="cat-details">
              <p className="cat-name">{favorite.name}</p>
              <p className="cat-breed">{favorite.breed}</p>
            </div>
            <div className="cat-actions">
              <button className="heart-button">
                <FaHeart />
              </button>
              <button className="adopt-button">Adopt Me</button>
            </div>
          </li>
        ))}
      </ul>
      <button className="moreItems">More Items</button>
    </div>
  );
}
