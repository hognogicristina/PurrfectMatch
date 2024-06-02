import { useState, useEffect } from "react";
import { useToast } from "../components/Util/Custom/PageResponse/ToastProvider.jsx";
import { getAuthToken } from "./auth.js";

export function useUserDetails() {
  const { notifyError } = useToast();
  const [userDetails, setUserDetails] = useState({
    id: "",
    username: "",
    image: "",
    role: "",
  });

  useEffect(() => {
    async function fetchUserDetails() {
      const token = getAuthToken();
      const response = await fetch("http://localhost:3000/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setUserDetails({
          id: data.data.id,
          username: data.data.username,
          image: data.data.image,
          role: data.data.role,
        });
      } else {
        data.error.forEach((err) => {
          if (err.field === "server") {
            notifyError(err.message);
          }
        });
      }
    }

    fetchUserDetails();
  }, [notifyError]);

  return { userDetails };
}
