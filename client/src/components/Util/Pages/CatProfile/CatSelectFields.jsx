import { useEffect, useState } from "react";
import { useToast } from "../../Custom/PageResponse/ToastProvider.jsx";
import ErrorMessage from "../../Custom/Reuse/ErrorMessage.jsx";
import CustomSelect from "../../Custom/Reuse/CustomSelect.jsx";

export default function CatSelectFields({
  errors,
  selectedBreed,
  selectedGender,
  selectedColor,
  handleBreedChange,
  handleGenderChange,
  handleColorChange,
  defaultBreed,
  defaultGender,
  defaultColor,
}) {
  const { notifyError } = useToast();
  const [breeds, setBreeds] = useState([]);
  const [colors, setColors] = useState([]);
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
        data.error.forEach((error) => {
          notifyError(error.message);
        });
        return null;
      }
    }

    async function fetchColors() {
      const response = await fetch("http://localhost:3000/colors");
      const data = await response.json();
      if (response.ok) {
        setColors(data.data.map((color) => ({ value: color, label: color })));
      } else {
        data.error.forEach((error) => {
          notifyError(error.message);
        });
        return null;
      }
    }

    fetchColors();
    fetchBreeds();
  }, []);

  return (
    <>
      <label>
        Breed
        <label className="selectAddCat">
          <CustomSelect
            name="breed"
            options={breeds}
            placeholder="Select a breed"
            className="selectControl"
            isClearable={true}
            onChange={handleBreedChange}
            defaultValue={
              defaultBreed ? { value: defaultBreed, label: defaultBreed } : null
            }
          />
          {errors.breed && <ErrorMessage message={errors.breed} />}
        </label>
        <input
          type="hidden"
          name="breed"
          value={selectedBreed || defaultBreed || ""}
        />
      </label>
      <label>
        Gender
        <label className="selectAddCat">
          <CustomSelect
            name="gender"
            options={genders}
            placeholder="Select a Gender"
            className="selectControl"
            isClearable={true}
            onChange={handleGenderChange}
            defaultValue={
              defaultGender
                ? { value: defaultGender, label: defaultGender }
                : null
            }
          />
          {errors.gender && <ErrorMessage message={errors.gender} />}
        </label>
        <input
          type="hidden"
          name="gender"
          value={selectedGender || defaultGender || ""}
        />
      </label>
      <label>
        Color
        <label className="selectAddCat">
          <CustomSelect
            name="color"
            options={colors}
            placeholder="Select a color"
            className="selectControl"
            isClearable={true}
            onChange={handleColorChange}
            defaultValue={
              defaultColor ? { value: defaultColor, label: defaultColor } : null
            }
          />
          {errors.color && <ErrorMessage message={errors.color} />}
        </label>
        <input
          type="hidden"
          name="color"
          value={selectedColor || defaultColor || ""}
        />
      </label>
    </>
  );
}
