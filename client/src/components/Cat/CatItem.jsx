import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";
import "../../styles/PurrfectMatch/Cat.css";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../util/auth.js";
import { AiFillCloseCircle } from "react-icons/ai";
import EditCatForm from "./EditCatForm.jsx";
import FavoriteHeart from "../Util/Functionalities/FavoriteHeart.jsx";

export default function CatItem({ catDetail }) {
  const navigate = useNavigate();
  const token = getAuthToken();
  const { notifyError, notifySuccess } = useToast();
  const [catsBreed, setCatsBreed] = useState([]);
  const [catsGuardian, setCatsGuardian] = useState([]);
  const [mainImage, setMainImage] = useState(catDetail.images[0]);
  const [carouselImages, setCarouselImages] = useState(
    catDetail.images.slice(1),
  );
  const [showAdoptInput, setShowAdoptInput] = useState(false);
  const [adoptionMessage, setAdoptionMessage] = useState("");
  const [userDetails, setUserDetails] = useState({ username: "", image: "" });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    async function fetchUserDetails() {
      const token = getAuthToken();
      const response = await fetch("http://localhost:3000/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setUserDetails({
          username: data.data.username,
          image: data.data.image,
        });
      } else {
        data.error.forEach((error) => {
          notifyError(error.message);
        });
      }
    }

    fetchUserDetails();
  }, [notifyError]);

  useEffect(() => {
    setMainImage(catDetail.images[0]);
    setCarouselImages(catDetail.images.slice(1));

    async function fetchCatsByBreed() {
      const response = await fetch(
        `http://localhost:3000/catsByBreed/${catDetail.id}`,
      );
      const data = await response.json();
      if (response.ok) {
        setCatsBreed(data.data);
      } else {
        notifyError(data.message);
      }
    }

    async function fetchCatsOfGuardian() {
      const response = await fetch(
        `http://localhost:3000/catsOfGuardian/${catDetail.id}`,
      );
      const data = await response.json();
      if (response.ok) {
        setCatsGuardian(data.data);
      } else {
        notifyError(data.message);
      }
    }

    fetchCatsByBreed();
    fetchCatsOfGuardian();

    return () => {
      setAdoptionMessage("");
      setShowAdoptInput(false);
    };
  }, [catDetail.id, catDetail, notifyError]);

  const mainImageStyle = {
    backgroundImage: `url(${mainImage})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    filter: "blur(20px)",
    transform: "scale(1.1)",
  };

  const handleImageClick = (selectedImage) => {
    setCarouselImages([
      mainImage,
      ...carouselImages.filter((img) => img !== selectedImage),
    ]);
    setMainImage(selectedImage);
  };

  const handleCatClick = (id) => {
    navigate(`/cats/cat/${id}`);
  };

  const handleExploreMore = (type) => {
    navigate(`/cats?selectedUserId=${type}&page=1`);
  };

  const handleExploreMoreBreed = (type) => {
    navigate(`/cats?selectedBreed=${type}&page=1`);
  };

  const toggleAdoptInput = () => {
    setShowAdoptInput(!showAdoptInput);
  };

  const handleClearAdoptionMessage = () => {
    setAdoptionMessage("");
    setShowAdoptInput(false);
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleAdoptionMessage = async (e) => {
    e.preventDefault();

    const token = getAuthToken();
    const response = await fetch(
      `http://localhost:3000/adopt/${catDetail.id}/request`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: adoptionMessage }),
      },
    );

    if (
      response.status === 400 ||
      response.status === 401 ||
      response.status === 500
    ) {
      const data = await response.json();
      if (data.error.field === "message") {
        setInputError(data.error.message);
      } else {
        notifyError(data.error.message);
      }
    } else {
      const data = await response.json();
      notifySuccess(data.status);
      setShowAdoptInput(false);
      setAdoptionMessage("");
    }
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        key={catDetail.id}
        className="catImagesContainer"
      >
        <div className="catItemImages" style={mainImageStyle}></div>
        <motion.img
          src={mainImage}
          alt={catDetail.name}
          className="mainImage"
          whileInView={{ y: [-30, 0], opacity: [0, 1] }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="imageCarousel"
          whileInView={{ y: [-30, 0], opacity: [0, 1] }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          {carouselImages.map((image, index) => (
            <motion.img
              key={`${catDetail.id}-image-${index}`}
              src={image}
              alt={`Additional view of ${catDetail.name}`}
              onClick={() => handleImageClick(image)}
              whileHover={{ scale: 1.1 }}
            />
          ))}
        </motion.div>
      </motion.div>
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
              <p className="breedLink">{catDetail.breed}</p>
              <div className="dotSeparator"></div>
              <p className="addressGuardian">
                {catDetail.owner
                  ? "This cat is already adopted"
                  : catDetail.address}
              </p>
            </div>
            <p className="aboutCat">{catDetail.description}</p>
            <div className="ownerGuardian">
              {!catDetail.owner && (
                <>
                  <p className="guardian">Regards,</p>
                  <p className="guardian">{catDetail.guardian}</p>
                </>
              )}
              {!catDetail.owner &&
                !showAdoptInput &&
                token &&
                catDetail.user !== userDetails.username && (
                  <button
                    className="simpleButton submit"
                    onClick={toggleAdoptInput}
                  >
                    Adopt Me
                  </button>
                )}
              {showAdoptInput && (
                <div className="adoptInputContainer">
                  <input
                    name="message"
                    type="text"
                    value={adoptionMessage}
                    onChange={(e) => setAdoptionMessage(e.target.value)}
                    placeholder="Write your message"
                    className="adoptInput"
                  />
                  <div className="clearIconContainer">
                    <AiFillCloseCircle
                      className="clearIcon"
                      onClick={handleClearAdoptionMessage}
                    />
                  </div>
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    className="sendIcon"
                    onClick={handleAdoptionMessage}
                  />
                  {inputError && <p className="errorMessage">{inputError}</p>}
                </div>
              )}
            </div>
          </div>
          <div className="delimiter"></div>
          <div className="rightSection">
            <h2>About {catDetail.name}</h2>
            <p>Gender: {catDetail.gender}</p>
            <p>Life Stage: {catDetail.lifeStage}</p>
            {catDetail.healthProblem && (
              <p>Health Problem: {catDetail.healthProblem}</p>
            )}
          </div>
          {userDetails &&
            userDetails.username === catDetail.user &&
            !catDetail.owner && (
              <FontAwesomeIcon
                icon={faEdit}
                className="editIcon"
                onClick={handleEditClick}
              />
            )}
        </div>
      </motion.div>

      <motion.div
        key={catDetail.id}
        className="otherCatsContainer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>More Cats from {catDetail.guardian}</h2>
        <ul className="otherCatsList">
          {catsGuardian
            .filter((cat) => cat.id !== catDetail.id)
            .slice(0, 4)
            .map((cat, index) => (
              <motion.li
                key={`guardian-${cat.id}`}
                className="otherCatCard"
                onClick={() => handleCatClick(cat.id)}
                initial={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <FavoriteHeart catId={cat.id} />
                <img src={cat.image} alt={cat.name} className="otherCatImage" />
                <div className="otherCatInfo">
                  <h3>{cat.name}</h3>
                </div>
              </motion.li>
            ))}
          {catsGuardian.length > 4 && (
            <motion.li
              className="otherCatCard exploreMoreCard"
              initial={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <p>{catsGuardian.length - 4} more cats available</p>
              <button
                className="submitButton save"
                onClick={() => handleExploreMore(catDetail.userId)}
              >
                Explore More
              </button>
            </motion.li>
          )}
        </ul>
      </motion.div>

      <motion.div
        key={catDetail.id}
        className="otherCatsContainer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Other Cats You May Like</h2>
        <ul className="otherCatsList">
          {catsBreed
            .filter((cat) => cat.id !== catDetail.id)
            .slice(0, 4)
            .map((cat, index) => (
              <motion.li
                key={`breed-${cat.id}`}
                className="otherCatCard"
                onClick={() => handleCatClick(cat.id)}
                initial={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <FavoriteHeart catId={cat.id} />
                <img src={cat.image} alt={cat.name} className="otherCatImage" />
                <div className="otherCatInfo">
                  <h3>{cat.name}</h3>
                </div>
              </motion.li>
            ))}
          {catsBreed.length > 4 && (
            <motion.li
              className="otherCatCard exploreMoreCard"
              initial={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <p>{catsBreed.length - 4} more cats available</p>
              <button
                className="submitButton save"
                onClick={() => handleExploreMoreBreed(catDetail.breed)}
              >
                Explore More
              </button>
            </motion.li>
          )}
        </ul>
      </motion.div>

      {isEditDialogOpen && (
        <EditCatForm catDetail={catDetail} onClose={handleCloseEditDialog} />
      )}
    </>
  );
}
