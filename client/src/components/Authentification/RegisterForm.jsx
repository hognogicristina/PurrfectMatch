import { useEffect, useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import "../../styles/Auth/Authentification.css";
import { AnimatePresence, motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import LoadingSpinner from "../Util/Custom/PageResponse/LoadingSpinner.jsx";

export default function RegisterForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError, notifySuccess } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (data) {
      if (data.error) {
        const newErrors = {};
        data.error.forEach((error) => {
          if (error.field === "server") {
            notifyError(error.message);
          }
          newErrors[error.field] = error.message;
        });
        setErrors(newErrors);
      }
      if (data.status) {
        notifySuccess(data.status);
        setShowSuccessModal(true);
      }
    }
  }, [data]);

  function handleContinue() {
    navigate("/");
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="authContainer">
      <AnimatePresence mode="wait">
        {showSuccessModal ? (
          <motion.div
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className="authForm"
          >
            <h2>Congratulations!</h2>
            <p>
              Your account has been successfully created. Please activate your
              account by going to your email and opening the link we sent to
              you.
            </p>
            <motion.button
              className="simpleButton submit"
              whileTap={{ scale: 0.9 }}
              onClick={handleContinue}
            >
              Continue
            </motion.button>
          </motion.div>
        ) : (
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
              <h2>Create Account</h2>
              <div className="formRow">
                <label>
                  First Name
                  <input
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="errorText">{errors.firstName}</p>
                  )}
                </label>
                <label>
                  Last Name
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="errorText">{errors.lastName}</p>
                  )}
                </label>
              </div>
              <div className="formRow">
                <label>
                  Birthday
                  <input name="birthday" type="date" />
                  {errors.birthday && (
                    <p className="errorText">{errors.birthday}</p>
                  )}
                </label>
              </div>
              <div className="formRow">
                <label>
                  Username
                  <input
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                  />
                  {errors.username && (
                    <p className="errorText">{errors.username}</p>
                  )}
                </label>
                <label>
                  Email
                  <input
                    name="email"
                    type="text"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="errorText">{errors.email}</p>}
                </label>
              </div>
              <div className="formRow">
                <label className="passwordInput">
                  Password
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                  />
                  <span
                    className={`togglePassword ${errors.password ? "show" : ""}`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {errors.password && (
                    <p className="errorText">{errors.password}</p>
                  )}
                </label>
                <label className="passwordInput">
                  Confirm Password
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                  />
                  <span
                    className={`togglePassword ${errors.confirmPassword ? "show" : ""}`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {errors.confirmPassword && (
                    <p className="errorText">{errors.confirmPassword}</p>
                  )}
                </label>
              </div>
              <div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  disabled={isSubmitting}
                  type="submit"
                  className={`submitButton submit ${isSubmitting ? "submitting" : ""}`}
                >
                  {isSubmitting ? "Creating account.." : "Register"}
                </motion.button>
              </div>
              <div className="linksContainer auth">
                <Link to="/login" className="linkButton">
                  Already have an account?
                </Link>
              </div>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
