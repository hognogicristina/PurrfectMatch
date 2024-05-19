import { useState, useEffect } from "react";
import { getAuthToken } from "../../../../util/auth.js";
import { motion } from "framer-motion";
import SubmitDialog from "../../Custom/Reuse/SubmitDialog.jsx";

export default function AdoptCat({ catDetail, userDetails }) {
  const [token, setToken] = useState(getAuthToken());
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

  return (
    <div className="ownerGuardian">
      {!catDetail.owner && (
        <>
          <p className="guardian">Regards,</p>
          <p className="guardian">{catDetail.guardian}</p>
        </>
      )}
      {!catDetail.owner &&
        token &&
        !requestExists &&
        catDetail.user !== userDetails.username && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="simpleButton submit"
            onClick={handleAdoptMeClick}
          >
            Adopt Me
          </motion.button>
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
