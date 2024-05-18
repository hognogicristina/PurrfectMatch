import { getAuthToken } from "../../../util/auth.js";
import { AiOutlineCamera } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import { useToast } from "../Custom/PageResponse/ToastProvider.jsx";

function UploadImage({ initialImage }) {
  const data = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError } = useToast();
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  useEffect(() => {
    if (data && data.error) {
      notifyError(data.error[0].message);
    }
  }, []);

  return (
    <div className="imageUploadContainer">
      <label className="imageUpload">
        <input
          type="file"
          accept="image/*"
          name="file"
          onChange={handleImageChange}
          disabled={isSubmitting}
          style={{ display: "none" }}
        />
        {initialImage && !image && (
          <div className="imageContainerUpload">
            <img src={initialImage} alt="Selected" className="selectedImage" />
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
