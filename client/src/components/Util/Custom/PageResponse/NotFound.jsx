import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { motion } from "framer-motion";
import "../../../../styles/Auth/Activation.css";

function NotFoundPage() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      key={location.pathname}
      initial={{ y: 20, scale: 0.95, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 330,
        damping: 12,
        duration: 0.8,
      }}
    >
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
    </motion.div>
  );
}

export default NotFoundPage;
