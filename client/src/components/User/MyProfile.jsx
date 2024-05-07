import "./MyProfile.css";
import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { NavLink } from "react-router-dom";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logout from "../../pages/Authentification/Logout.jsx";
import { motion } from "framer-motion";

function MyProfile({ userDetail }) {
  useEffect(() => {
    if (userDetail.error) {
      toast.error(userDetail.error[0].message);
    }
  }, [userDetail]);

  const renderUserImage = () => {
    if (userDetail.image) {
      return <img className="userImage" src={userDetail.image} alt="user" />;
    } else {
      return <FontAwesomeIcon icon={faUserCircle} className="faUserCircle" />;
    }
  };

  function renderExperienceLevel(experienceLevel) {
    const totalCircles = 5;
    let circles = [];

    for (let i = 0; i < totalCircles; i++) {
      circles.push(
        <span
          key={i}
          className={i < experienceLevel ? "circle green" : "circle gray"}
        />,
      );
    }

    return <div className="experienceCircles">{circles}</div>;
  }

  return (
    <div className="userDetailContainer">
      <motion.div
        className="userContent myProfile"
        initial={{ x: "-9vh", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
      >
        <div className="userSlideBarLeft">
          <div>{renderUserImage()}</div>
          <span className="titleFont">
            {userDetail.firstName} {userDetail.lastName}
          </span>
          <span className="textFont">{userDetail.username}</span>
          <span className="userEmail">{userDetail.email}</span>
          <div className="controlProfileContainer">
            <NavLink to="/user/edit" className="controlProfile edit">
              Edit profile
            </NavLink>
            <NavLink to="/user/delete" className="controlProfile delete">
              Delete account
            </NavLink>
          </div>
        </div>
        <div className="userSlideBarRight">
          <span className="titleFont">About me</span>
          <span className="textFont">
            {userDetail.description || "No description provided."}
          </span>
          <span className="subtitleFont">
            <strong>Hobbies:</strong>{" "}
            <span>{userDetail.hobbies || "No hobbies provided."}</span>
          </span>
          <span className="subtitleFont">
            <strong>Experience level:</strong>
            {userDetail.experienceLevel
              ? renderExperienceLevel(userDetail.experienceLevel)
              : renderExperienceLevel(0)}
          </span>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={6000}
          closeButton={false}
        />
      </motion.div>
    </div>
  );
}

export default MyProfile;
