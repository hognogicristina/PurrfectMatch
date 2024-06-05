import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CatsGrid({ cats, errorMessage }) {
  return (
    <div className="cats">
      <h1 className="title">Recent Cats</h1>
      {cats.length > 0 ? (
        <div className="gridCats">
          {cats.map((cat, index) => (
            <motion.div
              key={index}
              className={`cat ${index % 2 === 0 ? "left" : "right"}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="gridCat">
                <img src={cat.image} alt={cat.name} className="imgCat" />
                <div className="infoCat">
                  <h2>{cat.name}</h2>
                  <h3>Life stage: {cat.lifeStage}</h3>
                  <p className="catDescription">{cat.description}</p>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Link to={`/cats/cat/${cat.id}`} className="btnCat">
                      Learn More &gt;
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="errorMessage">{errorMessage}</p>
      )}
    </div>
  );
}
