import { motion, AnimatePresence } from "framer-motion";
import { BiCollapseVertical, BiExpandVertical } from "react-icons/bi";
import MailItem from "./MailItem.jsx";

function MailSection({
  title,
  mails,
  selectedMailId,
  openMail,
  itemsToShow,
  setItemsToShow,
  isExpanded,
  setIsExpanded,
  setMailDetails,
  isSent,
}) {
  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setItemsToShow(1);
    }
  };

  return (
    <div className={`mailSection ${selectedMailId && "maxWidthMailSection"}`}>
      <div className="sectionHeader">
        <h2>{title}</h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="expandButton"
          onClick={handleExpandClick}
        >
          {isExpanded ? <BiCollapseVertical /> : <BiExpandVertical />}
        </motion.button>
      </div>
      {isExpanded && (
        <>
          {mails.length > 0 ? (
            <ul>
              <AnimatePresence>
                {mails.slice(0, itemsToShow).map((mail, index) => (
                  <MailItem
                    key={mail.id}
                    mail={mail}
                    isSelected={selectedMailId === mail.id}
                    openMail={openMail}
                    setMailDetails={setMailDetails}
                    isSent={isSent}
                  />
                ))}
              </AnimatePresence>
            </ul>
          ) : (
            <p className="errorMessageCats">{mails.message}</p>
          )}
          {mails.length > itemsToShow && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="mailButton"
              onClick={() => setItemsToShow(itemsToShow + 3)}
            >
              Explore more
            </motion.button>
          )}
        </>
      )}
    </div>
  );
}

export default MailSection;
