import React, { useState } from "react";
import "./HomeContent.css";
import BreedsGrid from "../Util/BreedsGrid.jsx";
import { Link } from "react-router-dom";

export default function HomeContent({ cats, breeds }) {
  return (
    <div className="homeContent">
      <div className="intro">
        <img src="cat1.jpg" alt="cat1" className="introImg bigImg" />
        <div className="hello">
          <h2 className="title">It's time to find your purrfect match</h2>
          <img src="cat2.png" alt="cat2" className="introImg smallImg" />
        </div>
      </div>
      <div className="breeds">
        <BreedsGrid breeds={breeds} />
      </div>
      <div className="about">
        <h2>About Us</h2>
        <p>
          We are a non-profit organization dedicated to finding loving homes for
          cats in need. Our mission is to match cats with loving families and to
          provide support and resources to help ensure a successful adoption.
          <Link to={"/cats"}>Find A Cat</Link>
        </p>
        <img src="cat4.jpg" alt="cat4" className="introImg aboutImg" />
      </div>
    </div>
  );
}
