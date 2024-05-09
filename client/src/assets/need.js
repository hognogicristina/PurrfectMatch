import { motion } from "framer-motion";

<>
  <h1>{statusMessage}</h1>
  <div>
    <p>
      In order to proceed with the activation, please open the button below:
    </p>
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => navigate("/reactivate")}
    >
      Reactivate Account
    </motion.button>
  </div>
</>;
