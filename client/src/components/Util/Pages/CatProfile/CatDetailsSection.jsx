import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdoptCat from "./AdoptCat.jsx";

export default function CatDetailsSection({
  catDetail,
  userDetails,
  userEditCat,
  handleEditClick,
}) {
  const navigate = useNavigate();

  const handleBreedClick = () => {
    navigate(`/cats?selectedBreed=${catDetail.breed}&page=1`);
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
                ? "This cat is already adopted"
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
          <p>Life Stage: {catDetail.lifeStage}</p>
          {catDetail.healthProblem ? (
            <p>Health Problem: {catDetail.healthProblem}</p>
          ) : (
            <p>Health Problem: No health problems</p>
          )}
        </div>
        {userDetails && userDetails.username === userEditCat && (
          <FontAwesomeIcon
            icon={faEdit}
            className="editIcon"
            onClick={handleEditClick}
          />
        )}
      </div>
    </motion.div>
  );
}
