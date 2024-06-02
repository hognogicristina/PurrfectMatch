import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import "../../styles/PurrfectMatch/Cat.css";
import CatImageSection from "../Util/Pages/CatProfile/CatImageSection.jsx";
import CatDetailsSection from "../Util/Pages/CatProfile/CatDetailsSection.jsx";
import MoreCatsSection from "../Util/Pages/CatProfile/MoreCatsSection.jsx";
import { useUserDetails } from "../../util/useUserDetails.js";
import ModifyCatForm from "./ModifyCatForm.jsx";

export default function CatItem({ catDetail }) {
  const { notifyError } = useToast();
  const { userDetails } = useUserDetails();
  const [catsBreed, setCatsBreed] = useState([]);
  const [catsGuardian, setCatsGuardian] = useState([]);
  const [catsOwner, setCatsOwner] = useState([]);
  const [mainImage, setMainImage] = useState(catDetail.images[0]);
  const [carouselImages, setCarouselImages] = useState(catDetail.images);
  const [userEditCat, setUserEditCat] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCatDetail, setCurrentCatDetail] = useState(catDetail);

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

    setMainImage(catDetail.images[0]);
    setCarouselImages(catDetail.images);
    setCurrentCatDetail(catDetail);

    fetchCatsByBreed();
    fetchCatsOfGuardian();
  }, [catDetail, notifyError]);

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleUpdateCatDetail = (updatedCatDetail) => {
    setCurrentCatDetail(updatedCatDetail);
    setMainImage(updatedCatDetail.images[0]);
    setCarouselImages(updatedCatDetail.images);
  };

  return (
    <>
      <CatImageSection
        catDetail={currentCatDetail}
        mainImage={mainImage}
        setMainImage={setMainImage}
        carouselImages={carouselImages}
      />
      <CatDetailsSection
        catDetail={currentCatDetail}
        userDetails={userDetails}
        userEditCat={userEditCat}
        handleEditClick={handleEditClick}
        isEditDialogOpen={isEditDialogOpen}
        handleCloseEditDialog={handleCloseEditDialog}
      />

      {catsGuardian.length > 1 && (
        <MoreCatsSection
          title={`More Cats from ${currentCatDetail.guardian}`}
          cats={catsGuardian}
          type="guardian"
          catDetail={currentCatDetail}
          onSelectCat={setCurrentCatDetail}
        />
      )}
      {catsOwner.length > 1 && (
        <MoreCatsSection
          title={`More Cats from ${currentCatDetail.owner}`}
          cats={catsOwner}
          type="owner"
          catDetail={currentCatDetail}
          onSelectCat={setCurrentCatDetail}
        />
      )}
      {catsBreed.length > 1 && (
        <MoreCatsSection
          title="Other Cats You May Like"
          cats={catsBreed}
          type="breed"
          catDetail={currentCatDetail}
          onSelectCat={setCurrentCatDetail}
        />
      )}
      {isEditDialogOpen && (
        <ModifyCatForm
          catDetail={currentCatDetail}
          onClose={handleCloseEditDialog}
          onSubmit={handleUpdateCatDetail}
        />
      )}
    </>
  );
}
