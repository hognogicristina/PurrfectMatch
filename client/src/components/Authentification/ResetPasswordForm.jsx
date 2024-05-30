import { Form, useActionData, useNavigation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/Auth/Authentification.css";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";

export default function ResetPasswordForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (data && data.error) {
      data.error.forEach((error) => {
        notifyError(error.message);
      });
    }
  }, [data]);

  return (
    <div className="authContainer">
      <motion.div
        className="authForm"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 15,
        }}
      >
        <Form method="post">
          <h1>Enter your new password</h1>
          <label className="authInput">
            <div className="iconContainer">
              <FaKey />
            </div>
            <input
              className="passwordInput"
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
          <label className="authInput">
            <div className="iconContainer">
              <FaKey />
            </div>
            <input
              className="passwordInput"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
            />
            <span
              className="iconContainer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>
          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={isSubmitting}
            type="submit"
            className={`submitButton submit ${isSubmitting ? "submitting" : ""}`}
          >
            {isSubmitting ? "Saving.." : "Save"}
          </motion.button>
        </Form>
      </motion.div>
    </div>
  );
}
