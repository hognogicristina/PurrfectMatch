import { motion } from "framer-motion";
import { Form, useLoaderData } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import React, { useEffect, useState } from "react";
import UploadImage from "../../pages/Util/UploadImage.jsx";

export default function MyProfileEdit() {
  const data = useLoaderData();
  const [hobbies, setHobbies] = useState([]);
  const [currentHobby, setCurrentHobby] = useState("");

  useEffect(() => {
    if (data) {
      if (data.error) {
        toast.error(data.error[0].message);
      } else if (data.status) {
        toast.success(data.status);
      }
    }
  }, [data]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleHobbyChange = (e) => {
    setCurrentHobby(e.target.value);
  };

  const handleAddHobby = () => {
    if (currentHobby.trim() !== "") {
      setHobbies([...hobbies, currentHobby.trim()]);
      setCurrentHobby("");
    }
  };

  const handleRemoveHobby = (index) => {
    setHobbies(hobbies.filter((_, i) => i !== index));
  };

  return (
    <div className="userDetailContainer">
      <motion.div
        initial={{ x: "-9vh", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
      >
        <Form method="patch" className="userContent">
          <div className="userSlideBarLeft">
            <UploadImage />
            <label>
              <span>First name</span>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                required
              />
            </label>
            <label>
              <span>Last name</span>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
            </label>
            <label>
              <span>Birthday</span>
              <input type="date" name="birthday" required />
            </label>
            <button type="submit">Save</button>
          </div>
          <div className="userSlideBarRight">
            <label>
              <span>Description</span>
              <textarea
                name="description"
                placeholder="Enter a description"
                rows="4"
                cols="55"
              />
            </label>
            <label className="hobbiesLabel">
              <span>Hobbies</span>
              <div className="hobbies">
                {hobbies.map((hobby, index) => (
                  <div key={index} className="hobby">
                    <span>{hobby}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHobby(index)}
                      className="removeButton"
                    >
                      <span className="removeIcon">x</span>
                    </button>
                  </div>
                ))}
                <div className="hobbyInputContainer">
                  <input
                    type="text"
                    name="hobbies"
                    placeholder="Add a hobby"
                    value={currentHobby}
                    onChange={handleHobbyChange}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleAddHobby();
                    }}
                    className="hobbyInput"
                  />
                  <button
                    type="button"
                    onClick={handleAddHobby}
                    className="addHobbyButton"
                  >
                    Add
                  </button>
                </div>
              </div>
            </label>

            <label>
              <span>Experience Level</span>
              <input type="number" name="experienceLevel" />
            </label>
          </div>
        </Form>
        <ToastContainer
          position="top-center"
          autoClose={6000}
          closeButton={false}
        />
      </motion.div>
    </div>
  );
}
