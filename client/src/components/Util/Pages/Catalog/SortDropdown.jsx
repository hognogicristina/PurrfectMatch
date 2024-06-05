import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import CustomSelect from "../../Custom/Reuse/CustomSelect.jsx";
import { getAuthToken } from "../../../../util/auth.js";

function SortDropdown() {
  let [searchParams, setSearchParams] = useSearchParams();
  const token = getAuthToken();
  const options = useMemo(() => {
    return [
      { value: "breed", label: "Breed" },
      { value: "age", label: "Age" },
      { value: "createdAt", label: "Recently Added" },
    ];
  }, [token]);
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

  return (
    <div className="sortDropdown">
      <CustomSelect
        onChange={handleSortChange}
        options={options}
        value={selectedValue}
        classNamePrefix="select"
      />
    </div>
  );
}

export default SortDropdown;
