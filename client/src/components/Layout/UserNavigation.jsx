import { NavLink } from "react-router-dom";
import { useMatch } from "react-router-dom";
import { useUserDetails } from "../../util/useUserDetails.js";

export default function UserNavigation() {
  const match = useMatch("/user/*");
  const { userDetails } = useUserDetails();

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
        {userDetails.role === "user" && match && (
          <div className="linksNavibar">
            <NavLink
              to="/user/matches-archive"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Purrfect Matches Archive
            </NavLink>
            <NavLink
              to="/user/felines-records"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Rehomed Felines Records
            </NavLink>
          </div>
        )}
      </div>
      <div className="userDetailContainer">
        {userDetails.role === "admin" && (
          <div className="linksNavibar">
            <NavLink
              to="/users"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Archive of all users
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}
