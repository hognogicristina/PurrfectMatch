import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "./Activation.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ActivationForm({ data }) {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (data.error) {
      setIsError(true);
      setStatusMessage(data.error[0].message);
    } else {
      setIsError(false);
      setStatusMessage(data);
    }
  }, []);

  return (
    <div className="container">
      <motion.div
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="form"
      >
        {isError ? (
          <>
            <h1>{statusMessage}</h1>
            {data.error[0].field === "email" && (
              <div>
                <p>
                  In order to proceed with the activation, please open the
                  button below:
                </p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("/reactivate")}
                >
                  Reactivate Account
                </motion.button>
              </div>
            )}
          </>
        ) : (
          <>
            <h1>{statusMessage}</h1>
            <p>
              You can now use our platform and enjoy your journey in finding a
              new friend. For login, you can press the button below.
            </p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/login")}
            >
              Go to Login
            </motion.button>
          </>
        )}
        <ToastContainer
          position="top-center"
          autoClose={6000}
          closeButton={false}
        />
      </motion.div>
    </div>
  );
}
