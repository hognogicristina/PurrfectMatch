import { motion } from "framer-motion";

function Intro() {
  return (
    <div className="intro">
      <motion.img
        src="home.jpg"
        alt="home"
        className="introImg bigImg"
        whileInView={{ y: [-50, 0], opacity: [0, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="introText"
        whileInView={{ y: [50, 0], opacity: [0, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="titleHome">It's time to find your purrfect match</h2>
      </motion.div>
    </div>
  );
}

export default Intro;
