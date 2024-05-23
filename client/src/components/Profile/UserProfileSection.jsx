import "../../styles/Auth/UserProfile.css";
import { useEffect, useState } from "react";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { useNavigate } from "react-router-dom";
import UserFelinesRecordsCatalog from "../PurrfectMatch/UserFelinesRecordsCatalog.jsx";
import UserOwnedArchiveCatalog from "../PurrfectMatch/UserOwnedArchiveCatalog.jsx";

function UserProfileSection({ userProfile }) {
  const { notifyError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile.error) {
      notifyError(userProfile.error[0].message);
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

  return (
    <div className="profileContainer">
      <div className="profileForUser">
        <div className="profileContentForUser">
          <div className="userSlideDetailsLeft">
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
            </div>
            <p className="linkButton cancel" onClick={() => navigate(-1)}>
              Cancel
            </p>
          </div>
          <div className="contanctInfoUser">
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
          </div>
        </div>
      </div>
      <div className="listsContainer">
        <UserOwnedArchiveCatalog username={userProfile.username} />
        <UserFelinesRecordsCatalog username={userProfile.username} />
      </div>
    </div>
  );
}

export default UserProfileSection;
