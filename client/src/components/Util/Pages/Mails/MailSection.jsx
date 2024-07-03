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
  read,
  isSent,
}) {
  const handleExpandClick = () => {
    if (mails.length > 0) {
      setIsExpanded(!isExpanded);
      if (isExpanded) {
        setItemsToShow(1);
      }
    }
  };

  const sectionVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: "auto", opacity: 1 },
  };

  const buttonVariants = {
    tapped: { scale: 0.9 },
    normal: { scale: 1 },
  };

  return (
    <div className={`mailSection ${selectedMailId && "maxWidthMailSection"}`}>
      <div className="sectionHeader">
        <h2>{title}</h2>
        <motion.button
          whileTap="tapped"
          animate="normal"
          variants={buttonVariants}
          className="expandButton"
          onClick={handleExpandClick}
        >
          {isExpanded ? <BiCollapseVertical /> : <BiExpandVertical />}
        </motion.button>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={sectionVariants}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {mails.length > 0 ? (
              <ul>
                <AnimatePresence>
                  {mails.slice(0, itemsToShow).map((mail) => (
                    <MailItem
                      key={mail.id}
                      mail={mail}
                      isSelected={selectedMailId === mail.id}
                      openMail={openMail}
                      setMailDetails={setMailDetails}
                      read={read}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MailSection;
