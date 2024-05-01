import React from "react";
import styles from "./ErrorBox.module.css";

const ErrorBox = ({ message }) => {
  if (!message) return null;
  return <div className={styles.errorBox}>{message}</div>;
};

export default ErrorBox;
