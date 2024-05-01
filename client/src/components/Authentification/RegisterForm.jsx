import { useEffect, useState } from "react";
import { Form, useActionData, useNavigate } from "react-router-dom";
import styles from "./AuthForm.module.css";
import { AnimatePresence, motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

export default function RegisterForm() {
  const data = useActionData();
  const [step, setStep] = useState(1);
  const [prevStep, setPrevStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.error) {
      data.error.forEach((error) => {
        toast.error(error.message);
      });
    }
  }, [data]);

  const nextStep = () => {
    setPrevStep(step);
    setStep((prevStep) => prevStep + 1);
  };

  const backStep = () => {
    setPrevStep(step);
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const getAnimationProps = (currentStep, previousStep) => {
    if (previousStep === 0) {
      return {
        initial: { y: "100vh", opacity: 0 },
        animate: { y: 0, opacity: 1 },
      };
    } else {
      const direction = currentStep > previousStep ? "-100vw" : "100vw";
      return {
        initial: { x: direction, opacity: 0 },
        animate: { x: 0, opacity: 1 },
      };
    }
  };

  const animationProps = getAnimationProps(step, prevStep);

  return (
    <div className={styles["auth-container"]}>
      <div className={styles["pink-container"]}>
        <AnimatePresence mode="wait">
          <motion.div
            className={styles["auth-form"]}
            key={step}
            {...animationProps}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
          >
            <Form method="post">
              {step === 1 && (
                <>
                  <h2>Create Account</h2>
                  <p>Step 1: Enter your name and specify your birthday</p>
                  <label>
                    First Name
                    <input
                      name="firstName"
                      type="text"
                      placeholder="Enter your first name"
                    />
                  </label>
                  <label>
                    Last Name
                    <input
                      name="lastName"
                      type="text"
                      placeholder="Enter your last name"
                    />
                  </label>
                  <label>
                    Birthday
                    <input name="birthday" type="date" />
                  </label>
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextStep}
                      type="button"
                    >
                      Next
                    </motion.button>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <h2>Create Account</h2>
                  <p>
                    Step 2: Create a unique username and introduce your email
                  </p>
                  <label>
                    Username
                    <input
                      name="username"
                      type="text"
                      placeholder="Choose a username"
                    />
                  </label>
                  <label>
                    Email
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                    />
                  </label>
                  <div className={styles["button-container"]}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={backStep}
                      type="button"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextStep}
                      className={styles["next-button"]}
                      type="button"
                    >
                      Next
                    </motion.button>
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <h2>Create Account</h2>
                  <p>Step 3: Create a password</p>
                  <label>
                    Password
                    <input
                      name="password"
                      type="password"
                      placeholder="Create a password"
                    />
                  </label>
                  <label>
                    Confirm Password
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                    />
                  </label>
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={backStep}
                      type="button"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="submit"
                    >
                      Register
                    </motion.button>
                  </div>
                </>
              )}
            </Form>
            <ToastContainer
              position="top-center"
              autoClose={6000}
              closeButton={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
