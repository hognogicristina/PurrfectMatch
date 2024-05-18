function NoResultMessage({ message }) {
  return (
    <div className="errorContainerCats">
      {message.map((msg, index) => (
        <div key={index} className="errorMessageCats">
          {msg}
        </div>
      ))}
    </div>
  );
}

export default NoResultMessage;
