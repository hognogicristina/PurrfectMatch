import { useToast } from "../Util/Custom/ToastProvider.jsx";
import { motion } from "framer-motion";
import "./ListCatsUser.css";
import NoResultMessage from "../Util/Custom/NoResultMessage.jsx";
import Pagination from "../Util/Custom/Pagination.jsx";
import { useEffect, useState } from "react";

export default function SendToAdoptionList({
  cats,
  currentPage,
  onPageChange,
}) {
  const { data, error, totalPages } = cats;
  const { notifyError } = useToast();
  const [searchParamsKey, setSearchParamsKey] = useState(0);

  useEffect(() => {
    setSearchParamsKey((prevKey) => prevKey + 1);
  }, [currentPage, cats]);

  const renderCats = () => {
    if (cats && Array.isArray(data)) {
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
        return <NoResultMessage message={errorMessage} />;
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
            data.length !== 0 && (
              <span>
                Currently you have {data.length} cats sent to adoption
              </span>
            )
          )}
        </div>
        <ul className="catsList list">{renderCats()}</ul>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </motion.div>
    </div>
  );
}
