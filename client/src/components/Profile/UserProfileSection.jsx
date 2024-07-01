import "../../styles/Auth/UserProfile.css";
import { useEffect } from "react";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { useNavigate } from "react-router-dom";
import UserFelinesRecordsCatalog from "../PurrfectMatch/UserFelinesRecordsCatalog.jsx";
import UserOwnedArchiveCatalog from "../PurrfectMatch/UserOwnedArchiveCatalog.jsx";
import { motion } from "framer-motion";
import { getAuthToken } from "../../util/auth.js";

function UserProfileSection({ userProfile }) {
  const { notifyError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile.error) {
      userProfile.error.forEach((err) => {
        notifyError(err.message);
      });
    }
  }, [userProfile]);

  const renderExperienceLevel = (experienceLevel) => {
    let circles = [];
    for (let i = 0; i < 5; i++) {
      circles.push(
        <span
          key={i}
          className={`circle ${i < experienceLevel ? "green" : "gray"}`}
        />,
      );
    }
    return <div className="experienceCirclesUser">{circles}</div>;
  };

  const renderHobbies = (hobbies) => {
    if (!hobbies)
      return <span className="hobbyTagUser">No hobbies provided.</span>;
    return hobbies.split(",").map((hobby, index) => (
      <span key={index} className="hobbyTagUser">
        {hobby.trim()}
      </span>
    ));
  };

  const renderUserImage = () => {
    if (userProfile.image) {
      return (
        <img className="userImageProfile" src={userProfile.image} alt="user" />
      );
    } else {
      return <FontAwesomeIcon icon={faUserCircle} className="faUserCircle" />;
    }
  };

  const handleContactClick = async () => {
    const token = getAuthToken();
    const response = await fetch(
      `http://localhost:3000/inbox/search?user=${userProfile.username}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();
    if (response.ok) {
      const user = result.data[0];
      navigate(
        `/inbox?userId=${user.id}&userName=${user.displayName}&image=${user.image}`,
      );
    } else {
      result.error.forEach((err) => {
        notifyError(err.message);
      });
    }
  };

  return (
    <motion.div
      className="profileContainer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="profileForUser"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="profileContentForUser">
          <motion.div
            className="userSlideDetailsLeft"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div>{renderUserImage()}</div>
            <div className="contanctInfoUser">
              <span className="titleFontUser">
                {userProfile.firstName} {userProfile.lastName}
              </span>
              <span className="textFontUser">{userProfile.username}</span>
              <span className="userPersonalInfo">
                <strong>Email: </strong>
                {userProfile.email}
              </span>
              <span className="userPersonalInfo">
                <strong>Birthday: </strong>
                {userProfile.birthday}
              </span>
              <span className="userPersonalInfo">
                <strong>Location: </strong>
                {userProfile.country}, {userProfile.city}
              </span>
              <span className="userPersonalInfo">
                <span
                  className="hobbyTagUser contact"
                  onClick={handleContactClick}
                >
                  Contact
                </span>
              </span>
            </div>
            <p className="linkButton cancel" onClick={() => navigate(-1)}>
              Cancel
            </p>
          </motion.div>
          <motion.div
            className="contanctInfoUser"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="titleFontUser">About {userProfile.firstName}</span>
            <span className="textFontUser">
              {userProfile.description || "No description provided."}
            </span>
            <span className="subtitleFontUser">
              <strong>Hobbies:</strong>
              <div className="hobbiesContainerStyle">
                {renderHobbies(userProfile.hobbies)}
              </div>
            </span>
            <span className="subtitleFontUser">
              <strong>Experience level:</strong>
              {renderExperienceLevel(userProfile.experienceLevel)}
            </span>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="listsContainer"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <UserOwnedArchiveCatalog username={userProfile.username} />
        <UserFelinesRecordsCatalog username={userProfile.username} />
      </motion.div>
    </motion.div>
  );
}

export default UserProfileSection;
