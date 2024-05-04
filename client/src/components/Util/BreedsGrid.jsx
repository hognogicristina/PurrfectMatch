import React, { useState } from "react";

export default function BreedsGrid({ breeds }) {
  const [startIndex, setStartIndex] = useState(0);
  const displayCount = 5;

  const prevCat = () => {
    const newIndex = startIndex > 0 ? startIndex - 1 : breeds.data.length - 1;
    setStartIndex(newIndex);
  };

  const nextCat = () => {
    const newIndex = (startIndex + 1) % breeds.data.length;
    setStartIndex(newIndex);
  };

  const getDisplayBreeds = () => {
    const result = [];
    for (let i = 0; i < displayCount; i++) {
      const breedIndex = (startIndex + i) % breeds.data.length;
      result.push(breeds.data[breedIndex]);
    }
    return result;
  };

  return (
    <>
      <button className="prevButton" onClick={prevCat}>
        &#9664;
      </button>
      <div className="breedsGrid">
        {getDisplayBreeds().map((breed, index) => (
          <div key={index}>
            className="breedCard" >
            <img src={breed.url} alt={breed.name} className="breedImage" />
            <p className="breedName">{breed.name}</p>
          </div>
        ))}
      </div>
      <button className="nextButton" onClick={nextCat}>
        &#9654;
      </button>
    </>
  );
}
