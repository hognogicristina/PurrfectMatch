import { Form, useActionData, useNavigation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/ToastProvider.jsx";

export default function DeleteProfile({ userDetail }) {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    async function getUser() {
      const userInfo = await userDetail;
      setUser(userInfo);
    }

    getUser();
  }, [userDetail]);

  useEffect(() => {
    if (data && data.error) {
      data.error.forEach((error) => {
        notifyError(error.message);
      });
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
          <h1 className="titleFont">Delete Account</h1>
          <p>
            We are sorry to see you go. Please enter your password to confirm.
          </p>
          <input
            name="username"
            type="text"
            placeholder="Enter your username"
            defaultValue={user ? user.username : ""}
            onKeyPress={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
            required
          />
          <label className="passwordInput">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onKeyPress={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
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
      </motion.div>
    </div>
  );
}
