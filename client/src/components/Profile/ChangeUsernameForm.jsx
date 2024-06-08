import { Form, useActionData, useNavigation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock, FaRegUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";

export default function ChangeUsernameForm({ userDetail }) {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError, notifySuccess } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function getUser() {
      const userInfo = await userDetail;
      setUser(userInfo);
    }

    getUser();
  }, [userDetail]);

  useEffect(() => {
    if (data && data.error) {
      const newErrors = {};
      data.error.forEach((error) => {
        if (error.field === "server") {
          notifyError(error.message);
        }
        newErrors[error.field] = error.message;
      });
      setErrors(newErrors);
    } else if (data && data.status) {
      notifySuccess(data.status);
      setErrors({});
    }
  }, [data]);

  return (
    <div className="userDetailContainer">
      <motion.div
        className="userContent"
        initial={{ x: "-9vh", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
      >
        <Form method="post" className="usernameForm">
          <h1 className="titleFont">Change Username</h1>
          <label className="authInput">
            <div className="iconContainer">
              <FaRegUser />
            </div>
            <input
              name="username"
              type="text"
              placeholder="Enter your username"
              defaultValue={user ? user.username : ""}
              onKeyPress={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
            />
          </label>
          {errors.username && <p className="errorText">{errors.username}</p>}
          <label className="authInput">
            <div className="iconContainer">
              <FaLock />
            </div>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
            />
            <span
              className="iconContainer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>
          {errors.password && <p className="errorText">{errors.password}</p>}
          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={isSubmitting}
            type="submit"
            className={`submitButton save ${isSubmitting ? "submitting" : ""}`}
          >
            {isSubmitting ? "Saving.." : "Save"}
          </motion.button>
        </Form>
      </motion.div>
    </div>
  );
}
