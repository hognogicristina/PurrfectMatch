import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../../../styles/Custom/FavoriteHeart.css";
import { useToast } from "../Custom/PageResponse/ToastProvider.jsx";
import { getAuthToken } from "../../../util/auth.js";

const FavoriteHeart = ({ catId, isFavoritesArchive }) => {
  const { notifyError } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    const checkIfFavorite = async () => {
      const response = await fetch(`http://localhost:3000/favorite/${catId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setIsFavorite(data.isFavorite);
      } else {
        notifyError(data.error.message);
      }
    };

    checkIfFavorite();
  }, [catId, notifyError]);

  const handleAddToFavorites = async () => {
    const token = getAuthToken();
    try {
      const response = await fetch(
        `http://localhost:3000/cat/${catId}/favorite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (response.ok) {
        setIsFavorite(true);
      } else {
        notifyError(data.error.message);
      }
    } catch (error) {
      notifyError("Failed to add to favorites.");
    }
  };

  const handleRemoveFromFavorites = async () => {
    const token = getAuthToken();
    try {
      const response = await fetch(
        `http://localhost:3000/favorite/${catId}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (response.ok) {
        setIsFavorite(false);
      } else {
        notifyError(data.error.message);
      }
    } catch (error) {
      notifyError("Failed to remove from favorites.");
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      handleRemoveFromFavorites();
    } else {
      handleAddToFavorites();
    }
  };

  return (
    <motion.div
      className={`catItemHeader ${isFavoritesArchive ? "favHeart" : ""}`}
      onClick={handleToggleFavorite}
      whileTap={{ scale: 1.2 }}
    >
      <motion.div whileTap={{ scale: 1.5, rotate: [0, 10, -10, 0] }}>
        {isFavorite ? (
          <FaHeart className="heartIcon" />
        ) : (
          <FaRegHeart className="heartIcon" />
        )}
      </motion.div>
    </motion.div>
  );
};

export default FavoriteHeart;
