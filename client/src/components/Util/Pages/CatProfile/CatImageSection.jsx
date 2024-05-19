import { motion } from "framer-motion";

export default function CatImageSection({
  catDetail,
  mainImage,
  setMainImage,
  carouselImages,
  setCarouselImages,
}) {
  const mainImageStyle = {
    backgroundImage: `url(${mainImage})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    filter: "blur(20px)",
    transform: "scale(1.1)",
  };

  const handleImageClick = (selectedImage) => {
    setCarouselImages([
      mainImage,
      ...carouselImages.filter((img) => img !== selectedImage),
    ]);
    setMainImage(selectedImage);
  };

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
      key={catDetail.id}
      className="catImagesContainer"
    >
      <div className="catItemImages" style={mainImageStyle}></div>
      <motion.img
        src={mainImage}
        alt={catDetail.name}
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
        {carouselImages.map((image, index) => (
          <motion.img
            key={`${catDetail.id}-image-${index}`}
            src={image}
            alt={`Additional view of ${catDetail.name}`}
            onClick={() => handleImageClick(image)}
            whileHover={{ scale: 1.1 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
