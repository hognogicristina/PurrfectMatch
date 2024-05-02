import { useEffect, useState } from "react";
import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import styles from "./AuthForm.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (data) {
      if (data.error) {
        data.error.forEach((error) => {
          toast.error(error.message);
        });
      }

      if (data.status) {
        toast.success(data.status);
      }
    }
  }, [data]);

  return (
    <div className={styles["auth-container"]}>
      <div className={styles["pink-container"]}>
        <AnimatePresence mode="wait">
          <motion.div
            className={`${styles["auth-form"]} ${styles["auth-form-register"]}`}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
          >
            <Form method="post">
              <h2>Create Account</h2>
              <div className={styles["form-row"]}>
                <label>
                  First Name
                  <input
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    required
                  />
                </label>
                <label>
                  Last Name
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    required
                  />
                </label>
              </div>
              <div className={styles["form-row"]}>
                <label>
                  Birthday
                  <input name="birthday" type="date" />
                </label>
              </div>
              <div className={styles["form-row"]}>
                <label>
                  Username
                  <input
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className={styles["auth-form-input-register"]}
                  />
                </label>
              </div>
              <div className={styles["form-row"]}>
                <label className={styles["password-input"]}>
                  Password
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                  />
                  <span
                    className={styles["toggle-password"]}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </label>
                <label className={styles["password-input"]}>
                  Confirm Password
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    required
                  />
                  <span
                    className={styles["toggle-password"]}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </label>
              </div>
              <div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={isSubmitting}
                  type="submit"
                >
                  Register
                </motion.button>
              </div>
              <div className={styles["links-container"]}>
                <Link to="/login" className={styles["create-account-link"]}>
                  Already have an account?
                </Link>
              </div>
            </Form>
            <ToastContainer
              position="top-center"
              autoClose={6000}
              closeButton={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
