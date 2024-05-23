import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdoptCat from "./AdoptCat.jsx";
import FavoriteHeart from "../../Features/FavoriteHeart.jsx";
import ModifyCatForm from "../../../Cat/ModifyCatForm.jsx";
import { FaEdit } from "react-icons/fa";
import { useToast } from "../../Custom/PageResponse/ToastProvider.jsx";
import { getAuthToken } from "../../../../util/auth.js";
import { IoTrashBin } from "react-icons/io5";

export default function CatDetailsSection({
  catDetail,
  userDetails,
  userEditCat,
  handleEditClick,
  isEditDialogOpen,
  handleCloseEditDialog,
}) {
  const navigate = useNavigate();
  const { notifyError } = useToast();
  const token = getAuthToken();

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
              {catDetail.owner
                ? `${catDetail.name} is already adopted`
                : catDetail.address}
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
                            <strong> {catDetail.owner}</strong>.
                          </p>
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="trashIcon" onClick={handleDeleteCat}>
                    <IoTrashBin className="deleteIcon" />
                  </div>
                  {catDetail.owner ? (
                    <>
                      <h3>{catDetail.name} has already found a loving home</h3>
                      <p>
                        <strong> {catDetail.owner}</strong> is the owner
                      </p>
                    </>
                  ) : (
                    <>
                      <h3>{catDetail.name} is waiting for a loving home</h3>
                      <p>
                        <strong>{catDetail.guardian}</strong> is the guardian
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
        {isEditDialogOpen && (
          <ModifyCatForm
            catDetail={catDetail}
            onClose={handleCloseEditDialog}
          />
        )}
      </div>
    </motion.div>
  );
}
