import { AiOutlineCamera } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import { useToast } from "../Custom/PageResponse/ToastProvider.jsx";
import axios from "axios";
import { getAuthToken } from "../../../util/auth.js";

function UploadImage({ initialImage, initialUris, onImageUpload }) {
  const data = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError } = useToast();
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uris, setUris] = useState(initialUris || []);

  const handleImageChange = async (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    if (selectedImage) {
      const formData = new FormData();
      formData.append("files", selectedImage);
      const token = getAuthToken();

      setIsUploading(true);
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
        setIsUploading(false);
        const newUri = data.data[0].uri;
        const updatedUris = [...uris, newUri];
        setUris(updatedUris);
        onImageUpload(updatedUris);
      } else {
        data.forEach((error) => {
          notifyError(error.message);
        });
      }
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
          disabled={isSubmitting || isUploading}
          style={{ display: "none" }}
        />
        {initialImage && !image && (
          <div className="imageContainerUpload">
            <img src={initialImage} alt="selected" className="selectedImage" />
            <div className="cameraIconAbove">
              <AiOutlineCamera />
            </div>
          </div>
        )}

        {!initialImage && !image && (
          <div className="cameraIconCentered">
            <AiOutlineCamera />
          </div>
        )}

        {image && (
          <div>
            <img
              src={URL.createObjectURL(image)}
              alt="Selected"
              className="selectedImage"
            />
            <div className="cameraIconAbove">
              <AiOutlineCamera />
            </div>
          </div>
        )}
      </label>
    </div>
  );
}

export default UploadImage;
