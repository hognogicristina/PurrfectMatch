import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { useNavigate } from "react-router-dom";

function UserOwnedArchiveCatalog({ username }) {
  const [cats, setCats] = useState([]);
  const [error, setError] = useState({});
  const { notifyError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      const response = await fetch(
        `http://localhost:3000/user-profile/${username}/matches-archive`,
      );
      const data = await response.json();

      if (response.ok) {
        setCats(data.data);
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

  return (
    <div className="catList">
      <h2>Purrfect Matches Archive</h2>
      {error && error.cats ? (
        <div className="errorMessageCats">{error.cats}</div>
      ) : (
        <div className="catRow">
          {cats.map((cat) => (
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
      )}
    </div>
  );
}

export default UserOwnedArchiveCatalog;
