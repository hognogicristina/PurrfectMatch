import { Form, useActionData, useNavigation } from "react-router-dom";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "./Authentification.css";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPasswordForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (data && data.error) {
      data.error.forEach((error) => {
        toast.error(error.message);
      });
    }
  }, [data]);

  return (
    <div className="authContainer">
      <motion.div
        className="authForm"
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
      >
        <Form method="post">
          <h1>Enter your new password</h1>
          <label className="passwordInput">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              required
            />
            <span
              className="togglePassword"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>
          <button type="submit" disabled={isSubmitting}>
            Save
          </button>
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
