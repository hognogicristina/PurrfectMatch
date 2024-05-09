import { getAuthToken } from "../../util/auth.js";
import { AiOutlineCamera } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import { useToast } from "../../components/Util/Custom/ToastProvider.jsx";

function UploadImage() {
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
          onChange={handleImageChange}
          disabled={isSubmitting}
          style={{ display: "none" }}
        />
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="Selected"
            className="selectedImage"
          />
        ) : (
          <div className="cameraIcon">
            <AiOutlineCamera />
          </div>
        )}
      </label>
    </div>
  );
}

export default UploadImage;

export async function action({ request }) {
  const token = getAuthToken();
  const data = await request.formData();

  const imageFile = data.get("image");

  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch("http://localhost:3000/upload", {
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
