12345!Aa

2024-05-01 12:16:17.878 +00:00

2024-05-06T23:25:04.120Z

The code below has a implementation on the backend for notify clients with Web sockets. What do you have to do is to
complete the useEffect on chat list front end in order for this to re-render the chat sessions list from sidebar of each
user either if it is a sender or a receiver and also to update in real time messages from the chat window of both users
involved in the communication of chat session. you will have to write code only in the // TODO area, do not change my
code at all. i also provided the DTO in order to understand how the data is being rendered

when I select a user from search bar as a result I want to select the chat session with that user id, but if there are
no chats sessions with that one there should be a chat window empty, without messages yet and only the header with user
selected should be displayed until user sends a message and then the chat window is not empty anymore. after selecting a
user from search bar you have to call function fetchMessages, where id is the select user id from search bar