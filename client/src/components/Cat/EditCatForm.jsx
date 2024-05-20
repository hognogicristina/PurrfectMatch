import { useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";
import UploadsImage from "../Util/Features/UploadsImages.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import CustomSelect from "../Util/Custom/Reuse/CustomSelect.jsx";
import DeleteCatDialog from "./DeleteCatDialog";

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

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
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
          <label>
            Name
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter cat's name"
              defaultValue={catDetail.name}
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
                defaultValue={{
                  value: catDetail.breed,
                  label: catDetail.breed,
                }}
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
                defaultValue={{
                  value: catDetail.gender,
                  label: catDetail.gender,
                }}
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
              defaultValue={catDetail.age}
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
                  defaultValue={catDetail.color}
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
                  defaultValue={catDetail.healthProblem}
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
              defaultValue={catDetail.description}
            />
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
