import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner.jsx";
import "../../Authentification/Activation.css";

function NotFoundPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className="container">
        <div className="errorContainer">
          <img
            src="/errorCat.png"
            alt="errorCat"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
          <div className="elementsContainer">
            <h1>404 - Page Not Found</h1>
            <p>Oops! The page you're looking for doesn't exist.</p>
            <Link to="/">Go Home</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFoundPage;
