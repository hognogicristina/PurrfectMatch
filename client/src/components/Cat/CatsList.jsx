import React from "react";
import "./Cat.css";
import FilterBar from "../Util/Functionalities/FilterBar.jsx";
import SortDropdown from "../Util/Functionalities/SortDropdown.jsx";
import Select from "react-select";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function CatsList({ cats, currentPage, onPageChange }) {
  const { data, error, totalPages } = cats;
  const navigate = useNavigate();

  const handleClickCatItem = (id) => {
    navigate(`/cats/cat/${id}`);
  };

  const renderPagination = () => (
    <div className="pagination">
      {currentPage > 1 && (
        <button onClick={() => onPageChange(currentPage - 1)}>Prev</button>
      )}
      <span>
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
      )}
    </div>
  );

  const customStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      borderColor: "#ff8bbd",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#ff6392",
      },
      borderRadius: "8px",
      cursor: "pointer",
    }),
    option: (styles, { isFocused, isSelected, isActive }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#ff8bbd"
        : isFocused
          ? "#ffe6f2"
          : isActive
            ? "#ffadd6"
            : null,
      color: isSelected ? "white" : "black",
      cursor: "pointer",
      ":active": {
        ...styles[":active"],
        backgroundColor: isActive ? "#ff6392" : null,
      },
    }),
    singleValue: (styles) => ({
      ...styles,
      color: "#333",
    }),
  };

  const renderPageSelectDropdown = () => {
    let options = [];
    for (let i = 1; i <= totalPages; i++) {
      options.push({
        value: i,
        label: `Page ${i}`,
      });
    }

    const selectedOption = options.find(
      (option) => option.value === currentPage,
    );

    return (
      <Select
        styles={customStyles}
        value={selectedOption}
        onChange={(selectedOption) => onPageChange(selectedOption.value)}
        options={options}
        placeholder="Select a page..."
      />
    );
  };

  const renderCats = () => {
    if (cats && Array.isArray(data)) {
      return data.map((cat, index) => (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
            transition: { duration: 0.3, delay: index * 0.01 },
          }}
          viewport={{ once: true }}
          key={index}
          className="catItem"
          onClick={() => handleClickCatItem(cat.id)}
        >
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
      return (
        <div className="errorContainerCats">
          {error.map((err, index) => (
            <p key={index} className="errorMessageCats">
              {err.message}
            </p>
          ))}
        </div>
      );
    } else {
      return (
        <div className="errorContainerCats">
          <p className="errorMessageCats">
            Unable to load cats. Please try again later.
          </p>
        </div>
      );
    }
  };

  return (
    <div
      className="catsPageContainer"
      style={{ position: "relative", height: "100vh" }}
    >
      <FilterBar />
      <div className="catsListContainer">
        <div className="topControls">
          <SortDropdown />
          {totalPages > 1 && renderPageSelectDropdown()}
        </div>
        <div className="catsContainer">
          <div className="catsList">{renderCats()}</div>
          {totalPages > 1 && renderPagination()}
        </div>
      </div>
    </div>
  );
}

export default CatsList;
