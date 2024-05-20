import { useEffect, useState } from "react";
import {
  Form,
  NavLink,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";
import UploadsImage from "../Util/Features/UploadsImages.jsx";
import LoadingSpinner from "../Util/Custom/PageResponse/LoadingSpinner.jsx";
import "../../styles/PurrfectMatch/CatAddForm.css";
import CustomSelect from "../Util/Custom/Reuse/CustomSelect.jsx";

export default function AddCatForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError, notifySuccess } = useToast();
  const [breeds, setBreeds] = useState([]);
  const [errors, setErrors] = useState({});
  const initialImage = null;
  const [genders] = useState([
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
          <label>
            Name
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter cat's name"
              required
            />
          </label>
          <UploadsImage initialImage={initialImage} />
          <label>
            Breed
            <label className="selectAddCat">
              <CustomSelect
                name="selectedBreed"
                options={breeds}
                placeholder="Select a breed"
                className="selectControl"
                isClearable={true}
              />
            </label>
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
              />
            </label>
          </label>
          <label>
            Age
            <input
              type="number"
              id="age"
              name="age"
              placeholder="Enter cat's age"
              min="0"
            />
          </label>
          <div className="colorHealthContainer">
            <div>
              <label>
                Color
                <input
                  type="text"
                  id="color"
                  name="color"
                  placeholder="Enter cat's color"
                />
              </label>
            </div>
            <div>
              <label>
                Health Problems (optional)
                <input
                  id="healthProblems"
                  name="healthProblems"
                  placeholder="Enter cat's health problems"
                />
              </label>
            </div>
          </div>
          <label>
            Description
            <textarea
              id="description"
              name="description"
              placeholder="Enter cat's description"
            />
          </label>
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
