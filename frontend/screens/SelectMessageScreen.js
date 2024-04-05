import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Chat from "../components/Chat";
import { auth, db, ref } from "../services/firebase";
import { onValue } from "firebase/database";

export default function SelectMessageScreen({ navigation, route, users }) {
  const [groupChats, setGroupChats] = useState([]);
  const [dms, setDms] = useState([]);

  const currentUserUid = auth.currentUser.uid;

  useEffect(() => {
    onValue(ref(db, "chats/"), (snapshot) => {
      if (snapshot.exists()) {
        chats = snapshot.val();
        const groupChatsArray = [];
        const dmsArray = [];

        for (const chatId in chats) {
          const chat = chats[chatId];
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

        setGroupChats(groupChatsArray);
        setDms(dmsArray);
      }
    });
  }, []);

  const handleChatSelected = (chat) => {
    navigation.navigate("MessageLogs", { chatDetails: chat });
  };

  return (
    <View style={styles.container}>
      <Text>Select Message</Text>
      <Chat
        users={users}
        groupChats={groupChats}
        onChatSelected={handleChatSelected}
      />
      <Chat
        users={users}
        groupChats={dms}
        onChatSelected={handleChatSelected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
