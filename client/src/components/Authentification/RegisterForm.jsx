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
import { FaEye, FaEyeSlash, FaKey, FaLock, FaRegUser } from "react-icons/fa";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import LoadingSpinner from "../Util/Custom/PageResponse/LoadingSpinner.jsx";
import { MdOutlineMail } from "react-icons/md";
import Datetime from "react-datetime";
import ErrorMessage from "../Util/Custom/Reuse/ErrorMessage.jsx";

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
  const [birthday, setBirthday] = useState("");

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

  const handleBirthdayChange = (date) => {
    if (date && date._isAMomentObject && date.isValid()) {
      setBirthday(date.format("YYYY-MM-DD"));
    } else {
      setBirthday("");
    }
  };

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
                <label className="userPersonalInput">
                  <span>Birthday</span>
                  <Datetime
                    className="reactDatetimePicker"
                    inputProps={{ placeholder: "MM/DD/YYYY" }}
                    timeFormat={false}
                    onChange={handleBirthdayChange}
                  />
                  <input type="hidden" name="birthday" value={birthday} />
                  {errors.birthday && (
                    <ErrorMessage message={errors.birthday} />
                  )}
                </label>
              </div>
              <div className="formRow">
                <div className="registerInput">
                  <label>Username</label>
                  <label className="authInput">
                    <div className="iconContainer">
                      <FaRegUser />
                    </div>
                    <input
                      name="username"
                      type="text"
                      placeholder="Choose a username"
                    />
                  </label>
                  {errors.username && (
                    <p className="errorText">{errors.username}</p>
                  )}
                </div>
                <div className="registerInput">
                  <label>Email</label>
                  <label className="authInput">
                    <div className="iconContainer">
                      <MdOutlineMail />
                    </div>
                    <input
                      name="email"
                      type="text"
                      placeholder="Enter your email"
                    />
                  </label>
                  {errors.email && <p className="errorText">{errors.email}</p>}
                </div>
              </div>
              <div className="formRow">
                <div className="registerInput">
                  <label>Password</label>
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
                  {errors.password && (
                    <p className="errorText">{errors.password}</p>
                  )}
                </div>
                <div className="registerInput">
                  <label>Confirm Password</label>
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </label>
                  {errors.confirmPassword && (
                    <p className="errorText">{errors.confirmPassword}</p>
                  )}
                </div>
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
