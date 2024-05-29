import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";
import "../../styles/PurrfectMatch/CatsArchive.css";
import NoResultMessage from "../Util/Custom/PageResponse/NoResultMessage.jsx";
import Pagination from "../Util/Custom/Reuse/Pagination.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../util/auth.js";
import { IoTrashBin } from "react-icons/io5";
import ConfirmDialog from "../Util/Custom/Reuse/ConfirmDialog.jsx";

export default function UsersArchive({ users, currentPage, onPageChange }) {
  const { data, error, totalPages, totalItems } = users;
  const { notifyError, notifySuccess } = useToast();
  const navigate = useNavigate();
  const [searchParamsKey, setSearchParamsKey] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    setSearchParamsKey((prevKey) => prevKey + 1);
  }, [currentPage, users]);

  const handleUserClick = (username) => {
    navigate(`/user-profile/${username}`);
  };

  const handleDeleteAccount = async (id) => {
    const token = getAuthToken();
    const response = await fetch(`http://localhost:3000/user/${id}/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      notifySuccess(data.status);
    } else {
      data.error.forEach((err) => {
        notifyError(err.message);
      });
    }
  };

  const handleTrashClick = (userId) => {
    setUserIdToDelete(userId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteAccount(userIdToDelete);
    setShowConfirmDialog(false);
  };

  const renderUsers = () => {
    if (users && Array.isArray(data) && data.length > 0) {
      return data.map((user, index) => (
        <motion.li
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
            transition: { duration: 0.3, delay: index * 0.01 },
          }}
          viewport={{ once: true }}
          key={`${user.id}-${searchParamsKey}-${index}`}
          className="catListItem"
          onClick={() => handleUserClick(user.username)}
        >
          <motion.div
            className="trashIcon user"
            initial={{ scale: 1 }}
            whileTap={{ scale: 1.3, rotate: 180 }}
            onClick={(e) => {
              e.stopPropagation();
              handleTrashClick(user.id);
            }}
          >
            <IoTrashBin />
          </motion.div>
          <div className="userDetails">
            <img src={user.image} alt={user.username} />
            <div className="userDetailsText">
              <h2>{user.displayName}</h2>
              <p>{user.email}</p>
              <p>{user.address}</p>
            </div>
          </div>
        </motion.li>
      ));
    } else if (users && error) {
      if (error.some((err) => err.field === "users")) {
        const errorMessage = error.map((err, index) => (
          <p key={index} className="errorMessageusers">
            {err.message}
          </p>
        ));
        return (
          <div className="noResultContainer">
            <NoResultMessage message={errorMessage} />
          </div>
        );
      } else {
        error.forEach((err) => {
          notifyError(err.message);
        });
      }
    }
  };

  return (
    <div className="userListContainer">
      <motion.div
        className="userContentList"
        initial={{ y: 20, scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 330,
          damping: 12,
          duration: 0.8,
        }}
      >
        <div className="userCountContainer">
          <div className="titleUserContainer">
            <h1>Users Archive</h1>
            {error ? (
              <span>Currently there are no users registered</span>
            ) : (
              users &&
              totalItems !== 0 && (
                <span>
                  Currently there are {totalItems} user{totalItems > 1 && "s"}
                </span>
              )
            )}
          </div>
          <Pagination
            displayPages="true"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
        <ul className="catsList user">{renderUsers()}</ul>
      </motion.div>
      {showConfirmDialog && (
        <ConfirmDialog
          title="Confirm Delete"
          message="Are you sure you want to delete this user?"
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
