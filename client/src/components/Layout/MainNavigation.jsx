import { useEffect, useState } from "react";
import "../../styles/PurrfectMatch/MainNavigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faHeart,
  faInbox,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { NavLink, useLocation, useRouteLoaderData } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import CatsNavigation from "./CatsNavigation.jsx";

function MainNavigation() {
  const token = useRouteLoaderData("root");
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const isUserPage = location.pathname === "/user";

  const userMenuButtonStyle = {
    border: isUserPage ? "3px solid #AE3D72FF" : "3px solid #e37fb6",
    transition: "border 0.3s ease-in-out",
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
  };

  const userMenuVariants = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownContent = document.querySelector(".dropdownContent");
      if (dropdownContent && !dropdownContent.contains(event.target)) {
        closeDropdown();
      }
    };

    if (isOpen || isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isUserMenuOpen]);

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
            <motion.p whileTap={{ scale: 0.9 }}>Find a Friend</motion.p>
          </NavLink>
        ) : (
          <div className="dropdown">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="dropbtn"
              onClick={toggleDropdown}
              style={{
                width: isOpen ? "250px" : "100px",
                scaleX: isOpen ? 1 : 1,
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
                  <CatsNavigation onClose={closeDropdown} />
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
              <motion.div whileTap={{ scale: 0.9 }}>
                <FontAwesomeIcon icon={faEnvelope} />
              </motion.div>
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                isActive ? "links active-link" : "links"
              }
            >
              <motion.div whileTap={{ scale: 0.9 }}>
                <FontAwesomeIcon icon={faHeart} />
              </motion.div>
            </NavLink>
            <div className="vertical-line"></div>
            <NavLink
              to="/inbox"
              className={({ isActive }) =>
                isActive ? "links active-link" : "links"
              }
            >
              <motion.div whileTap={{ scale: 0.9 }}>
                <FontAwesomeIcon icon={faInbox} />
              </motion.div>
            </NavLink>
            <div className="userMenuContainer">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleUserMenu}
                className="dropbtn userMenu"
                style={userMenuButtonStyle}
              >
                <FontAwesomeIcon icon={faUser} />
              </motion.button>
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    className="dropdownContent userMenu"
                    variants={userMenuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <NavLink
                      to="/user"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      to="/logout"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Logout
                    </NavLink>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
