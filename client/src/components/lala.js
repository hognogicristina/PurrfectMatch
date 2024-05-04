import React, { useState } from "react";
import "./HomeContent.css";
import { Link } from "react-router-dom";

export default function HomeContent({ cats, breeds }) {
  const [startIndex, setStartIndex] = useState(0);
  const displayCount = 5;

  const prevCat = () => {
    const newIndex = startIndex > 0 ? startIndex - 1 : breeds.data.length - 1;
    setStartIndex(newIndex);
  };

  const nextCat = () => {
    const newIndex = (startIndex + 1) % breeds.data.length;
    setStartIndex(newIndex);
  };

  const getDisplayBreeds = () => {
    const result = [];
    for (let i = 0; i < displayCount; i++) {
      const breedIndex = (startIndex + i) % breeds.data.length;
      result.push(breeds.data[breedIndex]);
    }
    return result;
  };

  return (
    <div className="homeContent">
      <div className="intro">
        <img src="cat1.jpg" alt="cat1" className="introImg bigImg" />
        <img src="cat2.png" alt="cat2" className="introImg smallImg" />
      </div>
      <div className="breeds">
        <h2 className="title">It's time to find your purrfect match</h2>
        <button className="prevButton" onClick={prevCat}>
          &#9664;
        </button>
        <div className="breedsGrid">
          {getDisplayBreeds().map((breed, index) => (
            <div className="breedCard" key={index}>
              <img src={breed.url} alt={breed.name} className="breedImage" />
              <p className="breedName">{breed.name}</p>
            </div>
          ))}
        </div>
        <button className="nextButton" onClick={nextCat}>
          &#9654;
        </button>
      </div>
      <div className="about">
        <h2>About Us</h2>
        <p>
          We are a non-profit organization dedicated to finding loving homes for
          cats in need. Our mission is to match cats with loving families and to
          provide support and resources to help ensure a successful adoption.
          <Link to={"/cats"}>Find A Cat</Link>
        </p>
        <img src="cat4.jpg" alt="cat4" />
      </div>
      <div className="recentCats">
        {cats.map((cat, index) => (
          <div key={index} className="catRecentItem">
            <img src={cat.image} alt={cat.name} />
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
      <div className="aboutCats">
        <h2>Understanding Your Feline Friend</h2>
        <p>
          Cats, with their grace, independence, and mysterious allure, have
          enchanted humans for centuries. Whether you're a seasoned cat owner or
          considering inviting a feline friend into your home for the first
          time, understanding their needs and behaviors is essential for a happy
          and harmonious relationship.
        </p>
        <p>
          Cats are highly independent creatures but also enjoy companionship.
          They form strong bonds with their human caregivers and other household
          pets. Each cat has a unique personality. Some may be outgoing and
          playful, while others are more reserved and observant. Understanding
          your cat's temperament will help you provide appropriate care and
          enrichment.
        </p>
        <p>
          Cats communicate through body language, vocalizations, and behaviors.
          Learning to interpret these signals will strengthen your bond and help
          you address their needs.
        </p>

        <h2>Essentials of Cat Care</h2>
        <ul>
          <li>
            <strong>Nutrition:</strong> Provide a balanced diet formulated for
            cats' specific nutritional needs. Consult with your veterinarian to
            determine the best food type and feeding schedule based on your
            cat's age, weight, and health status.
          </li>
          <li>
            <strong>Hydration:</strong> Always ensure access to fresh, clean
            water. Some cats prefer running water, so consider investing in a
            cat fountain to encourage drinking.
          </li>
          <li>
            <strong>Grooming:</strong> Regular grooming is essential for
            maintaining your cat's coat health and minimizing hairballs. Brush
            your cat's fur several times a week, trim their nails as needed, and
            clean their ears and teeth regularly.
          </li>
          <li>
            <strong>Litter Box Maintenance:</strong> Cats are meticulous about
            their bathroom habits. Provide a clean litter box in a quiet,
            accessible location. Scoop waste daily and replace litter regularly
            to prevent odor and maintain hygiene.
          </li>
          <li>
            <strong>Exercise and Enrichment:</strong> Keep your cat mentally and
            physically stimulated with interactive toys, scratching posts, and
            puzzle feeders. Engage in regular play sessions to prevent boredom
            and encourage exercise.
          </li>
          <li>
            <strong>Veterinary Care:</strong> Schedule regular wellness exams
            with a veterinarian to monitor your cat's health, update
            vaccinations, and address any concerns promptly. Spaying or
            neutering is essential to prevent unwanted litters and certain
            health issues.
          </li>
          <li>
            <strong>Creating a Safe Environment:</strong> Cats are curious
            creatures and may explore every nook and cranny of your home. Remove
            hazards such as toxic plants, small objects that could be swallowed,
            and accessible cords or wires. Provide vertical spaces for climbing
            and perching, such as cat trees or shelves, to satisfy your cat's
            natural instinct to survey their territory from above.
          </li>
        </ul>

        <h2>Understanding Cat Behavior</h2>
        <p>
          Scratching is a natural behavior for cats to maintain their claws and
          mark their territory. Provide appropriate scratching surfaces, such as
          scratching posts or cardboard pads, and discourage scratching
          furniture by using deterrents or covering surfaces with double-sided
          tape.
        </p>
        <p>
          Cats may exhibit territorial aggression, especially in multi-cat
          households. Provide separate resources (food, water, litter boxes,
          resting areas) for each cat to minimize competition and reduce stress.
        </p>
        <p>
          Pay attention to changes in your cat's behavior, as they may indicate
          underlying health issues or environmental stressors. Signs of illness
          include decreased appetite, lethargy, hiding, vomiting, diarrhea, or
          unusual vocalizations.
        </p>
      </div>
      <footer>
        <p>&copy; 2024 Your Online Cat Adoption Center</p>
      </footer>
    </div>
  );
}
