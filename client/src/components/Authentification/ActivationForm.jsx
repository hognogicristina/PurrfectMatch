import { useNavigate } from "react-router-dom";
import "../../styles/Auth/Activation.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ActivationForm({ data }) {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (data.error) {
      if (data.error[0].field === "email") {
        setIsExpired(true);
        setIsError(false);
        setStatusMessage(data.error[0].message);
      } else {
        setIsError(true);
        setIsExpired(false);
        setStatusMessage(data.error[0].message);
      }
    } else {
      setIsExpired(false);
      setStatusMessage(data);
    }
  }, []);

  return (
    <div className="container">
      {isExpired && !isError ? (
        <motion.div
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          className="form"
        >
          <h1>{statusMessage}</h1>
          <div>
            <p>
              In order to proceed with the activation, please open the button
              below:
            </p>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/reactivate")}
            >
              Reactivate Account
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <>
          {isError && !isExpired ? (
            <>
              <motion.div
                initial={{ y: "100vh", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
                className="errorContainer"
              >
                <img src="/errorCat.png" alt="errorCat" />
                <h1>{statusMessage}</h1>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ y: "100vh", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="form"
            >
              <h1>{statusMessage}</h1>
              <p>
                You can now use our platform and enjoy your journey in finding a
                new friend.
              </p>
              <p>For login, you can press the button below.</p>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/login")}
              >
                Go to Login
              </motion.button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
