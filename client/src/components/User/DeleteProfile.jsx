import { Form, NavLink, useActionData, useNavigation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/ToastProvider.jsx";
import "./MyProfile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function DeleteProfile({ userDetail }) {
  const data = useActionData();
  const { notifyError } = useToast();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
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
    <div className="dialogOverlay">
      <motion.div
        className="dialog"
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100vh", opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
      >
        <NavLink to="/user" className="closeButton">
          <FontAwesomeIcon icon={faXmark} className="faXmark" />
        </NavLink>
        <Form
          method="delete"
          className="deleteAccountContainer"
          action="/user/delete"
        >
          <h1 className="titleFontRed">Delete Account</h1>
          <p>
            Deleting your account will remove all your data and you will not be
            able to recover it.
          </p>
          <p>
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <p>
            Please enter your username to confirm that you understand the
            consequences of deleting your account.
          </p>
          <input
            className="deleteAccountInput"
            name="username"
            type="text"
            placeholder="Enter your username"
            onKeyPress={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
            required
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={isSubmitting}
            type="submit"
            className="simpleButton delete"
          >
            I understand the consequences, delete my account
          </motion.button>
        </Form>
      </motion.div>
    </div>
  );
}
