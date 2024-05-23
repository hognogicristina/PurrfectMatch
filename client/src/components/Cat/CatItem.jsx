import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import "../../styles/PurrfectMatch/Cat.css";
import CatImageSection from "../Util/Pages/CatProfile/CatImageSection.jsx";
import CatDetailsSection from "../Util/Pages/CatProfile/CatDetailsSection.jsx";
import MoreCatsSection from "../Util/Pages/CatProfile/MoreCatsSection.jsx";
import { useUserDetails } from "../../util/useUserDetails.js";

export default function CatItem({ catDetail }) {
  const { notifyError } = useToast();
  const { userDetails } = useUserDetails();
  const [catsBreed, setCatsBreed] = useState([]);
  const [catsGuardian, setCatsGuardian] = useState([]);
  const [catsOwner, setCatsOwner] = useState([]);
  const [mainImage, setMainImage] = useState(catDetail.images[0]);
  const [carouselImages, setCarouselImages] = useState(
    catDetail.images.slice(1),
  );
  const [userEditCat, setUserEditCat] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!catDetail.owner) {
      setUserEditCat(catDetail.user);
    } else {
      setUserEditCat(catDetail.ownerUsername);
    }

    async function fetchCatsByBreed() {
      const response = await fetch(
        `http://localhost:3000/cats-by-breed/${catDetail.id}`,
      );
      const data = await response.json();
      if (response.ok) {
        setCatsBreed(data.data);
      } else {
        data.error.forEach((error) => {
          if (error.field === "server") {
            notifyError(error.message);
          }
        });
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
        data.error.forEach((error) => {
          if (error.field === "server") {
            notifyError(error.message);
          }
        });
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

      {catsGuardian.length > 1 && (
        <MoreCatsSection
          title={`More Cats from ${catDetail.guardian}`}
          cats={catsGuardian}
          type="guardian"
          catDetail={catDetail}
        />
      )}
      {catsOwner.length > 1 && (
        <MoreCatsSection
          title={`More Cats from ${catDetail.owner}`}
          cats={catsOwner}
          type="owner"
          catDetail={catDetail}
        />
      )}
      {catsBreed.length > 1 && (
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
