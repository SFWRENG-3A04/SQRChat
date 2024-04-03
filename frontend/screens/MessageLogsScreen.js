// Adjustments within MessageLogsScreen component
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Messages from "../components/Messages";
import Constants from "expo-constants";
import { io } from "socket.io-client";

export default function MessageLogsScreen({ route }) {
  const { chatDetails } = route.params;
  const currentUserUid = "1";
  const [socketInstance, setSocketInstance] = useState(null);
  const [messages, setMessages] = useState(chatDetails.messages);
  const [messageText, setMessageText] = useState("");
  const backendEndpoint = Constants.expoConfig.extra.backendEndpoint;

  const handleMessageSend = () => {
    if (messageText.trim()) {
      const newMessage = {
        senderUid: "1", // Assuming "1" is the UID of the current user
        text: messageText.trim(),
        chatId: chatDetails.chatId,
      };

      socketInstance.emit("sendMessage", newMessage);
      setMessageText("");
    }
  };

  useEffect(() => {
    const socket = io(`http://${backendEndpoint}`);

    socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("joinRoom", chatDetails.chatId);
    });

    socket.on("message", (message) => {
      console.log("Received message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    setSocketInstance(socket);

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return function cleanup() {
      socket.disconnect();
    };
  }, [chatDetails.chatId]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 135 : 0}
    >
      <ScrollView style={styles.messageContainer}>
        <Messages messages={messages} currentUserUid={currentUserUid} />
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          style={styles.input}
        />
        <TouchableOpacity onPress={handleMessageSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  messageContainer: {
    // might need flex here
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  sendButton: {
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
