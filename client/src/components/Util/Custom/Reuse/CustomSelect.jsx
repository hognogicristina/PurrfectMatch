import Select from "react-select";

const customStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#f5f5f5",
    borderColor: "#d1d1d1",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#ff6392",
    },
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    minWidth: "125px",
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? "#ffadd6" : isFocused ? "#E5E5E563" : null,
    color: isSelected ? "white" : "#665967",
    cursor: "pointer",
    ":active": {
      ...styles[":active"],
      backgroundColor: isSelected ? "#ff6392" : "#e5e5e5",
    },
    fontSize: "14px",
    padding: "8px",
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "#333",
    fontSize: "14px",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "#a1a1a1",
  }),
  menu: (styles) => ({
    ...styles,
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
    fontSize: "14px",
  }),
  menuList: (styles) => ({
    ...styles,
    padding: 0,
  }),
  noOptionsMessage: (styles) => ({
    ...styles,
    color: "#d1d1d1",
    fontSize: "14px",
  }),
};

const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder,
  isClearable,
  isOptionDisabled,
  classNamePrefix,
  defaultValue,
}) => {
  return (
    <Select
      styles={customStyles}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isClearable={isClearable}
      isOptionDisabled={isOptionDisabled}
      classNamePrefix={classNamePrefix}
      defaultValue={defaultValue}
    />
  );
};

export default CustomSelect;
