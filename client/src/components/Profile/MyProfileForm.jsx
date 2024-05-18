import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";

import UploadImage from "../Util/Functionalities/UploadImage.jsx";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";

export default function MyProfileForm({ userDetail }) {
  const data = useActionData();
  const navigate = useNavigate();
  const { notifyError, notifySuccess } = useToast();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [user, setUser] = useState();
  const [experienceLevel, setExperienceLevel] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function getUser() {
      const userInfo = await userDetail;
      setUser(userInfo);
      setExperienceLevel(userInfo.experienceLevel || 0);
    }

    getUser();
  }, [userDetail]);

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
        navigate("/user");
      }
    }
  }, [data]);

  function handleCancel() {
    navigate("/user");
  }

  const trembleAnimation = {
    x: [0, 5, -5, 5, -5, 0],
    y: [0, 2, -2, 2, -2, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      loop: Infinity,
    },
  };

  const handleExperienceClick = (index) => {
    const newLevel = index + 1;
    setExperienceLevel(experienceLevel === newLevel ? 0 : newLevel);
  };

  const renderExperienceLevel = (level) => {
    let circles = [];
    for (let i = 0; i < 5; i++) {
      circles.push(
        <span
          key={i}
          className={`circle ${i < level ? "green" : "gray"}`}
          onClick={() => handleExperienceClick(i)}
        />,
      );
    }
    return <div className="experienceCircles">{circles}</div>;
  };

  const initialImage = user ? user.image : null;

  return (
    <motion.div className="userDetailContainer" animate={trembleAnimation}>
      <Form method="patch" className="userContent myProfile">
        <div className="userSlideBarLeft">
          <UploadImage initialImage={initialImage} />
          <label>
            <span>First name</span>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              defaultValue={user ? user.firstName : ""}
              onKeyPress={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
            />
            {errors.firstName && (
              <p className="errorText">{errors.firstName}</p>
            )}
          </label>
          <label>
            <span>Last name</span>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              defaultValue={user ? user.lastName : ""}
              onKeyPress={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
            />
            {errors.lastName && <p className="errorText">{errors.lastName}</p>}
          </label>
          <label className="userPersonalInput">
            <span>Email</span>
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              defaultValue={user ? user.email : ""}
              onKeyPress={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
            />
            {errors.email && <p className="errorText">{errors.email}</p>}
          </label>
          <label className="userPersonalInput">
            <span>Birthday</span>
            <input
              type="date"
              name="birthday"
              defaultValue={user ? user.birthday : ""}
              onKeyPress={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
            />
            {errors.birthday && <p className="errorText">{errors.birthday}</p>}
          </label>

          <div className="controlProfileContainer">
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleCancel}
              className="simpleButton submit"
            >
              Cancel
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              disabled={isSubmitting}
              type="submit"
              className={`submitButton save ${isSubmitting ? "submitting" : ""}`}
            >
              {isSubmitting ? "Submitting.." : "Submit"}
            </motion.button>
          </div>
        </div>
        <div className="userSlideBarRight">
          <span className="titleFont">About me</span>
          <label>
            <span>Description</span>
            <textarea
              name="description"
              placeholder="Enter a description"
              defaultValue={user ? user.description : ""}
              onKeyPress={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              rows="4"
              cols="55"
            />
            {errors.description && (
              <p className="errorText">{errors.description}</p>
            )}
          </label>
          <div className="hobbiesLabel">
            <span>Hobbies</span>
            <input
              type="text"
              name="hobbies"
              placeholder="Add a hobby"
              defaultValue={user ? user.hobbies : ""}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />
            <p className="errorText">Separate hobbies with a comma</p>
            {errors.hobbies && <p className="errorText">{errors.hobbies}</p>}
          </div>
          <div className="experienceLevelEdit">
            <span>Experience level:</span>
            {renderExperienceLevel(experienceLevel)}
            <input
              type="hidden"
              name="experienceLevel"
              defaultValue={experienceLevel}
            />
            {errors.experienceLevel && (
              <p className="errorText">{errors.experienceLevel}</p>
            )}
          </div>
        </div>
      </Form>
    </motion.div>
  );
}
