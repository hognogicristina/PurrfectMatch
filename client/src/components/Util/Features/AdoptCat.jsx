import { useState, useEffect } from "react";
import { getAuthToken } from "../../../util/auth.js";
import { motion } from "framer-motion";
import SubmitDialog from "../Custom/Reuse/SubmitDialog.jsx";

export default function AdoptCat({ catDetail, userDetails }) {
  const [token, setToken] = useState(getAuthToken());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setToken(getAuthToken());
  }, []);

  const handleAdoptMeClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
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
        !isDialogOpen &&
        token &&
        catDetail.user !== userDetails.username && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="simpleButton submit"
            onClick={() => handleAdoptMeClick(catDetail.id)}
          >
            Adopt Me
          </motion.button>
        )}
      <SubmitDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        catDetail={catDetail}
        token={token}
      />
    </div>
  );
}
