import { Form, useActionData, useNavigation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/ToastProvider.jsx";

export default function ChangeUsernameProfile({ userDetail }) {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError, notifySuccess } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    async function getUser() {
      const userInfo = await userDetail;
      setUser(userInfo);
    }

    getUser();
  }, [userDetail]);

  useEffect(() => {
    if (data && data.error) {
      data.error.forEach((error) => {
        notifyError(error.message);
      });
    } else if (data && data.status) {
      notifySuccess(data.status);
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
        <Form method="post" className="passwordForm">
          <h1 className="titleFont">Change Password</h1>
          <label className="passwordInput">
            <input
              name="currentPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your current password"
              onKeyPress={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              required
            />
            <span
              className="togglePassword"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>
          <label className="passwordInput">
            <input
              name="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              onKeyPress={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              required
            />
            <span
              className="togglePassword"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>
          <label className="passwordInput">
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              onKeyPress={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              required
            />
            <span
              className="togglePassword"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>
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
