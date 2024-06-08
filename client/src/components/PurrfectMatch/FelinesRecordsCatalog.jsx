import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";
import "../../styles/PurrfectMatch/CatsArchive.css";
import Pagination from "../Util/Custom/Reuse/Pagination.jsx";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import ModifyCatForm from "../Cat/ModifyCatForm.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoTrashBin } from "react-icons/io5";
import DeleteCatDialog from "../Cat/DeleteCatDialog.jsx";

export default function FelinesRecordsCatalog({
  cats,
  currentPage,
  setSearchParams,
}) {
  const { data, error, totalPages, totalItems } = cats;
  const { notifyError } = useToast();
  const navigate = useNavigate();
  const [currentCat, setCurrentCat] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchParamsKey, setSearchParamsKey] = useState(0);
  const [catList, setCatList] = useState(data || []);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setSearchParamsKey((prevKey) => prevKey + 1);
    setCatList(data);
  }, [currentPage, cats, data]);

  const handleEditClick = (cat) => {
    setCurrentCat(cat);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setCurrentCat(null);
  };

  const handleCatClick = (id) => {
    navigate(`/cats/cat/${id}`);
  };

  const handleUpdateCatDetail = (updatedCatDetail) => {
    setCatList((prevCatList) =>
      prevCatList.map((cat) =>
        cat.id === updatedCatDetail.id ? updatedCatDetail : cat,
      ),
    );
  };

  const openDeleteDialog = (cat) => {
    setCurrentCat(cat);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCurrentCat(null);
  };

  const handlePageChange = (newSearchParams) => {
    setSearchParams(new URLSearchParams(newSearchParams.toString()), {
      replace: true,
    });
  };

  const renderCats = () => {
    if (cats && Array.isArray(catList) && catList.length > 0) {
      return catList.map((cat, index) => (
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
          style={{ backgroundImage: `url(${cat.images[0]})` }}
          onClick={() => handleCatClick(cat.id)}
        >
          {cat.status === "active" && (
            <>
              <div
                className="editIconContainer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(cat);
                }}
              >
                <FaEdit />
              </div>
              <motion.div
                className="trashIcon listTrashIcon"
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteDialog(cat);
                }}
              >
                <IoTrashBin />
              </motion.div>
            </>
          )}
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
            <p className="errorMessageCats">{errorMessage}</p>
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
          <h1>Rehomed Felines Records</h1>
          {error ? (
            <span>Currently you have no cats sent to adoption</span>
          ) : (
            cats &&
            totalItems !== 0 && (
              <span>
                Currently you have {totalItems} cat{totalItems > 1 && "s"} sent
                to adoption
              </span>
            )
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        <ul className="catsList list">{renderCats()}</ul>
      </motion.div>
      {isEditDialogOpen && (
        <ModifyCatForm
          catDetail={currentCat}
          onClose={handleCloseEditDialog}
          onSubmit={handleUpdateCatDetail}
        />
      )}
      {isDeleteDialogOpen && (
        <DeleteCatDialog onClose={closeDeleteDialog} cat={currentCat} />
      )}
    </div>
  );
}
