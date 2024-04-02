import { chats } from "./data/fakeChats";
import { users } from "./data/fakeUsers";

const getChats = (uid) => {
  // Combine group chats and direct messages into a single array
  const allChats = [...chats.groupChats, ...chats.directMessages];
  
  // Filter the chats to find those that include the specified UID as a participant
  const userChats = allChats.filter(chat => chat.participants.includes(uid));
  
  return userChats;
}

const getUser = (uid) => {
  // Find the user by UID in the users array
  const user = users.find(user => user.uid === uid);

  // Check if a user was found
  if(user) {
    return user;
  } else {
    return null; // Or any other indication that the user was not found
  }
}

export { getChats, getUser };