import { Form, useActionData, useNavigation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import CustomSelect from "../Util/Custom/Reuse/CustomSelect.jsx";

export default function ModifyAddressForm({ userDetail }) {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError, notifySuccess } = useToast();
  const [user, setUser] = useState();
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const initialValuesSet = useRef(false);

  useEffect(() => {
    async function getUser() {
      const userInfo = await userDetail;
      setUser(userInfo);

      if (!initialValuesSet.current && userInfo.country) {
        setSelectedCountry({
          value: userInfo.countryId,
          label: userInfo.country,
        });
      }

      if (!initialValuesSet.current && userInfo.city) {
        setSelectedCity({
          value: userInfo.cityId,
          label: userInfo.city,
        });
      }

      initialValuesSet.current = true;
    }

    getUser();
  }, [userDetail]);

  useEffect(() => {
    async function fetchCountries() {
      const response = await fetch("http://localhost:3000/countries");
      const data = await response.json();
      if (response.ok) {
        setCountries(
          data.data.map((country) => ({
            value: country.id,
            label: country.name,
          })),
        );
      } else {
        data.error.forEach((error) => {
          notifyError(error.message);
        });
      }
    }

    fetchCountries();
  }, []);

  useEffect(() => {
    async function fetchCities() {
      if (selectedCountry) {
        const response = await fetch(
          `http://localhost:3000/cities/${selectedCountry.value}`,
        );
        const data = await response.json();
        if (response.ok) {
          setCities(
            data.data.map((city) => ({ value: city.id, label: city.name })),
          );
        } else {
          data.error.forEach((error) => {
            notifyError(error.message);
          });
        }
      }
    }

    fetchCities();
  }, [selectedCountry]);

  useEffect(() => {
    if (data && data.error) {
      const newErrors = {};
      data.error.forEach((error) => {
        if (error.field === "server") {
          notifyError(error.message);
        }
        newErrors[error.field] = error.message;
      });
      setErrors(newErrors);
    } else if (data && data.status) {
      notifySuccess(data.status);
      setErrors({});
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
          <div className="address">
            <label className="orderAddContainer modify">
              Country
              <CustomSelect
                options={countries}
                value={selectedCountry}
                onChange={(value) => {
                  setSelectedCountry(value);
                  setSelectedCity(null);
                  if (!value) setCities([]);
                }}
                placeholder="Select your country"
                isClearable={true}
              />
              {errors.country && <p className="errorText">{errors.country}</p>}
              <input
                type="hidden"
                name="country"
                value={
                  selectedCountry
                    ? selectedCountry.label
                    : userDetail.country || ""
                }
              />
            </label>
            <label className="orderAddContainer modify">
              City
              <CustomSelect
                options={cities}
                value={selectedCity}
                onChange={setSelectedCity}
                placeholder="Select your city"
                isClearable={true}
                isDisabled={!selectedCountry}
              />
              {errors.city && <p className="errorText">{errors.city}</p>}
              <input
                type="hidden"
                name="city"
                value={
                  selectedCity ? selectedCity.label : userDetail.city || ""
                }
              />
            </label>
          </div>
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
