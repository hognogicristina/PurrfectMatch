import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

export default function ChangeUsernameProfile() {
  const data = useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (data && data.error) {
      data.error.forEach((error) => {
        toast.error(error.message);
      });
    } else if (data && data.success) {
      toast.success(data.success);
      navigate("/user");
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
        <Form method="post">
          <h1>Change Username</h1>
          <input
            name="username"
            type="text"
            placeholder="Enter your username"
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
          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={isSubmitting}
            type="submit"
            className="save"
          >
            Save
          </motion.button>
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
