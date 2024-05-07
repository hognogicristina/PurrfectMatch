import { useEffect, useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "./Authentification.css";
import { AnimatePresence, motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (data) {
      if (data.error) {
        data.error.forEach((error) => {
          toast.error(error.message);
        });
      }
      if (data.status) {
        toast.success(data.status);
        setShowSuccessModal(true);
      }
    }
  }, [data]);

  function handleContinue() {
    navigate("/login");
  }

  return (
    <div className="authContainer">
      <AnimatePresence mode="wait">
        {showSuccessModal ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            className="authForm"
          >
            <h2>Congratulations!</h2>
            <p>
              Your account has been successfully created. Please activate your
              account by going to your email and opening the link we sent to
              you.
            </p>
            <motion.button
              className="submit"
              whileTap={{ scale: 0.9 }}
              onClick={handleContinue}
            >
              Continue
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="authForm"
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
          >
            <Form method="post">
              <h2>Create Account</h2>
              <div className="formRow">
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
              <div className="formRow">
                <label>
                  Birthday
                  <input name="birthday" type="date" />
                </label>
              </div>
              <div className="formRow">
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
                  />
                </label>
              </div>
              <div className="formRow">
                <label className="passwordInput">
                  Password
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
                  Confirm Password
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
              </div>
              <div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  disabled={isSubmitting}
                  type="submit"
                  className="submit"
                >
                  Register
                </motion.button>
              </div>
              <div className="linksContainer">
                <Link to="/login">Already have an account?</Link>
              </div>
            </Form>
            <ToastContainer
              position="top-center"
              autoClose={6000}
              closeButton={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
