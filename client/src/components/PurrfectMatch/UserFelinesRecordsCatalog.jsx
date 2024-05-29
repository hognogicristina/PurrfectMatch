import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { useNavigate } from "react-router-dom";

function UserFelinesRecordsCatalog({ username }) {
  const [cats, setCats] = useState([]);
  const [error, setError] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const { notifyError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      const response = await fetch(
        `http://localhost:3000/user-profile/${username}/felines-records`,
      );
      const data = await response.json();

      if (response.ok) {
        setCats(data.data);
        setTotalItems(data.totalItems);
      } else {
        const newError = {};
        data.error.forEach((err) => {
          if (err.field === "server") {
            notifyError(err.message);
          }
          newError[err.field] = err.message;
        });
        setError(newError);
      }
    };

    fetchCats();
  }, [username, notifyError]);

  const handleCatClick = (id) => {
    navigate(`/cats/cat/${id}`);
  };

  const handleExploreMore = () => {
    navigate(`/cats?selectedUser=${username}&page=1`);
  };

  return (
    <div className="catList">
      <h2>Rehomed Felines Records</h2>
      {error && error.cats ? (
        <div className="errorMessageCats">{error.cats}</div>
      ) : (
        <>
          <div className="catGrid">
            {cats.slice(0, 4).map((cat) => (
              <div
                key={cat.id}
                className="catItemList"
                onClick={() => handleCatClick(cat.id)}
                style={{ backgroundImage: `url(${cat.image})` }}
              >
                <div className="catDetails">
                  <h2>{cat.name}</h2>
                </div>
              </div>
            ))}
          </div>
          {cats.length > 0 && (
            <button
              className={`submitButton submit ${totalItems <= 4 ? "disabled" : ""}`}
              onClick={handleExploreMore}
              disabled={totalItems <= 4}
            >
              Explore More
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default UserFelinesRecordsCatalog;
