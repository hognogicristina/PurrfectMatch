import { useEffect, useState } from "react";
import Select from "react-select";
import { NavLink } from "react-router-dom";
import { useToast } from "../../Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";
import { getAuthToken } from "../../../../util/auth.js";

function FilterBar({ searchParams, setSearchParams }) {
  const { notifyError } = useToast();
  const [breeds, setBreeds] = useState([]);
  const [ageTypes, setAgeTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [healthProblems, setHealthProblems] = useState([]);
  const token = getAuthToken();
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
        setHealthProblems(
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
    setSearchParams(searchParams, { replace: true });
  };

  const handleClearAll = () => {
    searchParams.delete("search");
    searchParams.delete("selectedBreed");
    searchParams.delete("selectedAgeType");
    searchParams.delete("selectedHealthProblem");
    searchParams.delete("selectedGender");
    searchParams.delete("selectedColor");
    setSearchParams(searchParams, { replace: true });
  };

  const handleSortOrder = (order) => {
    searchParams.set("sortOrder", order);
    setSearchParams(searchParams);
  };

  const customStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      borderColor: "#ff8bbd",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#ff6392",
      },
      borderRadius: "8px",
      cursor: "pointer",
    }),
    option: (styles, { isFocused, isSelected, isActive }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#ff8bbd"
        : isFocused
          ? "#ffe6f2"
          : isActive
            ? "#ffadd6"
            : null,
      color: isSelected ? "white" : "black",
      cursor: "pointer",
      ":active": {
        ...styles[":active"],
        backgroundColor: isActive ? "#ff6392" : null,
      },
    }),
    singleValue: (styles) => ({
      ...styles,
      color: "#333",
    }),
  };

  return (
    <motion.div
      className="filterBar"
      initial={{ x: -100 }}
      transition={{ duration: 0.5 }}
      whileInView={{ x: 0 }}
      viewport={{ once: true }}
    >
      <button onClick={handleClearAll} className="simpleButton submit">
        Reset Filters
      </button>
      <input
        type="text"
        name="search"
        onChange={(e) => handleChange(e.target.name, { value: e.target.value })}
        placeholder="Search cats..."
        // value={searchParams.get("search") || ""}
      />
      <div className="sortOrderButtons">
        <button
          onClick={() => handleSortOrder("asc")}
          className="simpleButton submit"
        >
          Asc
        </button>
        <button
          onClick={() => handleSortOrder("desc")}
          className="simpleButton submit"
        >
          Desc
        </button>
      </div>
      <label>Breed</label>
      <Select
        styles={customStyles}
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
        className="selectControl"
        isClearable={true}
      />
      <label>Age Type</label>
      <Select
        styles={customStyles}
        value={
          ageTypes.find(
            (option) => option.value === searchParams.get("selectedAgeType"),
          ) || null
        }
        name="selectedAgeType"
        onChange={(selectedOption) =>
          handleChange("selectedAgeType", selectedOption)
        }
        options={ageTypes}
        placeholder="Any Age Types"
        className="selectControl"
        isClearable={true}
      />
      <label>Health Problems</label>
      <Select
        styles={customStyles}
        value={
          healthProblems.find(
            (option) =>
              option.value === searchParams.get("selectedHealthProblem"),
          ) || null
        }
        name="selectedHealthProblem"
        onChange={(selectedOption) =>
          handleChange("selectedHealthProblem", selectedOption)
        }
        options={healthProblems}
        placeholder="Any Health Problems"
        className="selectControl"
        isClearable={true}
      />
      <label>Gender</label>
      <Select
        styles={customStyles}
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
        className="selectControl"
        isClearable={true}
      />
      <label>Color</label>
      <Select
        styles={customStyles}
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
        className="selectControl"
        isClearable={true}
      />
      {token && (
        <NavLink className="simpleButton submit" to="/cats/add">
          Give a Cat a Home
        </NavLink>
      )}
    </motion.div>
  );
}

export default FilterBar;
