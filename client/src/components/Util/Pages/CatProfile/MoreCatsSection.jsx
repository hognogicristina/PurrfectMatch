import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FavoriteHeart from "../../Features/FavoriteHeart.jsx";
import { getAuthToken } from "../../../../util/auth.js";

export default function MoreCatsSection({ title, cats, type, catDetail }) {
  const navigate = useNavigate();
  const token = getAuthToken();

  const handleCatClick = (id) => {
    navigate(`/cats/cat/${id}`);
  };

  const handleExploreMore = (type) => {
    if (type === "guardian") {
      navigate(`/cats?selectedUser=${catDetail.user}&page=1`);
    } else if (type === "owner") {
      navigate(`/cats?selectedUser=${catDetail.owner}&page=1`);
    } else if (type === "breed") {
      navigate(`/cats?selectedBreed=${catDetail.breed}&page=1`);
    }
  };

  return (
    <motion.div
      className="otherCatsContainer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>{title}</h2>
      <ul className="otherCatsList">
        {cats
          .filter((cat) => cat.id !== catDetail.id)
          .slice(0, 4)
          .map((cat) => (
            <motion.li
              key={`${type}-${cat.id}`}
              className="otherCatCard"
              onClick={() => handleCatClick(cat.id)}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              {token && <FavoriteHeart catId={cat.id} className="favHeart" />}
              <img src={cat.image} alt={cat.name} className="otherCatImage" />
              <div className="otherCatInfo">
                <h3>{cat.name}</h3>
              </div>
            </motion.li>
          ))}
        {cats.length > 4 && (
          <motion.li
            className="otherCatCard exploreMoreCard"
            initial={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            <p>{cats.length - 4} more cats available</p>
            <button
              className="submitButton save"
              onClick={() => handleExploreMore(type)}
            >
              Explore More
            </button>
          </motion.li>
        )}
      </ul>
    </motion.div>
  );
}
