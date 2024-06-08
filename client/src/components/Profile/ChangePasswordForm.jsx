import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaKey, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";

export default function ChangeUsernameProfile() {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError, notifySuccess } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

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
        <Form method="post" className="passwordForm">
          <h1 className="titleFont">Change Password</h1>
          <label className="authInput">
            <div className="iconContainer">
              <FaLock />
            </div>
            <input
              name="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter your current password"
            />
            <span
              className="iconContainer"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>
          {errors.currentPassword && (
            <p className="errorText">{errors.currentPassword}</p>
          )}
          <label className="authInput">
            <div className="iconContainer">
              <FaKey />
            </div>
            <input
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter your new password"
            />
            <span
              className="iconContainer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>
          {errors.newPassword && (
            <p className="errorText">{errors.newPassword}</p>
          )}
          <label className="authInput">
            <div className="iconContainer">
              <FaKey />
            </div>
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
            />
            <span
              className="iconContainer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>
          {errors.confirmPassword && (
            <p className="errorText">{errors.confirmPassword}</p>
          )}
          <div className="linksContainer">
            <motion.button
              whileTap={{ scale: 0.9 }}
              disabled={isSubmitting}
              type="submit"
              className={`submitButton save ${isSubmitting ? "submitting" : ""}`}
            >
              {isSubmitting ? "Saving.." : "Save"}
            </motion.button>
            <Link to="/reset" className="linkButton">
              Forgot Password?
            </Link>
          </div>
        </Form>
      </motion.div>
    </div>
  );
}
