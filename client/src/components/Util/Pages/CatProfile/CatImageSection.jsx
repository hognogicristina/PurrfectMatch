import { motion } from "framer-motion";
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";

export default function CatImageSection({
  catDetail,
  mainImage,
  setMainImage,
  carouselImages,
}) {
  const mainImageStyle = {
    backgroundImage: `url(${mainImage})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    filter: "blur(20px)",
  };

  const handleImageClick = (selectedImage) => {
    setMainImage(selectedImage);
  };

  const handleNextImage = () => {
    const currentIndex = carouselImages.indexOf(mainImage);
    const nextIndex = (currentIndex + 1) % carouselImages.length;
    setMainImage(carouselImages[nextIndex]);
  };

  const handlePreviousImage = () => {
    const currentIndex = carouselImages.indexOf(mainImage);
    const previousIndex =
      (currentIndex - 1 + carouselImages.length) % carouselImages.length;
    setMainImage(carouselImages[previousIndex]);
  };

  return (
    <div key={catDetail.id} className="catImagesContainer">
      <div className="catItemImages" style={mainImageStyle}></div>
      <motion.img
        src={mainImage}
        alt={`Main view of ${catDetail.name}`}
        className="mainImage"
        whileInView={{ y: [-30, 0], opacity: [0, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="imageCarousel"
        whileInView={{ y: [-30, 0], opacity: [0, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="mainImageContainer"
          whileInView={{ y: [-30, 0], opacity: [0, 1] }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          {carouselImages.length > 1 && (
            <motion.div whileTap={{ scale: 0.9 }}>
              <FaArrowCircleLeft
                className="navigationButton"
                onClick={handlePreviousImage}
              />
            </motion.div>
          )}
          {carouselImages.map((image, index) => (
            <motion.img
              key={`${catDetail.id}-image-${index}`}
              src={image}
              alt={`Additional view of ${catDetail.name}`}
              onClick={() => handleImageClick(image)}
              whileHover={{ scale: 1.1 }}
              className={image === mainImage ? "selectedCarouselImage" : ""}
            />
          ))}
          {carouselImages.length > 1 && (
            <motion.div whileTap={{ scale: 0.9 }}>
              <FaArrowCircleRight
                className="navigationButton"
                onClick={handleNextImage}
              />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
