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
    if (files.length + images.length > 5) {
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

      if (response.status === 201) {
        newUris.push(response.data.data[0].uri);
      } else {
        notifyError(response.data.data.error[0].message);
      }
    }

    const updatedUris = [...uris, ...newUris];
    setUris(updatedUris);
    onImageUpload(updatedUris);

    if (imageToReplace !== null) {
      setImages((prev) =>
        prev.map((img, index) =>
          index === imageToReplace ? URL.createObjectURL(files[0]) : img,
        ),
      );
      setImageToReplace(null);
    } else {
      setImages((prev) => [
        ...prev,
        ...files.map((file) => URL.createObjectURL(file)),
      ]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleImageDelete = (index, e) => {
    e.stopPropagation();
    e.preventDefault();
    setImages((prev) => prev.filter((_, i) => i !== index));
    setUris((prev) => prev.filter((_, i) => i !== index));
    onImageUpload(uris.filter((_, i) => i !== index));

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
      data.forEach((error) => {
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
