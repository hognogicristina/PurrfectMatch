import React, { useState } from "react";
import "./MainNavigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faHeart,
  faInbox,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { NavLink, useRouteLoaderData } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import CatNavigation from "./CatNavigation.jsx";

function MainNavigation() {
  const token = useRouteLoaderData("root");
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonExpanded, setIsButtonExpanded] = useState(false);

  const toggleDropdown = () => {
    setIsButtonExpanded((prev) => !prev);
    setIsOpen(!isOpen);
  };

  const dropdownVariants = {
    hidden: {
      clipPath: "inset(10% 50% 90% 50% round 10px)",
      opacity: 0,
      transition: {
        type: "spring",
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    visible: {
      clipPath: "inset(0% 0% 0% 0% round 10px)",
      opacity: 1,
      transition: {
        type: "spring",
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.1,
      },
    },
  };

  const arrowVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
  };

  return (
    <header className="mainNavigatiom">
      <div className="mainContainer">
        <NavLink to="/">
          <motion.div whileHover={{ scale: 1.1 }}>
            <h1 className="logo">purrfectMatch</h1>
          </motion.div>
        </NavLink>
        {!token ? (
          <NavLink to="/cats" className="linkButton catalog">
            Catalog
          </NavLink>
        ) : (
          <div className="dropdown">
            <motion.button
              className="dropbtn"
              onClick={toggleDropdown}
              style={{
                width: isButtonExpanded ? "250px" : "100px",
                scaleX: isButtonExpanded ? 1 : 1,
                transition: "width 0.3s, transform 0.5s",
              }}
            >
              Cats
              <motion.svg
                width="15"
                height="15"
                viewBox="0 0 20 20"
                initial={false}
                animate={isOpen ? "open" : "closed"}
                variants={arrowVariants}
                transition={{ duration: 0.2 }}
              >
                <path d="M0 7 L 20 7 L 10 16" />
              </motion.svg>
            </motion.button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="dropdownContent"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <CatNavigation />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      <div className="controlContainer">
        {token ? (
          <>
            <NavLink
              to="/adopts"
              className={({ isActive }) =>
                isActive ? "links active-link" : "links"
              }
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                isActive ? "links active-link" : "links"
              }
            >
              <FontAwesomeIcon icon={faHeart} />
            </NavLink>
            <div className="vertical-line"></div>
            <NavLink
              to="/inbox"
              className={({ isActive }) =>
                isActive ? "links active-link" : "links"
              }
            >
              <FontAwesomeIcon icon={faInbox} />
            </NavLink>
            <NavLink
              to="/user"
              className={({ isActive }) =>
                isActive ? "links active-link" : "links"
              }
            >
              <FontAwesomeIcon icon={faUser} />
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
