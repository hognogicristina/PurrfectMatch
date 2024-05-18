import { useEffect, useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import "../../styles/Auth/Authentification.css";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ConfirmDialog from "../Util/Custom/Reuse/ConfirmDialog.jsx";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { Spinner } from "../Util/Custom/PageResponse/Spinner.jsx";
import LoadingSpinner from "../Util/Custom/PageResponse/LoadingSpinner.jsx";

export default function LoginForm() {
  const data = useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (data && data.error) {
      const activationError = data.error.find((err) => err.field === "expired");
      if (activationError) {
        setStatusMessage(data.error[0].message);
        setIsDialogOpen(true);
      } else {
        data.error.forEach((error) => {
          notifyError(error.message);
        });
      }
    }
  }, [data]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
          <h2>Log In</h2>
          <input
            name="usernameOrEmail"
            type="text"
            placeholder="Enter your username or email"
          />
          <label className="passwordInput">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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
            className={`submitButton submit ${isSubmitting ? "submitting" : ""}`}
          >
            {isSubmitting ? <Spinner /> : "Login"}
          </motion.button>
          <div className="linksContainer auth">
            <Link to="/register" className="linkButton">
              Don't have an account?
            </Link>
            <Link to="/reset" className="linkButton">
              Forgot password?
            </Link>
          </div>
        </Form>
      </motion.div>
      {isDialogOpen && (
        <ConfirmDialog
          title={statusMessage}
          message="Your account needs to be activated before you can log in. Please press the button below to resend the activation email."
          onClose={handleCloseDialog}
          onConfirm={() => navigate("/reactivate")}
        />
      )}
    </div>
  );
}
