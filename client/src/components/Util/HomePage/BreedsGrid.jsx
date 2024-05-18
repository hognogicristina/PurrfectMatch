import { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import "../../../styles/PurrfectMatch/HomeContent.css";

export default function BreedsGrid({ breeds }) {
  const ref = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const totalWidth = breeds.length * 300 * 2;
    controls.start({ x: [`0px`, `-${totalWidth / 2}px`] });
  }, [breeds, controls]);

  return (
    <>
      <motion.div className="breeds" ref={ref}>
        <motion.ul
          className="breedsGrid"
          animate={controls}
          transition={{
            duration: 300,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{ display: "flex", width: `${breeds.length * 300 * 2}px` }}
          initial={{ x: 0 }}
        >
          {[...breeds, ...breeds].map((breed, index) => (
            <motion.li className="element" key={index}>
              <img src={breed.url} alt={breed.name} className="breedImg" />
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </>
  );
}
