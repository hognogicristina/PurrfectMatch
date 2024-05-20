import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import "../../styles/PurrfectMatch/Cat.css";
import { getAuthToken } from "../../util/auth.js";
import CatImageSection from "../Util/Pages/CatProfile/CatImageSection.jsx";
import CatDetailsSection from "../Util/Pages/CatProfile/CatDetailsSection.jsx";
import MoreCatsSection from "../Util/Pages/CatProfile/MoreCatsSection.jsx";

export default function CatItem({ catDetail }) {
  const { notifyError } = useToast();
  const [catsBreed, setCatsBreed] = useState([]);
  const [catsGuardian, setCatsGuardian] = useState([]);
  const [catsOwner, setCatsOwner] = useState([]);
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
        `http://localhost:3000/cats-by-breed/${catDetail.id}`,
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
        `http://localhost:3000/cats-by-user/${catDetail.id}`,
      );
      const data = await response.json();
      if (response.ok) {
        setCatsGuardian(data.data.catsUserList);
        setCatsOwner(data.data.catsOwnerList);
      } else {
        notifyError(data.message);
      }
    }

    fetchCatsByBreed();
    fetchCatsOfGuardian();
  }, [catDetail.id, catDetail, notifyError]);

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <CatImageSection
        catDetail={catDetail}
        mainImage={mainImage}
        setMainImage={setMainImage}
        carouselImages={carouselImages}
        setCarouselImages={setCarouselImages}
      />
      <CatDetailsSection
        catDetail={catDetail}
        userDetails={userDetails}
        userEditCat={userEditCat}
        handleEditClick={handleEditClick}
        isEditDialogOpen={isEditDialogOpen}
        handleCloseEditDialog={handleCloseEditDialog}
      />

      {catsGuardian.length > 0 && (
        <MoreCatsSection
          title={`More Cats from ${catDetail.guardian}`}
          cats={catsGuardian}
          type="guardian"
          catDetail={catDetail}
        />
      )}
      {catsOwner.length > 0 && (
        <MoreCatsSection
          title={`More Cats from ${catDetail.owner}`}
          cats={catsOwner}
          type="guardian"
          catDetail={catDetail}
        />
      )}
      {catsBreed.length > 0 && (
        <MoreCatsSection
          title="Other Cats You May Like"
          cats={catsBreed}
          type="breed"
          catDetail={catDetail}
        />
      )}
    </>
  );
}
