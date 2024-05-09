import { useEffect, useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import "./Authentification.css";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReactivateDialog from "../Util/Dialog/ReactivateDialog.jsx";
import { useToast } from "../Util/Custom/ToastProvider.jsx";

export default function LoginForm() {
  const data = useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError } = useToast();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

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

  return (
    <div className="authContainer">
      <motion.div
        className="authForm"
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
      >
        <Form method="post">
          <h2>Log In</h2>
          <input
            name="usernameOrEmail"
            type="text"
            placeholder="Enter your username or email"
            required
          />
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
          <div className="rememberMe">
            <input
              name="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label>Remember me</label>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={isSubmitting}
            type="submit"
            className="submitButton submit"
          >
            Login
          </motion.button>
          <div className="linksContainer">
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
        <ReactivateDialog
          title={statusMessage}
          message="Your account needs to be activated before you can log in. Please press the button below to resend the activation email."
          onClose={handleCloseDialog}
          onConfirm={() => navigate("/reactivate")}
        />
      )}
    </div>
  );
}
