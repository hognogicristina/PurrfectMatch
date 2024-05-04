import React, { useState } from "react";

export default function BreedsGrid({ breeds }) {
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(breeds.length / itemsPerPage);

  const getStartIndex = (page) => {
    if (page === totalPages - 1) {
      const totalItems = breeds.length;
      const itemsOnLastPage = totalItems % itemsPerPage;
      if (itemsOnLastPage > 0 && itemsOnLastPage < itemsPerPage) {
        return Math.max(0, totalItems - itemsPerPage);
      }
    }
    return page * itemsPerPage;
  };

  const startIndex = getStartIndex(currentPage);
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = breeds.slice(startIndex, endIndex);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  return (
    <div className="gridContainer">
      <button onClick={handlePrev} className="paginationButton left">
        &lt;
      </button>
      <div className="breeds">
        {itemsToShow.map((breed) => (
          <div key={breed.id} className="breed">
            <img src={breed.url} alt={breed.name} className="breedImg" />
          </div>
        ))}
      </div>
      <button onClick={handleNext} className="paginationButton right">
        &gt;
      </button>
    </div>
  );
}
