import { Form, useActionData, useNavigation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/ToastProvider.jsx";

export default function EditAddressProfile({ userDetail }) {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError, notifySuccess } = useToast();
  const [user, setUser] = useState();

  useEffect(() => {
    async function getUser() {
      const userInfo = await userDetail;
      setUser(userInfo);
    }

    getUser();
  }, [userDetail]);

  useEffect(() => {
    if (data && data.error) {
      data.error.forEach((error) => {
        notifyError(error.message);
      });
    } else if (data && data.status) {
      notifySuccess(data.status);
    }
  }, [data]);

  return (
    <div className="userDetailContainer">
      <motion.div
        className="userContent"
        initial={{ x: "-9vh", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
      >
        <Form method="post">
          <h1 className="titleFont">Modify Address</h1>

          <label>
            Country
            <input
              name="country"
              type="text"
              placeholder="Enter your country"
              defaultValue={user ? user.country : ""}
              onKeyPress={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              required
            />
          </label>
          <div className="address">
            <label>
              County
              <input
                name="county"
                type="text"
                placeholder="Enter your county"
                defaultValue={user ? user.county : ""}
                onKeyPress={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                required
              />
            </label>
            <label>
              City
              <input
                name="city"
                type="text"
                placeholder="Enter your city"
                defaultValue={user ? user.city : ""}
                onKeyPress={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                required
              />
            </label>
          </div>
          <div className="address">
            <label>
              Street
              <input
                name="street"
                type="text"
                placeholder="Enter your street"
                defaultValue={user ? user.street : ""}
                onKeyPress={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                required
              />
            </label>
            <label>
              Number
              <input
                name="number"
                type="text"
                placeholder="Enter your house number"
                defaultValue={user ? user.number : ""}
                onKeyPress={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                required
              />
            </label>
          </div>
          <div className="address">
            <label>
              Floor
              <input
                name="floor"
                type="text"
                placeholder="Enter your floor number"
                defaultValue={user ? user.floor : ""}
                onKeyPress={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                required
              />
            </label>
            <label>
              Apartment
              <input
                name="apartment"
                type="text"
                placeholder="Enter your apartment code"
                defaultValue={user ? user.apartment : ""}
                onKeyPress={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                required
              />
            </label>
          </div>
          <label>
            Postal Code
            <input
              name="postalCode"
              type="text"
              placeholder="Enter your postal code"
              defaultValue={user ? user.postalCode : ""}
              onKeyPress={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              required
            />
          </label>
          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={isSubmitting}
            type="submit"
            className={`submitButton save ${isSubmitting ? "submitting" : ""}`}
          >
            {isSubmitting ? "Saving.." : "Save"}
          </motion.button>
        </Form>
      </motion.div>
    </div>
  );
}
