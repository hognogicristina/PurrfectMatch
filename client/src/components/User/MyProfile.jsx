import "./MyProfile.css";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useToast } from "../Util/Custom/ToastProvider.jsx";
import DeleteProfile from "./DeleteProfile.jsx";

function MyProfile({ userDetail }) {
  const [tempExperienceLevel, setTempExperienceLevel] = useState(
    userDetail.experienceLevel || 0,
  );

  const { notifyError } = useToast();
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  useEffect(() => {
    if (userDetail.error) {
      notifyError(userDetail.error[0].message);
    }
  }, [userDetail]);

  const handleExperienceClick = (index) => {
    const newLevel = index + 1;
    setTempExperienceLevel(tempExperienceLevel === newLevel ? 0 : newLevel);
  };

  const renderExperienceLevel = (experienceLevel) => {
    let circles = [];
    for (let i = 0; i < 5; i++) {
      circles.push(
        <span
          key={i}
          className={`circle ${i < experienceLevel ? "green" : "gray"}`}
          onClick={() => handleExperienceClick(i)}
        />,
      );
    }
    return <div className="experienceCircles">{circles}</div>;
  };

  const renderHobbies = (hobbies) => {
    if (!hobbies) return <span className="hobbyTag">No hobbies provided.</span>;
    return hobbies.split(",").map((hobby, index) => (
      <span key={index} className="hobbyTag">
        {hobby.trim()}
      </span>
    ));
  };

  const renderUserImage = () => {
    if (userDetail.image) {
      return <img className="userImage" src={userDetail.image} alt="user" />;
    } else {
      return <FontAwesomeIcon icon={faUserCircle} className="faUserCircle" />;
    }
  };

  const handleDeleteAccountOpen = () => {
    setShowDeleteAccount(true);
  };

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
          <span className="userPersonal">
            <strong>Email: </strong>
            {userDetail.email}
          </span>
          <span className="userPersonal">
            <strong>Birthday: </strong>
            {userDetail.birthday}
          </span>
          <div className="controlProfileContainer">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="simpleButton submit"
            >
              <NavLink to="/user/edit" className="simpleButtonText submit">
                Edit Profile
              </NavLink>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleDeleteAccountOpen}
              className="simpleButton delete"
            >
              Delete Account
            </motion.button>
          </div>
        </div>
        <div className="userSlideBarRight">
          <span className="titleFont">About me</span>
          <span className="textFont">
            {userDetail.description || "No description provided."}
          </span>
          <span className="subtitleFont">
            <strong>Hobbies:</strong>
            <div className="hobbiesContainer">
              {renderHobbies(userDetail.hobbies)}
            </div>
          </span>
          <span className="subtitleFont">
            <strong>Experience level:</strong>
            {renderExperienceLevel(userDetail.experienceLevel)}
          </span>
        </div>
      </motion.div>
      {showDeleteAccount && (
        <DeleteProfile onClose={() => setShowDeleteAccount(false)} />
      )}
    </div>
  );
}

export default MyProfile;
