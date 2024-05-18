import { Form, useActionData, useNavigation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";

export default function ModifyAddressForm({ userDetail }) {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError, notifySuccess } = useToast();
  const [user, setUser] = useState();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function getUser() {
      const userInfo = await userDetail;
      setUser(userInfo);
    }

    getUser();
  }, [userDetail]);

  useEffect(() => {
    if (data && data.error) {
      const newErrors = {};
      data.error.forEach((error) => {
        newErrors[error.field] = error.message;
      });
      setErrors(newErrors);
      if (data.error.field === "server") {
        notifyError(data.error.message);
      }
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
        <Form method="post" className="addressForm">
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
            />
            {errors.country && <p className="errorText">{errors.country}</p>}
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
              />
              {errors.county && <p className="errorText">{errors.county}</p>}
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
              />
              {errors.city && <p className="errorText">{errors.city}</p>}
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
              />
              {errors.street && <p className="errorText">{errors.street}</p>}
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
              />
              {errors.number && <p className="errorText">{errors.number}</p>}
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
              />
              {errors.floor && <p className="errorText">{errors.floor}</p>}
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
              />
              {errors.apartment && (
                <p className="errorText">{errors.apartment}</p>
              )}
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
            />
            {errors.postalCode && (
              <p className="errorText">{errors.postalCode}</p>
            )}
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
