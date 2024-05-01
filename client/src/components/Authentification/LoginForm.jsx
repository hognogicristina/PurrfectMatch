import { useEffect, useState } from "react";
import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import styles from "./AuthForm.module.css";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (data && data.error) {
      data.error.forEach((error) => {
        toast.error(error.message);
      });
    }
  }, [data]);

  return (
    <div className={styles["auth-container"]}>
      <div className={styles["pink-container"]}>
        <motion.div
          className={styles["auth-form"]}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        >
          <Form method="post">
            <h2>Login to Purrfect Match</h2>
            <label>
              Username or Email
              <input
                name="usernameOrEmail"
                type="text"
                placeholder="Enter your username or email"
              />
            </label>
            <label className={styles["password-input"]}>
              Password
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />
              <span
                className={styles["toggle-password"]}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </label>
            <label className={styles["checkbox-label"]}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={isSubmitting}
              type="submit"
            >
              Login
            </motion.button>
            <div className={styles["links-container"]}>
              <Link to="/register" className={styles["create-account-link"]}>
                Don't have an account?
              </Link>
              <Link
                to="/forgot-password"
                className={styles["forgot-password-link"]}
              >
                Forgot password?
              </Link>
            </div>
          </Form>
          <ToastContainer
            position="top-center"
            autoClose={6000}
            closeButton={false}
          />
        </motion.div>
      </div>
    </div>
  );
}
