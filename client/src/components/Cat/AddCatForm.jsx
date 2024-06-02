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
import UploadImages from "../Util/Features/UploadImages.jsx";
import "../../styles/PurrfectMatch/CatAddForm.css";
import LoadingSpinner from "../Util/Custom/PageResponse/LoadingSpinner.jsx";
import ErrorMessage from "../Util/Custom/Reuse/ErrorMessage.jsx";
import CatSelectFields from "../Util/Pages/CatProfile/CatSelectFields.jsx";

export default function AddCatForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError, notifySuccess } = useToast();
  const [errors, setErrors] = useState({});
  const [imageUris, setImageUris] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (data) {
      if (data.error) {
        const newErrors = {};
        data.error.forEach((error) => {
          if (
            error.field === "server" ||
            error.field === "uris" ||
            error.field === "token" ||
            error.field === "user" ||
            error.field === "address"
          ) {
            notifyError(error.message);
          }
          newErrors[error.field] = error.message;
        });
        setErrors(newErrors);
      }
      if (data.status) {
        notifySuccess(data.status);
        navigate("/user/felines-records");
      }
    }
  }, [data]);

  const handleImageUpload = (uris) => {
    setImageUris(uris);
  };

  const handleBreedChange = (selectedOption) => {
    setSelectedBreed(selectedOption ? selectedOption.value : null);
  };

  const handleGenderChange = (selectedOption) => {
    setSelectedGender(selectedOption ? selectedOption.value : null);
  };

  const handleColorChange = (selectedOption) => {
    setSelectedColor(selectedOption ? selectedOption.value : null);
  };

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
            <h2>Give a Cat for Adoption</h2>
            <NavLink to="/cats" className="linkButton">
              Back to Cats
            </NavLink>
          </div>
          <label>
            Name
            <input type="text" name="name" placeholder="How do you call it?" />
            {errors.name && <ErrorMessage message={errors.name} />}
          </label>
          <UploadImages
            initialImages={[]}
            initialUris={[]}
            onImageUpload={handleImageUpload}
          />
          <input type="hidden" name="uris" value={imageUris.join(",")} />
          <div className="orderAddContainer">
            <CatSelectFields
              errors={errors}
              selectedBreed={selectedBreed}
              selectedGender={selectedGender}
              selectedColor={selectedColor}
              handleBreedChange={handleBreedChange}
              handleGenderChange={handleGenderChange}
              handleColorChange={handleColorChange}
            />
          </div>
          <div className="orderAddContainer">
            <label>
              Age
              <input type="text" name="age" placeholder="Age in years" />
              {errors.age && <ErrorMessage message={errors.age} />}
            </label>
            <label>
              Health Problems (optional)
              <input name="healthProblem" placeholder="Any health problems?" />
              {errors.healthProblem && (
                <ErrorMessage message={errors.healthProblem} />
              )}
            </label>
          </div>
          <label>
            Description
            <textarea
              name="description"
              placeholder="Tell us more about this cat"
            />
            {errors.description && (
              <ErrorMessage message={errors.description} />
            )}
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
