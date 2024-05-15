import { useEffect, useState, useRef } from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import { useToast } from "../../components/Util/Custom/ToastProvider.jsx";
import { AiOutlineCamera, AiOutlineDelete } from "react-icons/ai";
import { getAuthToken } from "../../util/auth.js";

function UploadsImage({ initialImages = [] }) {
  const data = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError } = useToast();
  const [images, setImages] = useState(initialImages);
  const [imageToReplace, setImageToReplace] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (imageToReplace !== null) {
      setImages((prev) =>
        prev.map((img, index) => (index === imageToReplace ? files[0] : img)),
      );
      setImageToReplace(null);
    } else {
      if (files.length + images.length > 5) {
        notifyError("You can only upload up to 5 images.");
        return;
      }
      setImages((prev) => [...prev, ...files]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleImageDelete = (index, e) => {
    e.stopPropagation();
    e.preventDefault();
    setImages((prev) => prev.filter((_, i) => i !== index));

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
      notifyError(data.error[0].message);
    }
  }, [data]);

  return (
    <div className="imageUploadContainer">
      <label className="imageUpload">
        <input
          type="file"
          accept="image/*"
          name="image"
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
                src={URL.createObjectURL(image)}
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

export default UploadsImage;

export async function action({ request }) {
  const token = getAuthToken();
  const data = await request.formData();
  const imageFiles = data.getAll("image");

  const formData = new FormData();
  imageFiles.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
  });

  const response = await fetch("http://localhost:3000/uploads", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 500
  ) {
    return data;
  }

  return data.data;
}
