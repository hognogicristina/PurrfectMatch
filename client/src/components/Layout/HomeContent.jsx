import "./HomeContent.css";
import BreedsGrid from "../Util/HomePage/BreedsGrid.jsx";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Intro from "../Util/HomePage/Intro.jsx";

export default function HomeContent({ cats, breeds }) {
  return (
    <motion.div
      className="homeContent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Intro />
      <BreedsGrid breeds={breeds} />
      <div className="aboutCats">
        <h2 className="title">Understanding Your Feline Friend</h2>
        <div className="alternateContent">
          <div className="imgContainer">
            <img src="babyCat.jpg" alt="baby cat" className="imgAboutCat" />
          </div>
          <div className="content">
            <ul className="niceList">
              <li>
                <p>
                  Cats, with their grace, independence, and mysterious allure,
                  have enchanted humans for centuries.
                </p>
              </li>
              <li>
                <p>
                  Whether you're a seasoned cat owner or considering inviting a
                  feline friend into your home for the first time, understanding
                  their needs and behaviors is essential for a happy and
                  harmonious relationship.
                </p>
              </li>
              <li>
                <p>
                  Cats are highly independent creatures but also enjoy
                  companionship. They form strong bonds with their human
                  caregivers and other household pets. Each cat has a unique
                  personality. Some may be outgoing and playful, while others
                  are more reserved and observant. Understanding your cat's
                  temperament will help you provide appropriate care and
                  enrichment.
                </p>
              </li>
              <li>
                <p>
                  Cats communicate through body language, vocalizations, and
                  behaviors. Learning to interpret these signals will strengthen
                  your bond and help you address their needs.
                </p>
              </li>
            </ul>
          </div>
        </div>

        <h2 className="title">Essentials of Cat Care</h2>
        <div className="gridEssentials">
          {[
            {
              src: "catFood.jpg",
              alt: "cat food",
              title: "Nutrition",
              description:
                "Provide a balanced diet formulated for cats' specific nutritional needs. Consult with your veterinarian to determine the best food type and feeding schedule based on your cat's age, weight, and health status.",
            },
            {
              src: "catWater.jpg",
              alt: "cat water",
              title: "Hydration",
              description:
                "Always ensure access to fresh, clean water. Some cats prefer running water, so consider investing in a cat fountain to encourage drinking.",
            },
            {
              src: "catGrooming.jpg",
              alt: "cat grooming",
              title: "Grooming",
              description:
                "Regular grooming is essential for maintaining your cat's coat health and minimizing hairballs. Brush your cat's fur several times a week, trim their nails as needed, and clean their ears and teeth regularly.",
            },
            {
              src: "catLitter.jpg",
              alt: "cat litter",
              title: "Litter Box Maintenance",
              description:
                "Cats are meticulous about their bathroom habits. Provide a clean litter box in a quiet, accessible location. Scoop waste daily and replace litter regularly to prevent odor and maintain hygiene.",
            },
            {
              src: "catToy.jpg",
              alt: "cat toy",
              title: "Exercise and Enrichment",
              description:
                "Keep your cat mentally and physically stimulated with interactive toys, scratching posts, and puzzle feeders. Engage in regular play sessions to prevent boredom and encourage exercise.",
            },
            {
              src: "catVet.jpg",
              alt: "cat vet",
              title: "Veterinary Care",
              description:
                "Schedule regular wellness exams with a veterinarian to monitor your cat's health, update vaccinations, and address any concerns promptly. Spaying or neutering is essential to prevent unwanted litters and certain health issues.",
            },
            {
              src: "catTree.jpg",
              alt: "cat tree",
              title: "Creating a Safe Environment",
              description:
                "Cats are curious creatures and may explore every nook and cranny of your home. Remove hazards such as toxic plants, small objects that could be swallowed, and accessible cords or wires.",
            },
            {
              src: "catStray.jpg",
              alt: "cat stray",
              title: "Patience and Kindness",
              description:
                "Approaching a stray cat requires patience and gentleness. Maintain a calm demeanor, give the cat space to approach on its own terms, and use enticing gestures like soft words or treats. Respect their body language and signals, being patient and persistent in building trust over time. With kindness and understanding, you may earn the cat's trust and provide them with a chance for a better life.",
            },
            {
              src: "catSleep.jpg",
              alt: "cat sleep",
              title: " Rest and Readiness",
              description:
                "Cats are masterful sleepers, spending up to 16 hours a day in slumber. This isn't laziness but rather a strategic conservation of energy. Their sleep cycles alternate between deep relaxation and light dozing, allowing them to stay alert to potential threats while still getting the rest they need. This unique sleep pattern reflects their evolutionary adaptation as skilled predators, ensuring they're always ready for action.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="cardEssential"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                rotate: 5,
                transition: { duration: 0.1, delay: index * 0.01 },
              }}
              viewport={{ once: true }}
            >
              <img src={item.src} alt={item.alt} className="imgCardEssential" />
              <div className="textCardEssential">
                <strong>{item.title}:</strong>
                <p>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <h2 className="title">Understanding Cat Behavior</h2>
        <div className="understandingContent">
          <img src="smallCat.jpg" alt="cat scratch" className="imgContent" />
          <div className="textContent">
            <p>
              Scratching is a natural behavior for cats to maintain their claws
              and mark their territory. Provide appropriate scratching surfaces,
              such as scratching posts or cardboard pads, and discourage
              scratching furniture by using deterrents or covering surfaces with
              double-sided tape.
            </p>
            <p>
              Cats may exhibit territorial aggression, especially in multi-cat
              households. Provide separate resources (food, water, litter boxes,
              resting areas) for each cat to minimize competition and reduce
              stress.
            </p>
            <p>
              Pay attention to changes in your cat's behavior, as they may
              indicate underlying health issues or environmental stressors.
              Signs of illness include decreased appetite, lethargy, hiding,
              vomiting, diarrhea, or unusual vocalizations.
            </p>
          </div>
        </div>
      </div>
      <div className="cats">
        <h1 className="title">Recent Cats</h1>
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
                  <p>{cat.description}</p>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Link to={`/cats/${cat.id}`} className="btnCat">
                      Learn More &gt;
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <footer>
        <div className="footer-content">
          <p>Ready to explore more?</p>
          <div className="buttonExplore">
            <Link to={"/cats"}>Explore More</Link>
          </div>
        </div>
        <p>&copy; 2024 Your Online Cat Adoption Center</p>
      </footer>
    </motion.div>
  );
}
