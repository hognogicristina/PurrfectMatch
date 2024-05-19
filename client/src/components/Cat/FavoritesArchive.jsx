import { useEffect, useState } from "react";
import "../../styles/PurrfectMatch/FavoritesList.css";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";
import FavoriteHeart from "../Util/Features/FavoriteHeart.jsx";
import SubmitDialog from "../Util/Custom/Reuse/SubmitDialog.jsx";
import { getAuthToken } from "../../util/auth.js";

export default function FavoritesArchive({ favorites }) {
  const { data, error } = favorites;
  const { notifyError } = useToast();
  const token = getAuthToken();
  const [visibleCount, setVisibleCount] = useState(7);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [requestStatus, setRequestStatus] = useState({});

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 3);
  };

  const handleAdoptMeClick = (cat) => {
    setSelectedCat(cat);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCat(null);
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
            <FavoriteHeart catId={favorite.id} isFavoritesArchive />
            <motion.button
              whileTap={{ scale: 0.9 }}
              disabled={requestStatus[favorite.id]}
              className={`submitButton submit ${requestStatus[favorite.id] ? "submitting" : ""}`}
              onClick={() => handleAdoptMeClick(favorite)}
            >
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

  useEffect(() => {
    const checkAdoptionRequests = async () => {
      if (token && Array.isArray(data)) {
        const statusPromises = data.map(async (cat) => {
          const response = await fetch(
            `http://localhost:3000/adopt/${cat.id}/validate`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const result = await response.json();
          return { id: cat.id, exists: result.exists };
        });

        const statusResults = await Promise.all(statusPromises);
        const statusMap = statusResults.reduce((acc, { id, exists }) => {
          acc[id] = exists;
          return acc;
        }, {});

        setRequestStatus(statusMap);
      }
    };

    checkAdoptionRequests();
  }, [data, token]);

  const handleRequestSuccess = () => {
    if (selectedCat) {
      setRequestStatus((prevStatus) => ({
        ...prevStatus,
        [selectedCat.id]: true,
      }));
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
      <SubmitDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        catDetail={selectedCat}
        token={token}
        onRequestSuccess={handleRequestSuccess}
      />
    </div>
  );
}
