import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Datetime from "react-datetime";
import UploadImage from "../Util/Features/UploadImage.jsx";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import ErrorMessage from "../Util/Custom/Reuse/ErrorMessage.jsx";

export default function ModifyMyProfileForm({ userDetail }) {
  const data = useActionData();
  const navigate = useNavigate();
  const { notifyError, notifySuccess, notifyLoading } = useToast();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [user, setUser] = useState(null);
  const [experienceLevel, setExperienceLevel] = useState(0);
  const [errors, setErrors] = useState({});
  const initialImage = user ? user.image : null;

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
          if (error.field === "server" || error.field === "uris") {
            notifyError(error.message);
            return;
          }
          newErrors[error.field] = error.message;
        });
        setErrors(newErrors);
      }
      if (data.status) {
        notifySuccess(data.status);
        navigate("/user");
      }
    }
  }, [data, notifyError, notifySuccess, navigate]);

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

  const handleImageUpload = (uris) => {
    const newImage = { ...user, uri: uris };
    setUser(newImage);
  };

  const handleBirthdayChange = (date) => {
    if (date && date._isAMomentObject && date.isValid()) {
      setUser((prevUser) => ({
        ...prevUser,
        birthday: date.format("YYYY-MM-DD"),
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        birthday: "",
      }));
    }
  };

  return (
    <motion.div className="userDetailContainer" animate={trembleAnimation}>
      <Form method="patch" className="userContent myProfile">
        <div className="userSlideBarLeft">
          <UploadImage
            initialImage={initialImage}
            initialUris={user ? user.uri : []}
            onImageUpload={(uris) => handleImageUpload(uris)}
          />
          {user?.uri && (
            <input type="hidden" name="uri" defaultValue={user.uri.join(",")} />
          )}
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
            {errors.firstName && <ErrorMessage message={errors.firstName} />}
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
            {errors.lastName && <ErrorMessage message={errors.lastName} />}
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
            {!errors.email && (
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="warningText"
              >
                Requires verification to change email
              </motion.p>
            )}
            {errors.email && <ErrorMessage message={errors.email} />}
          </label>
          <label className="userPersonalInput">
            <span>Birthday</span>
            <Datetime
              className="reactDatetimePicker"
              value={user ? new Date(user.birthday) : null}
              timeFormat={false}
              onChange={handleBirthdayChange}
            />
            {user?.birthday && (
              <input type="hidden" name="birthday" value={user.birthday} />
            )}
            {errors.birthday && <ErrorMessage message={errors.birthday} />}
          </label>
          <div className="controlProfileContainer">
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleCancel}
              className="simpleButton submit resize"
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
            <span>Description (optional)</span>
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
              <ErrorMessage message={errors.description} />
            )}
          </label>
          <div className="hobbiesLabel">
            <span>Hobbies (optional)</span>
            <input
              type="text"
              name="hobbies"
              placeholder="Enter your hobbies"
              defaultValue={user ? user.hobbies : ""}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />
            {!errors.hobbies && (
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="warningText"
              >
                Separate hobbies with a comma
              </motion.p>
            )}
            {errors.hobbies && <ErrorMessage message={errors.hobbies} />}
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
              <ErrorMessage message={errors.experienceLevel} />
            )}
          </div>
        </div>
      </Form>
    </motion.div>
  );
}
