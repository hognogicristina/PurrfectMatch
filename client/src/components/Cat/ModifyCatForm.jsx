import { useEffect, useState } from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";
import UploadImages from "../Util/Features/UploadImages.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import DeleteCatDialog from "./DeleteCatDialog";
import LoadingSpinner from "../Util/Custom/PageResponse/LoadingSpinner.jsx";
import { getAuthToken } from "../../util/auth.js";
import CatSelectFields from "../Util/Pages/CatProfile/CatSelectFields.jsx";
import ErrorMessage from "../Util/Custom/Reuse/ErrorMessage.jsx";

export default function ModifyCatForm({ catDetail, onClose, onSubmit }) {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError, notifySuccess } = useToast();
  const [errors, setErrors] = useState({});
  const [imageUris, setImageUris] = useState(catDetail.uris || []);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [selectedBreed, setSelectedBreed] = useState(catDetail.breed);
  const [selectedGender, setSelectedGender] = useState(catDetail.gender);
  const [selectedColor, setSelectedColor] = useState(catDetail.color);

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (data) {
      if (data.error) {
        const newErrors = {};
        data.error.forEach((error) => {
          if (error.field === "server" || error.field === "uris") {
            notifyError(error.message);
          }
          newErrors[error.field] = error.message;
        });
        setErrors(newErrors);
      }
      if (data.status) {
        notifySuccess(data.status);
      }
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAuthToken();

    const response = await fetch(
      `http://localhost:3000/cats/edit/${catDetail.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: e.target.name.value,
          breed: selectedBreed,
          gender: selectedGender,
          color: selectedColor,
          age: e.target.age.value,
          healthProblem: e.target.healthProblem.value,
          description: e.target.description.value,
          uris: imageUris,
        }),
      },
    );
    const data = await response.json();
    if (response.ok) {
      notifySuccess(data.status);
      const updatedCatDetail = {
        ...catDetail,
        name: e.target.name.value,
        breed: selectedBreed,
        gender: selectedGender,
        color: selectedColor,
        age: e.target.age.value,
        healthProblem: e.target.healthProblem.value,
        description: e.target.description.value,
        uris: imageUris,
        image: imageUris[0],
      };
      onClose();
      onSubmit(updatedCatDetail);
    } else {
      data.error.forEach((error) => {
        if (error.field === "server" || error.field === "uris") {
          notifyError(error.message);
        }
        setErrors((prev) => ({
          ...prev,
          [error.field]: error.message,
        }));
      });
    }
  };

  const handleImageUpload = (uris) => {
    setImageUris(uris);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const imagesCat = catDetail.images;

  return (
    <div className="dialogOverlay">
      <motion.div
        className="authForm catEditForm"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ y: "100vh", opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 15,
        }}
      >
        <div className="closeButton catEditForm" onClick={handleClose}>
          <FontAwesomeIcon icon={faXmark} className="faXmark" />
        </div>
        <h2>Modify {catDetail.name}</h2>
        <Form onSubmit={handleSubmit} className="addCatContainer">
          <label>
            Name
            <input
              type="text"
              name="name"
              placeholder="How do you call your cat?"
              defaultValue={catDetail.name}
            />
            {errors.name && <ErrorMessage message={errors.name} />}
          </label>
          <UploadImages
            initialImages={imagesCat}
            initialUris={imageUris}
            onImageUpload={handleImageUpload}
          />
          <input type="hidden" name="uris" value={imageUris.join(",")} />
          <div className="orderAddContainer">
            <CatSelectFields
              errors={errors}
              selectedBreed={selectedBreed}
              selectedGender={selectedGender}
              selectedColor={selectedColor}
              handleBreedChange={(option) =>
                setSelectedBreed(option ? option.value : null)
              }
              handleGenderChange={(option) =>
                setSelectedGender(option ? option.value : null)
              }
              handleColorChange={(option) =>
                setSelectedColor(option ? option.value : null)
              }
              defaultBreed={catDetail.breed}
              defaultGender={catDetail.gender}
              defaultColor={catDetail.color}
            />
          </div>
          <div className="orderAddContainer">
            <label>
              Age
              <input
                type="text"
                name="age"
                placeholder="Age in years"
                defaultValue={catDetail.age}
              />
              {errors.age && <ErrorMessage message={errors.age} />}
            </label>
            <label>
              Health Problems (optional)
              <input
                name="healthProblem"
                placeholder="Any health problems?"
                defaultValue={catDetail.healthProblem}
              />
              {errors.healthProblem && (
                <ErrorMessage message={errors.healthProblem} />
              )}
            </label>
          </div>
          <label>
            Description
            <textarea
              id="description"
              name="description"
              placeholder="Tell us more about your cat"
              defaultValue={catDetail.description}
            />
            {errors.description && (
              <ErrorMessage message={errors.description} />
            )}
          </label>
          <div className="buttonEditContainer">
            <motion.button
              whileTap={{ scale: 0.9 }}
              disabled={isSubmitting}
              type="submit"
              className={`submitButton submit ${isSubmitting ? "submitting" : ""}`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </motion.button>
          </div>
        </Form>
      </motion.div>
    </div>
  );
}
