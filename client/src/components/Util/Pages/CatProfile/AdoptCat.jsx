import { useState, useEffect } from "react";
import { getAuthToken } from "../../../../util/auth.js";
import { motion } from "framer-motion";
import SubmitDialog from "../../Custom/Reuse/SubmitDialog.jsx";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

export default function AdoptCat({ catDetail, userDetails }) {
  const [token, setToken] = useState(getAuthToken());
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestExists, setRequestExists] = useState(false);

  useEffect(() => {
    setToken(getAuthToken());
  }, []);

  useEffect(() => {
    const checkAdoptionRequest = async () => {
      if (token) {
        const response = await fetch(
          `http://localhost:3000/adopt/${catDetail.id}/validate`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        setRequestExists(data.exists);
      }
    };

    checkAdoptionRequest();
  }, [catDetail.id, token]);

  const handleAdoptMeClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleRequestSuccess = () => {
    setRequestExists(true);
  };

  const openUserDetails = () => {
    navigate(`/user-profile/${catDetail.user}`);
  };

  const renderUserImage = () => {
    if (catDetail.imageUser) {
      return (
        <img
          className="userImageLogout catAdopt"
          src={catDetail.imageUser}
          alt="user"
        />
      );
    } else {
      return <FontAwesomeIcon icon={faUserCircle} className="userIcon" />;
    }
  };

  return (
    <div className="ownerGuardian">
      {!catDetail.owner && (
        <>
          <div className="regardsContainer" onClick={openUserDetails}>
            {renderUserImage()}
            <div>
              <p className="guardian">Regards,</p>
              <p className="guardian linkUser">{catDetail.guardian}</p>
            </div>
          </div>
        </>
      )}
      {!catDetail.owner &&
        token &&
        !requestExists &&
        catDetail.user !== userDetails.username &&
        userDetails.role === "user" && (
          <div className="adoptMeContainer">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="simpleButton submit"
              onClick={handleAdoptMeClick}
            >
              Adopt Me
            </motion.button>
          </div>
        )}
      <SubmitDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        catDetail={catDetail}
        token={token}
        onRequestSuccess={handleRequestSuccess}
      />
    </div>
  );
}
