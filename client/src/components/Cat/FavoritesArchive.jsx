import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import "../../styles/PurrfectMatch/FavoritesList.css";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";

export default function FavoritesArchive({ favorites }) {
  const { data, error } = favorites;
  const { notifyError } = useToast();
  const [visibleCount, setVisibleCount] = useState(7);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 3);
  };

  const renderFavorites = () => {
    if (favorites && Array.isArray(data) && data.length > 0) {
      return data.slice(0, visibleCount).map((favorite, index) => (
        <motion.li
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
            transition: { duration: 0.3, delay: index * 0.001 },
          }}
          viewport={{ once: true }}
          key={favorite.id}
          className="favoriteItem"
        >
          <img src={favorite.image} alt={favorite.name} className="catImage" />
          <div className="catDetailsFav">
            <p className="catName">{favorite.name}</p>
            <p className="catBreed">{favorite.breed}</p>
          </div>
          <div className="catActions">
            <motion.button whileTap={{ scale: 0.9 }} className="heartButton">
              <FaHeart />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} className="adoptButton">
              Adopt Me
            </motion.button>
          </div>
        </motion.li>
      ));
    } else if (favorites && error) {
      if (error.field === "server") {
        notifyError(error.message);
      } else {
        return error.map((err, index) => (
          <p key={index} className="errorMessageCats">
            {err.message}
          </p>
        ));
      }
    }
  };

  return (
    <div className="favoritesContainer">
      <h1>Favorites</h1>
      <ul className="favoritesList">{renderFavorites()}</ul>
      {data && data.length > visibleCount && (
        <div className="favoriteButton">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="simpleButton submit"
            onClick={handleShowMore}
          >
            More Items
          </motion.button>
        </div>
      )}
    </div>
  );
}
