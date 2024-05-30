import React from "react";
import { motion } from "framer-motion";
import CustomSelect from "./CustomSelect.jsx";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

function Pagination({ currentPage, totalPages, onPageChange, displayPages }) {
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

  const renderPageSelectDropdown = () => {
    let options = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        options.push({
          value: i,
          label: `Page ${i}`,
        });
      }
    } else {
      options.push({
        value: 1,
        label: `Page 1`,
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
          label: `Page ${i}`,
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
        label: `Page ${totalPages}`,
      });
    }

    const selectedOption = options.find(
      (option) => option.value === currentPage,
    );

    return (
      <CustomSelect
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
          <motion.div
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevClick}
            className="paginationButton"
          >
            <FaArrowLeftLong />
          </motion.div>
        )}
        {displayPages && totalPages > 1 && renderPageSelectDropdown()}
        {currentPage < totalPages && (
          <motion.div
            whileTap={{ scale: 0.9 }}
            onClick={handleNextClick}
            className="paginationButton"
          >
            <FaArrowRightLong />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Pagination;
