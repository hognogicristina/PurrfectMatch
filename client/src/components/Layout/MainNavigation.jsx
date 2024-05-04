import React, { useState } from "react";
import "./MainNavigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faHeart,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import CatNavigation from "./CatNavigation.jsx";

function MainNavigation() {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const [showCatsNav, setShowCatsNav] = useState(false);

  const toggleCatsNav = () => setShowCatsNav((prev) => !prev);

  return (
    <header className="mainNavigatiom">
      <div className="mainContainer">
        <NavLink to="/">
          <motion.div whileHover={{ scale: 1.1 }}>
            <h1 className="logo">purrfectMatch</h1>
          </motion.div>
        </NavLink>
        {!isAuth ? (
          <NavLink to="/cats" className="links">
            All Cats
          </NavLink>
        ) : (
          <motion.div onClick={toggleCatsNav} className="catsNav">
            Cats
            <FontAwesomeIcon
              icon={showCatsNav ? faChevronUp : faChevronDown}
              className="indicator"
            />
          </motion.div>
        )}
      </div>
      {showCatsNav && <CatNavigation />}
      <div className="controlContainer">
        {isAuth ? (
          <>
            <NavLink to="/adopts" className="links">
              <FontAwesomeIcon icon={faEnvelope} />
            </NavLink>
            <NavLink to="/cats" className="links">
              <FontAwesomeIcon icon={faHeart} />
            </NavLink>
            <NavLink to="/profile" className="links">
              My Profile
            </NavLink>
          </>
        ) : (
          <motion.div whileTap={{ scale: 0.9 }} className="loginLink">
            <NavLink to="/login">Log In</NavLink>
          </motion.div>
        )}
      </div>
    </header>
  );
}

export default MainNavigation;
