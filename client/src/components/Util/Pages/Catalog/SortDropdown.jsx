import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";

function SortDropdown() {
  let [searchParams, setSearchParams] = useSearchParams();

  const options = [
    { value: "breed", label: "Breed" },
    { value: "age", label: "Age" },
  ];

  let currentSortBy = searchParams.get("sortBy");

  useEffect(() => {
    if (!currentSortBy) {
      searchParams.set("sortBy", "breed");
      setSearchParams(searchParams, { replace: true });
    }
  }, [currentSortBy, searchParams, setSearchParams]);

  const selectedValue =
    options.find((option) => option.value === searchParams.get("sortBy")) ||
    options[0];

  const handleSortChange = (selectedOption) => {
    searchParams.set("sortBy", selectedOption.value);
    setSearchParams(searchParams, { replace: true });
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
    <div className="sortDropdown">
      <Select
        onChange={handleSortChange}
        options={options}
        value={selectedValue}
        classNamePrefix="select"
        styles={customStyles}
      />
    </div>
  );
}

export default SortDropdown;
