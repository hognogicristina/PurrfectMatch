import React, { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import "../../Layout/HomeContent.css";

export default function BreedsGrid({ breeds }) {
  const ref = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const totalWidth = breeds.length * 300 * 2;

    const sequence = async () => {
      await controls.start({ x: `-${totalWidth / 2}px` });
      controls.set({ x: 0 });
      await sequence();
    };

    sequence();

    return () => controls.stop();
  }, [breeds, controls]);

  return (
    <>
      <motion.div className="breeds" ref={ref}>
        <motion.ul
          className="breedsGrid"
          animate={controls}
          transition={{ repeat: Infinity, duration: 300, ease: "linear" }}
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
