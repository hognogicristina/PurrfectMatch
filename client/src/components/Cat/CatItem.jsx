import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/ToastProvider.jsx";

export default function CatItem({ catDetail }) {
  const catsByBreed = catDetail.breed;
  const { notifyError } = useToast();
  const [cats, setCats] = useState([]);

  useEffect(() => {
    async function fetchCatsByBreed() {
      const response = await fetch(
        `http://localhost:3000/catsByBreed/${catsByBreed}`,
      );
      const data = await response.json();
      if (response.ok) {
        setCats(
          data.data.map((cat) => ({
            value: cat.name,
            label: cat.name,
            image: cat.images[0],
            lifeStage: cat.lifeStage,
          })),
        );
      } else {
        notifyError(data.message);
        return null;
      }
    }

    fetchCatsByBreed();
  }, [catsByBreed, notifyError]);

  return (
    <>
      <div className="catItemContainer">
        <div className="catItemImages">
          {catDetail.images && catDetail.images.length > 0 && (
            <img
              src={catDetail.images[0]}
              alt={catDetail.name}
              className="mainImage"
            />
          )}
          <div className="imageCarousel">
            {catDetail.images &&
              catDetail.images
                .slice(1)
                .map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Additional view of ${catDetail.name}`}
                  />
                ))}
          </div>
        </div>
        <div className="catItemDetails">
          <h1>{catDetail.name}</h1>
          <div className="catItemDetailsTop">
            <p className="breedLink">{catDetail.breed}</p>
            <div className="dotSeparator"></div>
            <p className="addressGuardian">{catDetail.address}</p>
          </div>
          <h2>About {catDetail.name}</h2>
          <table className="catDetailsTable">
            <thead>
              <tr>
                <th>Gender</th>
                <th>Life Stage</th>
                <th>Health Issues</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{catDetail.gender}</td>
                <td>{catDetail.lifeStage}</td>
                <td>{catDetail.healthProblem}</td>
              </tr>
            </tbody>
          </table>
          <h2>Understand {catDetail.name} better</h2>
          <p className="aboutCat">{catDetail.description}</p>
          <div className="ownerGuardian">
            {catDetail.owner ? (
              <p>Owner: {catDetail.owner}</p>
            ) : (
              <p>Guardian: {catDetail.guardian}</p>
            )}

            {!catDetail.owner && (
              <button className="simpleButton submit">Adopt Me</button>
            )}
          </div>

          <FontAwesomeIcon
            icon={faEdit}
            className="editIcon"
            onClick={() => alert("Edit mode activated")}
          />
        </div>
      </div>

      <h2>Other Cats You May Like</h2>
      <ul className="otherCatsList">
        {cats.slice(0, 5).map((cat, index) => (
          <li key={index} className="otherCatCard">
            <img src={cat.image} alt={cat.label} />
            <div className="otherCatInfo">
              <h3>{cat.label}</h3>
              <p>{cat.lifeStage}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
