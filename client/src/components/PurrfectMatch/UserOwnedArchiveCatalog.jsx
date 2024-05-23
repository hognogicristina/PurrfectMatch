import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import LoadingSpinner from "../Util/Custom/PageResponse/LoadingSpinner.jsx";
import { useNavigate } from "react-router-dom";

function UserOwnedArchiveCatalog({ username }) {
  const [cats, setCats] = useState([]);
  const { notifyError } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const fetchCats = async () => {
      const response = await fetch(
        `http://localhost:3000/user-profile/${username}/matches-archive`,
      );
      const data = await response.json();

      if (response.ok) {
        setCats(data.data);
      } else {
        data.error.forEach((err) => {
          notifyError(err.message);
        });
      }
    };

    fetchCats();
  }, []);

  const handleCatClick = (id) => {
    navigate(`/cats/cat/${id}`);
  };

  const handleExploreMore = () => {
    navigate(`/cats?selectedUser=${username}&page=1`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="catList">
      <h2>Purrfect Matches Archive</h2>
      <div className="catGrid">
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
      {cats.length > 0 && (
        <button className="submitButton submit" onClick={handleExploreMore}>
          Explore More
        </button>
      )}
    </div>
  );
}

export default UserOwnedArchiveCatalog;
