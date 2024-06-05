import { getAuthToken } from "../../util/auth.js";
import { Await, defer, useLoaderData } from "react-router-dom";
import LoadingSpinner from "../../components/Util/Custom/PageResponse/LoadingSpinner.jsx";
import { Suspense } from "react";
import ChatsList from "../../components/Chat/ChatList.jsx";

function ChatsPage() {
  const { chats } = useLoaderData();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={chats}>
        {(loadedChats) => <ChatsList chats={loadedChats} />}
      </Await>
    </Suspense>
  );
}

export default ChatsPage;

export async function loadChats() {
  const token = getAuthToken();
  const response = await fetch(`http://localhost:3000/inbox`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

export function loader() {
  return defer({
    chats: loadChats(),
  });
}
