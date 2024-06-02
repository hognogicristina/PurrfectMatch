import React from "react";
import { motion } from "framer-motion";
import CustomSelect from "./CustomSelect.jsx";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";

function Pagination({ currentPage, totalPages, onPageChange, displayPages }) {
  const [searchParams] = useSearchParams();

  const handlePrevClick = () => {
    if (currentPage > 1) {
      searchParams.set("page", currentPage - 1);
      onPageChange(searchParams.toString());
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      searchParams.set("page", currentPage + 1);
      onPageChange(searchParams.toString());
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
        onChange={(selectedOption) => {
          searchParams.set("page", selectedOption.value);
          onPageChange(searchParams.toString());
        }}
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
