import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import Messages from "../components/Messages";
import { io } from "socket.io-client";
import { db, ref, auth } from "../services/firebase";
import { update } from "firebase/database";
import { backendEndpoint } from "../common/constants";
import { ChatContext } from "../context/ChatContext";
import { encryptMessage, decryptMessage } from "../services/encryption";


export default function MessageLogsScreen({ route }) {
  const { users } = route.params;
  const { selectedChat } = useContext(ChatContext);
  const currentUserUid = auth.currentUser.uid;

  const [socketInstance, setSocketInstance] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [sessionKey, setSessionKey] = useState(Math.floor(Math.random() * 100) + 1);

  const scrollViewRef = useRef();

  const scrollDown = (time) => {
    const timer = setTimeout(() => {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }, time);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    scrollDown(200);
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      _keyboardDidShow
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const _keyboardDidShow = () => {
    console.log("Keyboard shown");
    // Run any additional code here when the keyboard comes up
    scrollDown(0);
  };

  const handleMessageSend = () => {
    console.log("HERE lol")
    const trimmedMessage = messageText.trim()
    if (trimmedMessage) {
      console.log("HERE lol 2", currentUserUid, trimmedMessage, selectedChat.chatId, sessionKey)
      const socketMessage = {
        senderUid: currentUserUid,
        text: encryptMessage(trimmedMessage, sessionKey),
        chatId: selectedChat.chatId,
      };
      console.log("HERE lol 3")

      socketInstance.emit("sendMessage", socketMessage);
      console.log("HERE", socketMessage)
      const newMessage = {
        senderUid: currentUserUid,
        text: trimmedMessage,
      };

      console.log("THERE", newMessage, selectedChat.messages, selectedChat)

      const updatedChat = {
        ...selectedChat,
        messages: [...(selectedChat.messages || []), newMessage],
        lastUpdated: Date.now(), // Update lastUpdated timestamp
      };
      
      update(ref(db, `chats/${selectedChat.chatId}`), updatedChat);
      setMessageText("");
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    const socket = io(`http://${backendEndpoint}`);

    socket.on("connect", () => {
      console.log("Socket connected");
      const chatid = selectedChat.chatId;
      socket.emit("joinRoom", { "userId": currentUserUid, "room": chatid });
    });

    socket.on("message", (message) => {
      console.log("Received message:", message);
      scrollViewRef.current.scrollToEnd({ animated: true });
    });

    socket.on('sessionKey', (data) => {
      console.log('Received session key:', data.key);
      setSessionKey(data.key);
    });

    setSocketInstance(socket);

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return function cleanup() {
      socket.disconnect();
    };
  }, [selectedChat.chatId]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 135 : 0}
    >
      <ScrollView
        style={styles.messageContainer}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        <Messages
          users={users}
          messages={selectedChat.messages || []}
          currentUserUid={currentUserUid}
        />
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
    flexGrow: 1,
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
