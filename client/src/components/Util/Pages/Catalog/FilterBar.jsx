import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useToast } from "../../Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";
import { getAuthToken } from "../../../../util/auth.js";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { GrPowerReset } from "react-icons/gr";
import CustomSelect from "../../Custom/Reuse/CustomSelect.jsx";
import { useUserDetails } from "../../../../util/useUserDetails.js";

function FilterBar({ searchParams, setSearchParams }) {
  const { notifyError } = useToast();
  const [breeds, setBreeds] = useState([]);
  const [ageTypes, setAgeTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [healthProblem, setHealthProblem] = useState([]);
  const token = getAuthToken();
  const { userDetails } = useUserDetails();
  const [genders] = useState([
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ]);

  useEffect(() => {
    async function fetchBreeds() {
      const response = await fetch("http://localhost:3000/breeds");
      const data = await response.json();
      if (response.ok) {
        setBreeds(
          data.data.map((breed) => ({ value: breed.name, label: breed.name })),
        );
      } else {
        notifyError(data.message);
        return null;
      }
    }

    async function fetchAgeTypes() {
      const response = await fetch("http://localhost:3000/age-types");
      const data = await response.json();
      if (response.ok) {
        setAgeTypes(
          data.data.map((ageType) => ({
            value: ageType.type,
            label: ageType.type,
          })),
        );
      } else {
        notifyError(data.message);
        return null;
      }
    }

    async function fetchHealthProblems() {
      const response = await fetch("http://localhost:3000/health-problems");
      const data = await response.json();
      if (response.ok) {
        setHealthProblem(
          data.data.map((cats) => ({
            value: cats,
            label: cats,
          })),
        );
      } else {
        notifyError(data.message);
        return null;
      }
    }

    async function fetchColors() {
      const response = await fetch("http://localhost:3000/colors");
      const data = await response.json();
      if (response.ok) {
        setColors(
          data.data.map((color) => ({
            value: color,
            label: color,
          })),
        );
      } else {
        notifyError(data.message);
        return null;
      }
    }

    fetchBreeds();
    fetchAgeTypes();
    fetchHealthProblems();
    fetchColors();
  }, []);

  const handleChange = (name, selectedOption) => {
    if (selectedOption) {
      searchParams.set(name, selectedOption.value);
    } else {
      searchParams.delete(name);
    }
    searchParams.set("page", 1);
    setSearchParams(searchParams, { replace: true });
  };

  const handleClearAll = () => {
    searchParams.delete("search");
    searchParams.delete("selectedBreed");
    searchParams.delete("selectedLifeStage");
    searchParams.delete("selectedHealthProblem");
    searchParams.delete("selectedGender");
    searchParams.delete("selectedColor");
    searchParams.set("sortBy", "breed");
    searchParams.set("page", 1);
    setSearchParams(searchParams, { replace: true });
  };

  const handleSortOrder = (order) => {
    searchParams.set("sortOrder", order);
    setSearchParams(searchParams);
  };

  return (
    <motion.div
      className="filterBar"
      initial={{ x: -100 }}
      transition={{ duration: 0.5 }}
      whileInView={{ x: 0 }}
      viewport={{ once: true }}
    >
      <div className="filterBarButtonsContainer">
        <motion.div
          onClick={handleClearAll}
          className="filterBarButtons"
          whileTap={{ scale: 0.9 }}
        >
          <GrPowerReset />
        </motion.div>
        <motion.div
          onClick={() => handleSortOrder("asc")}
          whileTap={{ scale: 0.9 }}
        >
          <HiSortAscending
            color={
              searchParams.get("sortOrder") === "asc" ? "#e37fb6" : "#665967"
            }
            className="filterBarButtons"
          />
        </motion.div>
        <motion.div
          onClick={() => handleSortOrder("desc")}
          whileTap={{ scale: 0.9 }}
        >
          <HiSortDescending
            color={
              searchParams.get("sortOrder") === "desc" ? "#e37fb6" : "#665967"
            }
            className="filterBarButtons"
          />
        </motion.div>
      </div>
      <input
        type="text"
        name="search"
        onChange={(e) => handleChange(e.target.name, { value: e.target.value })}
        placeholder="Search cats..."
        // value={searchParams.get("search") || ""}
      />
      <label>Breed</label>
      <CustomSelect
        value={
          breeds.find(
            (option) => option.value === searchParams.get("selectedBreed"),
          ) || null
        }
        name="selectedBreed"
        onChange={(selectedOption) =>
          handleChange("selectedBreed", selectedOption)
        }
        options={breeds}
        placeholder="Any Breed"
        isClearable={true}
      />
      <label>Age Type</label>
      <CustomSelect
        value={
          ageTypes.find(
            (option) => option.value === searchParams.get("selectedLifeStage"),
          ) || null
        }
        name="selectedLifeStage"
        onChange={(selectedOption) =>
          handleChange("selectedLifeStage", selectedOption)
        }
        options={ageTypes}
        placeholder="Any Age Types"
        isClearable={true}
      />
      <label>Health Problems</label>
      <CustomSelect
        value={
          healthProblem.find(
            (option) =>
              option.value === searchParams.get("selectedHealthProblem"),
          ) || null
        }
        name="selectedHealthProblem"
        onChange={(selectedOption) =>
          handleChange("selectedHealthProblem", selectedOption)
        }
        options={healthProblem}
        placeholder="Any Health Problems"
        isClearable={true}
      />
      <label>Gender</label>
      <CustomSelect
        value={
          genders.find(
            (option) => option.value === searchParams.get("selectedGender"),
          ) || null
        }
        name="selectedGender"
        onChange={(selectedOption) =>
          handleChange("selectedGender", selectedOption)
        }
        options={genders}
        placeholder="Any Gender"
        isClearable={true}
      />
      <label>Color</label>
      <CustomSelect
        value={
          colors.find(
            (option) => option.value === searchParams.get("selectedColor"),
          ) || null
        }
        name="selectedColor"
        onChange={(selectedOption) =>
          handleChange("selectedColor", selectedOption)
        }
        options={colors}
        placeholder="Any Color"
        isClearable={true}
      />
      {token && userDetails.role === "user" && (
        <motion.div className="addCatButtonContainer" whileTap={{ scale: 0.9 }}>
          <NavLink className="addCatButton" to="/cats/add">
            Give a Cat a Home
          </NavLink>
        </motion.div>
      )}
    </motion.div>
  );
}

export default FilterBar;
