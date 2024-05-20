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
    borderRadius: "10px",
    cursor: "pointer",
    padding: "2px 3px",
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
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "#333",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "#a1a1a1",
  }),
  menu: (styles) => ({
    ...styles,
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  }),
  menuList: (styles) => ({
    ...styles,
    padding: 0,
  }),
  noOptionsMessage: (styles) => ({
    ...styles,
    color: "#d1d1d1",
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
