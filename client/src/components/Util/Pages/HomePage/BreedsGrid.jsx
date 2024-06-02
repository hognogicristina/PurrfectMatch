import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../../../../styles/PurrfectMatch/HomeContent.css";
import { useNavigate } from "react-router-dom";

export default function BreedsGrid({ breeds }) {
  const navigate = useNavigate();

  const chunkedBreeds = [];
  for (let i = 0; i < breeds.length; i += 4) {
    chunkedBreeds.push(breeds.slice(i, i + 4));
  }

  const handleExploreMore = (breedName) => {
    navigate(`/cats?selectedBreed=${breedName}&page=1`);
  };

  return (
    <div className="breeds">
      <Carousel
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={3000}
        showStatus={false}
        showArrows={true}
        dynamicHeight={false}
      >
        {chunkedBreeds.map((breedGroup, index) => (
          <div key={index} className="breedGroup">
            {breedGroup.map((breed, i) => (
              <div
                key={i}
                className="breedItem"
                onClick={() => handleExploreMore(breed.name)}
              >
                <img src={breed.url} alt={breed.name} className="breedImg" />
              </div>
            ))}
          </div>
        ))}
      </Carousel>
    </div>
  );
}
