import { NavLink } from "react-router-dom";
import "./CatNavigation.css";

export default function CatNavigation() {
  return (
    <nav className="catsDropdown">
      <NavLink to={"/cats"}>All Cats</NavLink>
      <NavLink to={"/cat"}>Add Cat</NavLink>
      <NavLink to={"/user/cats-owned"}>Cats Adopted</NavLink>
      <NavLink to={"/user/cats-sent-to-adoption"}>
        Cats Sent to Adoption
      </NavLink>
    </nav>
  );
}
