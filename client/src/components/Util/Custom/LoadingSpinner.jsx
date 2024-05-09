import { Oval } from "react-loader-spinner";
import "./LoadingSpinner.css";

function LoadingSpinner() {
  return (
    <div className="spinnerContainer">
      <Oval
        height={50}
        width={50}
        color="#FF69B4"
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#FFB6C1"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
      <h1 className="loadingTextTitle">Just a moment,</h1>
      <p className="loadingText">we're getting everything ready for you...</p>
    </div>
  );
}

export default LoadingSpinner;
