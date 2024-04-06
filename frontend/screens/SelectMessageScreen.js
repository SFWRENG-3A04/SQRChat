import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import Chat from "../components/Chat";
import { ChatContext } from "../context/ChatContext";

export default function SelectMessageScreen({ navigation, users }) {
  const { dms, groupChats, setSelectedChat } = useContext(ChatContext);

  const handleChatSelected = (chat) => {
    setSelectedChat(chat);
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
