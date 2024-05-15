import { NavLink } from "react-router-dom";
import { useMatch } from "react-router-dom";

export default function UserNavBar() {
  const match = useMatch("/user/*");

  return (
    <div className="userNavBar">
      <div className="userDetailContainer">
        {match && (
          <div className="linksNavibar">
            <NavLink
              to="/user"
              className={({ isActive }) =>
                isActive ||
                match.pathname.startsWith("/user/edit") ||
                match.pathname.startsWith("/user/delete")
                  ? "active"
                  : undefined
              }
              end
            >
              My profile
            </NavLink>
            <NavLink
              to="/user/username"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Change username
            </NavLink>
            <NavLink
              to="/user/address"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Modify address
            </NavLink>
            <NavLink
              to="/user/password"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Change password
            </NavLink>
            <NavLink
              to="/logout"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Logout
            </NavLink>
          </div>
        )}
      </div>
      <div className="userDetailContainer">
        {match && (
          <div className="linksNavibar">
            <NavLink
              to="/user/cats-owned"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Purrfect Matches Archive
            </NavLink>
            <NavLink
              to="/user/cats-sent-to-adoption"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Rehomed Felines Records
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}
