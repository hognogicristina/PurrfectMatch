import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

function CatsNavigation({ onClose }) {
  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.3,
      filter: "blur(20px)",
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.2,
      },
    },
  };

  const tapEffects = {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeInOut",
    },
  };

  return (
    <motion.nav className="catsDropdown">
      <motion.div variants={itemVariants} whileTap={tapEffects}>
        <NavLink to={"/cats"} onClick={onClose}>
          Feline Friends Catalog
        </NavLink>
      </motion.div>
      <motion.div variants={itemVariants} whileTap={tapEffects}>
        <NavLink to={"/cat"} onClick={onClose}>
          Give a Cat a Home
        </NavLink>
      </motion.div>
      <motion.div variants={itemVariants} whileTap={tapEffects}>
        <NavLink to={"/user/cats-owned"} onClick={onClose}>
          Purrfect Matches Archive
        </NavLink>
      </motion.div>
      <motion.div variants={itemVariants} whileTap={tapEffects}>
        <NavLink to={"/user/cats-sent-to-adoption"} onClick={onClose}>
          Rehomed Felines Records
        </NavLink>
      </motion.div>
    </motion.nav>
  );
}

export default CatsNavigation;
