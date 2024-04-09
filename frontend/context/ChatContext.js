import React, { createContext, useState, useEffect } from "react";
import { db, auth, ref } from "../services/firebase";
import { onValue } from "firebase/database";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [groupChats, setGroupChats] = useState([]);
  const [dms, setDms] = useState([]);
  const [selectedChat, setSelectedChat] = useState({});

  const currentUserUid = auth.currentUser.uid;

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "chats/"), (snapshot) => {
      // console.log("kms")
      if (snapshot.exists()) {
        let chatsData = snapshot.val();
        const groupChatsArray = [];
        const dmsArray = [];

        for (const chatId in chatsData) {
          const chat = chatsData[chatId];
          const participants = chat.participants;
          // Check if current user is a participant in this chat
          if (participants && participants.includes(currentUserUid)) {
            // Check if it's a group chat or direct message
            if (participants.length > 2) {
              groupChatsArray.push(chat);
            } else {
              dmsArray.push(chat);
            }
          }
        }
        // console.log("here in chats onValue", selectedChat, selectedChat.chatId)
        setGroupChats(groupChatsArray);
        setDms(dmsArray);

        if (chatsData[selectedChat.chatId].messages === 'undefined') chatsData[selectedChat.chatId].messages = []
        // Check if selectedChat exists and if its chatId matches any in the updated data
        // console.log("here in chats onValue", selectedChat, selectedChat.chatId, chatsData)
        if (
          selectedChat &&
          selectedChat.chatId &&
          chatsData[selectedChat.chatId] &&
          JSON.stringify(selectedChat) !==
            JSON.stringify(chatsData[selectedChat.chatId]) // Compare current selectedChat with the one in snapshot
        ) {
          console.log(
            "Setting New Selected Data",
            chatsData[selectedChat.chatId]
          );
          setSelectedChat(chatsData[selectedChat.chatId]);
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, [selectedChat]);

  return (
    <ChatContext.Provider
      value={{ dms, groupChats, selectedChat, setSelectedChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};
