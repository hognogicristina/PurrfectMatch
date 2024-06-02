import { useEffect, useState, useRef } from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import { useToast } from "../Custom/PageResponse/ToastProvider.jsx";
import { AiOutlineCamera, AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { getAuthToken } from "../../../util/auth.js";

function UploadImages({ initialImages, initialUris, onImageUpload }) {
  const data = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError } = useToast();
  const [images, setImages] = useState(initialImages);
  const [uris, setUris] = useState(initialUris);
  const [imageToReplace, setImageToReplace] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (
      files.length +
        (imageToReplace !== null ? images.length - 1 : images.length) >
      5
    ) {
      notifyError("You can only upload up to 5 images.");
      return;
    }

    const token = getAuthToken();
    const newUris = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("files", file);

      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const data = response.data;
      if (response.status === 201) {
        data.data.forEach((image) => {
          newUris.push(image.uri);
        });
      } else {
        data.error.forEach((error) => {
          notifyError(error.message);
        });
      }
    }

    let updatedUris;
    let updatedImages;

    if (imageToReplace !== null) {
      updatedUris = [...uris];
      updatedUris[imageToReplace] = newUris[0];
      updatedImages = images.map((img, index) =>
        index === imageToReplace ? URL.createObjectURL(files[0]) : img,
      );
      setImageToReplace(null);
    } else {
      updatedUris = [...uris, ...newUris];
      updatedImages = [
        ...images,
        ...files.map((file) => URL.createObjectURL(file)),
      ];
    }

    setUris(updatedUris);
    setImages(updatedImages);
    onImageUpload(updatedUris);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleImageDelete = (index, e) => {
    e.stopPropagation();
    e.preventDefault();
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedUris = uris.filter((_, i) => i !== index);
    setImages(updatedImages);
    setUris(updatedUris);
    onImageUpload(updatedUris);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleImageClick = (index, e) => {
    e.stopPropagation();
    e.preventDefault();
    setImageToReplace(index);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (data && data.error) {
      data.error.forEach((error) => {
        notifyError(error.message);
      });
    }
  }, [data, notifyError]);

  return (
    <div className="imageUploadContainer">
      <label className="imageUpload">
        <input
          type="file"
          accept="image/*"
          name="files"
          onChange={handleImageChange}
          multiple
          disabled={isSubmitting || images.length >= 5}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <div className="catAddContainer">
          {images.map((image, index) => (
            <div
              key={index}
              className="imageContainerUpload"
              style={{ position: "relative" }}
              onClick={(e) => handleImageClick(index, e)}
            >
              <img
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                alt={`Selected ${index + 1}`}
                className="selectedImage catAdd"
              />
              <div
                className="catRemove"
                onClick={(e) => handleImageDelete(index, e)}
              >
                <AiOutlineDelete />
              </div>
            </div>
          ))}
          {images.length < 5 && (
            <div className="cameraIconCentered catAdd">
              <AiOutlineCamera />
            </div>
          )}
        </div>
      </label>
    </div>
  );
}

export default UploadImages;
