import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import FilterBar from "../Util/Features/FilterBar.jsx";
import SortDropdown from "../Util/Features/SortDropdown.jsx";
import NoResultMessage from "../Util/Custom/PageResponse/NoResultMessage.jsx";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import Pagination from "../Util/Custom/Reuse/Pagination.jsx";
import "../../styles/PurrfectMatch/Cat.css";
import FavoriteHeart from "../Util/Functionalities/FavoriteHeart.jsx";

function CatsCatalog({ cats, currentPage, onPageChange }) {
  const { data, error, totalPages } = cats;
  const navigate = useNavigate();
  const { notifyError } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchParamsKey, setSearchParamsKey] = useState(0);

  useEffect(() => {
    setSearchParamsKey((prevKey) => prevKey + 1);
  }, [currentPage, cats]);

  const handleClickCatItem = (id) => {
    navigate(`/cats/cat/${id}`);
  };

  const renderCats = () => {
    if (cats && Array.isArray(data) && data.length > 0) {
      return data.map((cat, index) => (
        <motion.div
          key={`${cat.id}-${searchParamsKey}-${index}`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.05,
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
            transition: { duration: 0.25, delay: index * 0.0001 },
          }}
          viewport={{ once: true }}
          className="catItem"
          onClick={() => handleClickCatItem(cat.id)}
        >
          <FavoriteHeart catId={cat.id} />
          <img src={cat.image} alt={cat.name} className="catItemImg" />
          <h3>{cat.name}</h3>
          <ul>
            <li>Breed: {cat.breed}</li>
            <li>Gender: {cat.gender}</li>
            <li>Life Stage: {cat.lifeStage}</li>
          </ul>
        </motion.div>
      ));
    } else if (cats && error) {
      if (error.some((err) => err.field === "cats")) {
        const errorMessage = error.map((err, index) => (
          <p key={index} className="errorMessageCats">
            {err.message}
          </p>
        ));
        return <NoResultMessage message={errorMessage} />;
      } else {
        error.forEach((err) => {
          notifyError(err.message);
        });
      }
    }
  };

  return (
    <div className="catsPageContainer">
      <FilterBar
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <div className="catsListContainer">
        <div className="topControls">
          <SortDropdown />
          {Array.isArray(data) && data.length > 0 && (
            <Pagination
              displayPages="true"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </div>
        <div className="catsContainer">
          <div className="catsList">{renderCats()}</div>
        </div>
      </div>
    </div>
  );
}

export default CatsCatalog;
