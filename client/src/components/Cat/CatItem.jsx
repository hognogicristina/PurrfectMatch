import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";
import "../../styles/PurrfectMatch/Cat.css";
import { getAuthToken } from "../../util/auth.js";
import EditCatForm from "./EditCatForm.jsx";
import MoreCats from "../Util/Features/MoreCats.jsx";
import AdoptCat from "../Util/Features/AdoptCat.jsx";

export default function CatItem({ catDetail }) {
  const { notifyError } = useToast();
  const [catsBreed, setCatsBreed] = useState([]);
  const [catsGuardian, setCatsGuardian] = useState([]);
  const [mainImage, setMainImage] = useState(catDetail.images[0]);
  const [carouselImages, setCarouselImages] = useState(
    catDetail.images.slice(1),
  );
  const [userDetails, setUserDetails] = useState({ username: "", image: "" });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userEditCat, setUserEditCat] = useState("");

  useEffect(() => {
    async function fetchUserDetails() {
      const token = getAuthToken();
      if (!token) {
        return;
      }

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

    if (!catDetail.owner) {
      setUserEditCat(catDetail.user);
    } else {
      setUserEditCat(catDetail.ownerUsername);
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

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
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

      <MoreCats
        title={`More Cats from ${catDetail.guardian}`}
        cats={catsGuardian}
        type="guardian"
        catDetail={catDetail}
      />

      <MoreCats
        title="Other Cats You May Like"
        cats={catsBreed}
        type="breed"
        catDetail={catDetail}
      />

      {isEditDialogOpen && (
        <EditCatForm catDetail={catDetail} onClose={handleCloseEditDialog} />
      )}
    </>
  );
}
