import { useState } from "react";
import "./MainNavigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function MainNavigation() {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const [isSearchBarOpen, setSearchBarOpen] = useState(false);

  const handleSearchIconClick = () => {
    setSearchBarOpen(!isSearchBarOpen);
  };

  return (
    <header className="header">
      <div className="linksContainer">
        <NavLink to="/">
          <motion.div whileHover={{ scale: 1.1 }}>
            <h1 className="logo">purrfectMatch</h1>
          </motion.div>
        </NavLink>
        <NavLink to="/cats" className="links">
          All Cats
        </NavLink>
      </div>
      <div className="controlContainer">
        {!isAuth && (
          <>
            <NavLink to="/cats" className="links">
              <FontAwesomeIcon icon={faStar} />
            </NavLink>
            <NavLink to="/profile" className="profileLink">
              <FontAwesomeIcon icon={faUser} />
            </NavLink>
          </>
        )}
        {!isAuth && (
          <div className="loginLink">
            <NavLink to="/login">Log In</NavLink>
          </div>
        )}
      </div>
    </header>
  );
}

export default MainNavigation;
