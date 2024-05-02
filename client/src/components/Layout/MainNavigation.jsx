import { NavLink } from "react-router-dom";
import styles from "./MainNavigation.module.css";

function MainNavigation() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <NavLink to="/" className={styles.active}>
          purrfectMatch
        </NavLink>
      </div>
      <div className={styles.loginLink}>
        <NavLink to="/login" className={styles.active}>
          Log In
        </NavLink>
      </div>
    </header>
  );
}

export default MainNavigation;
