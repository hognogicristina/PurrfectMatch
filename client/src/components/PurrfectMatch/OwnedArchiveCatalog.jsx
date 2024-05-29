import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";
import "../../styles/PurrfectMatch/CatsArchive.css";
import NoResultMessage from "../Util/Custom/PageResponse/NoResultMessage.jsx";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import ModifyCatForm from "../Cat/ModifyCatForm.jsx";
import { useEffect, useState } from "react";
import Pagination from "../Util/Custom/Reuse/Pagination.jsx";

export default function OwnedArchiveCatalog({
  cats,
  currentPage,
  onPageChange,
}) {
  const { data, error, totalPages, totalItems } = cats;
  const { notifyError } = useToast();
  const navigate = useNavigate();
  const [currentCat, setCurrentCat] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchParamsKey, setSearchParamsKey] = useState(0);

  useEffect(() => {
    setSearchParamsKey((prevKey) => prevKey + 1);
  }, [currentPage, cats]);

  const handleEditClick = (cat) => {
    setCurrentCat(cat);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = (updatedCat) => {
    setIsEditDialogOpen(false);
    if (updatedCat) {
      // Update the currentCat with new details
      setCurrentCat(updatedCat);
      // Update the list of cats with the updated cat details
      const updatedData = data.map((cat) =>
        cat.id === updatedCat.id ? updatedCat : cat,
      );
      // Replace the data in the cats object
      cats.data = updatedData;
    }
  };

  const handleCatClick = (id) => {
    navigate(`/cats/cat/${id}`);
  };

  const renderCats = () => {
    if (cats && Array.isArray(data) && data.length > 0) {
      return data.map((cat, index) => (
        <motion.li
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
            transition: { duration: 0.3, delay: index * 0.01 },
          }}
          viewport={{ once: true }}
          key={`${cat.id}-${searchParamsKey}-${index}`}
          className="catListItem"
          style={{ backgroundImage: `url(${cat.image})` }}
          onClick={() => handleCatClick(cat.id)}
        >
          <div
            className="editIconContainer"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(cat);
            }}
          >
            <FaEdit className="editIcon" />
          </div>
          <div className="catDetails">
            <h2>{cat.name}</h2>
            <p>{cat.breed}</p>
          </div>
        </motion.li>
      ));
    } else if (cats && error) {
      if (error.some((err) => err.field === "cats")) {
        const errorMessage = error.map((err, index) => (
          <p key={index} className="errorMessageCats">
            {err.message}
          </p>
        ));
        return (
          <div className="noResultContainer">
            <NoResultMessage message={errorMessage} />
          </div>
        );
      } else {
        error.forEach((err) => {
          notifyError(err.message);
        });
      }
    }
  };

  return (
    <div className="userDetailContainer list">
      <motion.div
        className="userContent list"
        initial={{ y: 20, scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 330,
          damping: 12,
          duration: 0.8,
        }}
      >
        <div className="catsCountContainer">
          <h1>Purrfect Matches Archive</h1>
          {error ? (
            <span>Currently you have no cats adopted</span>
          ) : (
            cats &&
            totalItems !== 0 && (
              <span>
                Currently you have {totalItems} cat{totalItems > 1 && "s"}{" "}
                adopted
              </span>
            )
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
        <ul className="catsList list">{renderCats()}</ul>
      </motion.div>
      {isEditDialogOpen && (
        <ModifyCatForm catDetail={currentCat} onClose={handleCloseEditDialog} />
      )}
    </div>
  );
}
