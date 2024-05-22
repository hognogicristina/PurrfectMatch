import { useEffect, useState } from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";
import UploadImages from "../Util/Features/UploadImages.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import CustomSelect from "../Util/Custom/Reuse/CustomSelect.jsx";
import DeleteCatDialog from "./DeleteCatDialog";
import LoadingSpinner from "../Util/Custom/PageResponse/LoadingSpinner.jsx";
import ErrorMessage from "../Util/Custom/Reuse/ErrorMessage.jsx";
import { getAuthToken } from "../../util/auth.js";

export default function EditCatForm({ catDetail, onClose }) {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError, notifySuccess } = useToast();
  const [breeds, setBreeds] = useState([]);
  const [colors, setColors] = useState([]);
  const [errors, setErrors] = useState({});
  const [imageUris, setImageUris] = useState(catDetail.uris || []);
  const [genders] = useState([
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
    async function fetchBreeds() {
      const response = await fetch("http://localhost:3000/breeds");
      const data = await response.json();
      if (response.ok) {
        setBreeds(
          data.data.map((breed) => ({ value: breed.name, label: breed.name })),
        );
      } else {
        data.error.forEach((error) => {
          notifyError(error.message);
        });
        return null;
      }
    }

    async function fetchColors() {
      const response = await fetch("http://localhost:3000/colors");
      const data = await response.json();
      if (response.ok) {
        setColors(data.data.map((color) => ({ value: color, label: color })));
      } else {
        data.error.forEach((error) => {
          notifyError(error.message);
        });
        return null;
      }
    }

    fetchColors();
    fetchBreeds();
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
        closeDeleteDialog();
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
          breed: e.target.breed.value,
          gender: e.target.gender.value,
          color: e.target.color.value,
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
      handleClose();
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

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
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
            <label>
              Breed
              <label className="selectAddCat">
                <CustomSelect
                  name="selectedBreed"
                  options={breeds}
                  placeholder="Select a breed"
                  className="selectControl"
                  isClearable={true}
                  defaultValue={{
                    value: catDetail.breed,
                    label: catDetail.breed,
                  }}
                />
                {errors.breed && <ErrorMessage message={errors.breed} />}
              </label>
              <input type="hidden" name="breed" value={catDetail.breed} />
            </label>
            <label>
              Gender
              <label className="selectAddCat">
                <CustomSelect
                  name="selectedGender"
                  options={genders}
                  placeholder="Select a Gender"
                  className="selectControl"
                  isClearable={true}
                  defaultValue={{
                    value: catDetail.gender,
                    label: catDetail.gender,
                  }}
                />
                {errors.gender && <ErrorMessage message={errors.gender} />}
              </label>
              <input type="hidden" name="gender" value={catDetail.gender} />
            </label>
            <label>
              Color
              <label className="selectAddCat">
                <CustomSelect
                  name="color"
                  options={colors}
                  placeholder="Select a color"
                  className="selectControl"
                  isClearable={true}
                  defaultValue={{
                    value: catDetail.color,
                    label: catDetail.color,
                  }}
                />
                {errors.color && <ErrorMessage message={errors.color} />}
              </label>
              <input type="hidden" name="color" value={catDetail.color} />
            </label>
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
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              className="simpleButton delete edit"
              onClick={openDeleteDialog}
            >
              Delete
            </motion.button>
          </div>
        </Form>
        {isDeleteDialogOpen && (
          <DeleteCatDialog onClose={closeDeleteDialog} cat={catDetail} />
        )}
      </motion.div>
    </div>
  );
}
