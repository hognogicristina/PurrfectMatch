import { useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";
import Select from "react-select";
import UploadsImage from "../Util/Functionalities/UploadsImages.jsx";
import LoadingSpinner from "../Util/Custom/PageResponse/LoadingSpinner.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function EditCatForm({ catDetail, onClose }) {
  const data = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError, notifySuccess } = useToast();
  const [breeds, setBreeds] = useState([]);
  const [errors, setErrors] = useState({});
  const initialImage = catDetail.images;
  const [genders] = useState([
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

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

    fetchBreeds();
  }, []);

  useEffect(() => {
    if (data) {
      if (data.error) {
        const newErrors = {};
        data.error.forEach((error) => {
          newErrors[error.field] = error.message;
        });
        setErrors(newErrors);
        if (data.error.field === "server") {
          notifyError(data.error.message);
        }
      }
      if (data.status) {
        notifySuccess(data.status);
        setTimeout(() => navigate("/cats"), 2000);
      }
    }
  }, [data]);

  const customStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      boxShadow: "none",
      borderColor: "#6666665E",
      "&:hover": {
        borderColor: "#6666665E",
      },
      borderRadius: "8px",
      cursor: "pointer",
    }),
    option: (styles, { isFocused, isSelected, isActive }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#ff8bbd"
        : isFocused
          ? "#ffe6f2"
          : isActive
            ? "#ffadd6"
            : null,
      color: isSelected ? "white" : "black",
      cursor: "pointer",
      ":active": {
        ...styles[":active"],
        backgroundColor: isActive ? "#ff6392" : null,
      },
    }),
    singleValue: (styles) => ({
      ...styles,
      color: "#333",
    }),
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("id", catDetail.id);
    formData.append("image", initialImage);
    const response = await fetch(
      `http://localhost:3000/cats/edit/${catDetail.id}`,
      {
        method: "PUT",
        body: formData,
      },
    );
    const data = await response.json();
    if (response.ok) {
      notifySuccess(data.status);
      handleClose();
    } else {
      notifyError(data.message);
    }
  };

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
          <div className="headerAddCat">
            <h2>Modify Cat</h2>
          </div>
          {Object.keys(errors).length > 0 && (
            <div className="error-messages">
              {Object.values(errors).map((error, index) => (
                <p key={index} className="error">
                  {error}
                </p>
              ))}
            </div>
          )}
          <label>Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter cat's name"
            defaultValue={catDetail.name}
            className={errors.name ? "input-error" : ""}
          />
          <UploadsImage initialImage={initialImage} />
          <label className="selectAddCat">Breed:</label>
          <Select
            styles={customStyles}
            name="selectedBreed"
            options={breeds}
            placeholder="Select a breed"
            className="selectControl"
            isClearable={true}
            defaultValue={catDetail.breed}
          />

          <label className="selectAddCat">Gender:</label>
          <Select
            styles={customStyles}
            name="selectedGender"
            options={genders}
            placeholder="Select a Gender"
            className="selectControl"
            isClearable={true}
            defaultValue={catDetail.gender}
          />
          <label>Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            placeholder="Enter cat's age"
            className={errors.age ? "input-error" : ""}
            min="0"
          />
          <div className="colorHealthContainer">
            <div>
              <label>Color:</label>
              <input
                type="text"
                id="color"
                name="color"
                placeholder="Enter cat's color"
                className={errors.color ? "input-error" : ""}
                defaultValue={catDetail.color}
              />
            </div>
            <div>
              <label>Health Problems (optional):</label>
              <input
                id="healthProblems"
                name="healthProblems"
                placeholder="Enter cat's health problems"
                className={errors.healthProblems ? "input-error" : ""}
                defaultValue={catDetail.healthProblems}
              />
            </div>
          </div>
          <label>Description:</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter cat's description"
            className={errors.description ? "input-error" : ""}
            defaultValue={catDetail.description}
          />
          <div>
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
