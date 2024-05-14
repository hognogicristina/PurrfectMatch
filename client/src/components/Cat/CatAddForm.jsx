import React, { useEffect, useState } from "react";
import {
  Form,
  NavLink,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { useToast } from "../Util/Custom/ToastProvider.jsx";
import { motion } from "framer-motion";
import Select from "react-select";
import UploadsImage from "../../pages/Util/UploadsImages.jsx";

export default function CatAddForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError, notifySuccess } = useToast();
  const [breeds, setBreeds] = useState([]);
  const [errors, setErrors] = useState({});
  const initialImage = null;
  const [genders] = useState([
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ]);

  useEffect(() => {
    async function fetchBreeds() {
      const response = await fetch("http://localhost:3000/breeds");
      const data = await response.json();
      if (response.ok) {
        setBreeds(
          data.data.map((breed) => ({ value: breed.name, label: breed.name })),
        );
      } else {
        notifyError(data.message);
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

  return (
    <div className="authContainer">
      <motion.div
        className="authForm catAddForm"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 15,
        }}
      >
        <Form method="post">
          <div className="headerAddCat">
            <h2>Add a New Cat</h2>
            <NavLink to="/cats" className="linkButton">
              Back to Cats
            </NavLink>
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
            className={errors.name ? "input-error" : ""}
            required
          />
          <UploadsImage initialImage={initialImage} />
          <label className="selectAddCat">Breed:</label>
          <Select
            styles={customStyles}
            name="selectedBreed"
            options={breeds}
            placeholder="Select a breed"
            classNamePrefix="select"
            isClearable={true}
          />

          <label className="selectAddCat">Gender:</label>
          <Select
            styles={customStyles}
            name="selectedGender"
            options={genders}
            placeholder="Select a Gender"
            classNamePrefix="select"
            isClearable={true}
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
          <label>Description:</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter cat's description"
            className={errors.description ? "input-error" : ""}
          ></textarea>
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
