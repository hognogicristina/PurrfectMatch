import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";

import UploadImage from "../../pages/Util/UploadImage.jsx";
import { useToast } from "../Util/Custom/ToastProvider.jsx";

export default function MyProfileEdit({ userDetail }) {
  const data = useActionData();
  const navigate = useNavigate();
  const { notifyError, notifySuccess } = useToast();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [user, setUser] = useState();
  const [experienceLevel, setExperienceLevel] = useState(0);

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
        notifyError(data.error[0].message);
      } else if (data.status) {
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

  return (
    <motion.div className="userDetailContainer" animate={trembleAnimation}>
      <Form method="patch" className="userContent myProfile">
        <div className="userSlideBarLeft">
          <UploadImage />
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
              required
            />
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
              required
            />
          </label>
          <label className="userPersonalInput">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              defaultValue={user ? user.email : ""}
              onKeyPress={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              required
            />
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
              required
            />
          </label>

          <div className="controlProfileContainer">
            <button
              type="button"
              onClick={handleCancel}
              className="simpleButton submit"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              disabled={isSubmitting}
              type="submit"
              className="submitButton save"
            >
              Save
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
          </div>
          <div className="experienceLevelEdit">
            <span>Experience level:</span>
            {renderExperienceLevel(experienceLevel)}
            <input
              type="hidden"
              name="experienceLevel"
              defaultValue={experienceLevel}
            />
          </div>
        </div>
      </Form>
    </motion.div>
  );
}
