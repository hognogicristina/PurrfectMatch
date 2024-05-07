import React from "react";
import "./MainNavigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faHeart,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { NavLink, useRouteLoaderData } from "react-router-dom";

import CatNavigation from "./CatNavigation.jsx";

function MainNavigation() {
  const token = useRouteLoaderData("root");

  return (
    <header className="mainNavigatiom">
      <div className="mainContainer">
        <NavLink to="/">
          <motion.div whileHover={{ scale: 1.1 }}>
            <h1 className="logo">purrfectMatch</h1>
          </motion.div>
        </NavLink>
        {!token ? (
          <NavLink to="/cats" className="links">
            All Cats
          </NavLink>
        ) : (
          <div className="dropdown">
            <button className="dropbtn">Cats</button>
            <motion.div
              whileInView={{ y: [-50, 0], opacity: [0, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="dropdownContent"
            >
              <CatNavigation />
            </motion.div>
          </div>
        )}
      </div>
      <div className="controlContainer">
        {token ? (
          <>
            <NavLink to="/adopts" className="links">
              <FontAwesomeIcon icon={faEnvelope} />
            </NavLink>
            <NavLink to="/cats" className="links">
              <FontAwesomeIcon icon={faHeart} />
            </NavLink>
            <NavLink to="/user" className="links">
              My Profile
            </NavLink>
          </>
        ) : (
          <>
            <motion.div whileTap={{ scale: 0.9 }} className="loginLink">
              <NavLink to="/login">Log In</NavLink>
            </motion.div>
            <motion.div whileTap={{ scale: 0.9 }} className="registerLink">
              <NavLink to="/register">Register</NavLink>
            </motion.div>
          </>
        )}
      </div>
    </header>
  );
}

export default MainNavigation;
