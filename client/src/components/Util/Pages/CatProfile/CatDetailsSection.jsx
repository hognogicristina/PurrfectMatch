import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdoptCat from "./AdoptCat.jsx";
import FavoriteHeart from "../../Features/FavoriteHeart.jsx";
import { FaEdit } from "react-icons/fa";
import { useToast } from "../../Custom/PageResponse/ToastProvider.jsx";
import { getAuthToken } from "../../../../util/auth.js";
import { IoTrashBin } from "react-icons/io5";
import ConfirmDialog from "../../Custom/Reuse/ConfirmDialog.jsx";
import { useState } from "react";

export default function CatDetailsSection({
  catDetail,
  userDetails,
  userEditCat,
  handleEditClick,
}) {
  const navigate = useNavigate();
  const { notifyError } = useToast();
  const token = getAuthToken();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [catIdToDelete, setCatIdToDelete] = useState(null);

  const handleBreedClick = () => {
    navigate(`/cats?selectedBreed=${catDetail.breed}&page=1`);
  };

  const handleDeleteCat = async () => {
    const token = getAuthToken();
    const response = await fetch(
      `http://localhost:3000/cat/${catDetail.id}/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();
    if (response.ok) {
      notifyError(data.status);
      navigate("/cats");
    } else {
      data.error.forEach((err) => {
        if (err.field === "server") {
          notifyError(err.message);
        }
      });
    }
  };

  const handleTrashClick = (catId) => {
    setCatIdToDelete(catId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteCat(catIdToDelete);
    setShowConfirmDialog(false);
  };

  const handleOwnerClick = (username) => {
    navigate(`/user-profile/${username}`);
  };

  return (
    <motion.div
      key={catDetail.id}
      className="catItemContainer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="catItemDetails">
        <div className="leftSection">
          <h1>{catDetail.name}</h1>
          <div className="catItemDetailsTop">
            <p className="breedLink" onClick={handleBreedClick}>
              {catDetail.breed}
            </p>
            <div className="dotSeparator"></div>
            <p className="addressGuardian">
              {catDetail.owner ? (
                <span onClick={() => handleOwnerClick(catDetail.ownerUsername)}>
                  {catDetail.name} is already adopted by
                  <span className="userLink"> {catDetail.owner}</span>
                </span>
              ) : (
                catDetail.address
              )}
            </p>
          </div>
          <p className="aboutCat">{catDetail.description}</p>
          <AdoptCat catDetail={catDetail} userDetails={userDetails} />
        </div>
        <div className="delimiter"></div>
        <div className="rightSection">
          <h2>About {catDetail.name}</h2>
          <p>Gender: {catDetail.gender}</p>
          <p>
            Life Stage: {catDetail.lifeStage} ({catDetail.age} years old)
          </p>
          <p>Color: {catDetail.color}</p>
          {catDetail.healthProblem ? (
            <p>Health Problem: {catDetail.healthProblem}</p>
          ) : (
            <p>Health Problem: No health problems</p>
          )}
        </div>
        <div className="delimiter"></div>
        <div className="addFavoriteSection">
          {token ? (
            <>
              {userDetails.role === "user" ? (
                <>
                  {!catDetail.owner ? (
                    <>
                      {userDetails.username === userEditCat ? (
                        <>
                          <h3>
                            Because you are the guardian of {catDetail.name},
                          </h3>
                          <p>
                            you may edit the details or remove the cat from your
                            profile until it finds a loving home.
                          </p>
                          <div
                            className="editIconContainer"
                            onClick={handleEditClick}
                          >
                            <FaEdit className="editIcon" />
                          </div>
                        </>
                      ) : (
                        <>
                          <h3>Consider {catDetail.name} for adoption?</h3>
                          <p>
                            Click the heart to add to your favorites until you
                            decide
                          </p>
                          <FavoriteHeart catId={catDetail.id} />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {userDetails && userDetails.username === userEditCat ? (
                        <>
                          <h3>
                            Congratulations! You are now the owner of{" "}
                            {catDetail.name}.
                          </h3>
                          <p>
                            You may edit the details or remove the cat from your
                            profile.
                          </p>
                          <div
                            className="editIconContainer"
                            onClick={handleEditClick}
                          >
                            <FaEdit className="editIcon" />
                          </div>
                        </>
                      ) : (
                        <>
                          <h3>
                            {catDetail.name} has already found a loving home.
                          </h3>
                          <p>
                            If you need further assistance, please contact the
                            owner
                            <strong
                              className="userLink"
                              onClick={() =>
                                handleOwnerClick(catDetail.ownerUsername)
                              }
                            >
                              {" "}
                              {catDetail.owner}
                            </strong>
                            .
                          </p>
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <motion.div
                    className="trashIcon"
                    initial={{ scale: 1 }}
                    whileTap={{ scale: 1.3, rotate: 180 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTrashClick(catDetail.id);
                    }}
                  >
                    <IoTrashBin className="deleteIcon" />
                  </motion.div>
                  {catDetail.owner ? (
                    <>
                      <h3>{catDetail.name} has already found a loving home</h3>
                      <p>
                        <strong
                          className="userLink"
                          onClick={() =>
                            handleOwnerClick(catDetail.ownerUsername)
                          }
                        >
                          {" "}
                          {catDetail.owner}
                        </strong>{" "}
                        is the owner
                      </p>
                    </>
                  ) : (
                    <>
                      <h3>{catDetail.name} is waiting for a loving home</h3>
                      <p>
                        <strong
                          className="userLink"
                          onClick={() => handleOwnerClick(catDetail.user)}
                        >
                          {catDetail.guardian}
                        </strong>{" "}
                        is the guardian
                      </p>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <h3>Consider {catDetail.name} for adoption?</h3>
              <p>Please sign in to add {catDetail.name} to your favorites</p>
            </>
          )}
        </div>
        {showConfirmDialog && (
          <ConfirmDialog
            title="Confirm Delete"
            message="Are you sure you want to delete this cat?"
            onClose={() => setShowConfirmDialog(false)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </div>
    </motion.div>
  );
}
