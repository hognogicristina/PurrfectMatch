import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";
import "../../styles/PurrfectMatch/CatsArchive.css";
import NoResultMessage from "../Util/Custom/PageResponse/NoResultMessage.jsx";
import Pagination from "../Util/Custom/Reuse/Pagination.jsx";
import { useState } from "react";

export default function FelinesRecordsForm({ cats }) {
  const { data, error, totalItems } = cats;
  const { notifyError } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const catsPerPage = 12;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderCats = () => {
    if (cats && Array.isArray(data)) {
      const startIndex = (currentPage - 1) * catsPerPage;
      const endIndex = startIndex + catsPerPage;
      const currentCats = data.slice(startIndex, endIndex);

      return currentCats.map((cat, index) => (
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
          key={cat.id}
          className="catListItem"
          style={{ backgroundImage: `url(${cat.image})` }}
        >
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
            totalPages={Math.ceil(totalItems / catsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
        <ul className="catsList list">{renderCats()}</ul>
      </motion.div>
    </div>
  );
}
