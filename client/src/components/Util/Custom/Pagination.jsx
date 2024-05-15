import React from "react";
import Select from "react-select";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import { motion } from "framer-motion";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

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

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        options.push({
          value: i,
          label: `Page ${i} of ${totalPages}`,
        });
      }
    } else {
      options.push({
        value: 1,
        label: `Page 1 of ${totalPages}`,
      });

      let startPage = Math.max(2, currentPage - 2);
      let endPage = Math.min(totalPages - 1, currentPage + 2);

      if (startPage > 2) {
        options.push({
          value: "...",
          label: "...",
          isDisabled: true,
        });
      }

      for (let i = startPage; i <= endPage; i++) {
        options.push({
          value: i,
          label: `Page ${i} of ${totalPages}`,
        });
      }

      if (endPage < totalPages - 1) {
        options.push({
          value: "...",
          label: "...",
          isDisabled: true,
        });
      }

      options.push({
        value: totalPages,
        label: `Page ${totalPages} of ${totalPages}`,
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
        isOptionDisabled={(option) => option.isDisabled}
      />
    );
  };

  return (
    <div className="pagination">
      <div className="paginationButtons">
        {currentPage > 1 && (
          <motion.button whileTap={{ scale: 0.9 }} onClick={handlePrevClick}>
            <FaArrowCircleLeft />
          </motion.button>
        )}
        {totalPages > 1 && renderPageSelectDropdown()}
        {currentPage < totalPages && (
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleNextClick}>
            <FaArrowCircleRight />
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default Pagination;
