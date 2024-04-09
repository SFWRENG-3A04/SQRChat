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
import RenameChat from "../components/RenameChat";
import { backendEndpoint } from "../common/constants";
import { ChatContext } from "../context/ChatContext";
import { getDatabase, remove } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { encryptMessage, decryptMessage } from "../services/encryption";

export default function MessageLogsScreen({ route }) {
  const { users } = route.params;
  const navigation = useNavigation();
  const { selectedChat } = useContext(ChatContext);
  const currentUserUid = auth.currentUser.uid;

  const [messages, setMessages] = useState([]);

  const [socketInstance, setSocketInstance] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [sessionKey, setSessionKey] = useState(
    Math.floor(Math.random() * 100) + 1
  );

  const scrollViewRef = useRef();

  const scrollDown = (time) => {
    const timer = setTimeout(() => {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }, time);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    // setMessages(selectedChat.messages);
    scrollDown(200);
  }, []);

  useEffect(() => {
    const chatTitle = selectedChat.displayName || "Private Chat";
    navigation.setOptions({
      title: chatTitle,
    });
  }, [selectedChat, navigation]);

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
    scrollDown(0);
  };

  const handleMessageSend = () => {
    const trimmedMessage = messageText.trim();
    if (trimmedMessage) {
      const socketMessage = {
        senderUid: currentUserUid,
        text: encryptMessage(trimmedMessage, sessionKey),
        chatId: selectedChat.chatId,
        type: "textMessage",
      };

      socketInstance.emit("sendMessage", socketMessage);

      const newMessage = {
        senderUid: currentUserUid,
        text: trimmedMessage,
      };

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

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  const handleOptionSelect = (option) => {
    console.log(`Selected option: ${option}`);

    setDropdownVisible(false);
  };

  const handleDeleteChat = () => {
    const db = getDatabase();
    const chatId = selectedChat.chatId;

    const chatRef = ref(db, `chats/${chatId}`);

    remove(chatRef)
      .then(() => {
        console.log("Chat deleted successfully");
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Error deleting chat:", error);
      });
  };

  const handleRenameChat = (newChatName) => {
    const db = getDatabase();
    const chatId = selectedChat.chatId;

    const chatRef = ref(db, `chats/${chatId}`);

    update(chatRef, { displayName: newChatName })
      .then(() => {
        console.log("Chat renamed successfully");
      })
      .catch((error) => {
        console.error("Error renaming chat:", error);
      });
    console.log("New chat name:", newChatName);
    setIsModalVisible(false);
  };

  useEffect(() => {
    const socket = io(`http://${backendEndpoint}`);

    socket.on("connect", () => {
      console.log("Socket connected");
      const chatid = selectedChat.chatId;
      socket.emit("joinRoom", { userId: currentUserUid, room: chatid });
    });

    socket.on("message", (message) => {
      console.log("Received message:", message, message.text, sessionKey);
      if (message.type === "textMessage") {
        syncedMessage = {
          senderUid: message.senderUid,
          text: decryptMessage(message.text, sessionKey),
        };
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            senderUid: message.senderUid,
            text: decryptMessage(message.text, sessionKey),
          },
        ]);
        scrollViewRef.current.scrollToEnd({ animated: true });
      } else if (message.type === "unsendMessage") {
        const indexToRemove = message.selectedMessageIndex;
        setMessages((prevMessages) =>
          prevMessages.filter((_, index) => index !== indexToRemove)
        );
      } else if (message.type === "reactToMessage") {
        const selectedMessageIndex = message.selectedMessageIndex;
        const reaction = message.reaction;

        const updatedReactions =
          messages[selectedMessageIndex]?.reactions || {};

        if (
          updatedReactions[reaction] &&
          updatedReactions[reaction].includes(currentUserUid)
        ) {
          updatedReactions[reaction] = updatedReactions[reaction].filter(
            (uid) => uid !== currentUserUid
          );
          if (updatedReactions[reaction].length === 0) {
            delete updatedReactions[reaction];
          }
        } else if (updatedReactions[reaction]) {
          updatedReactions[reaction].push(currentUserUid);
        } else {
          updatedReactions[reaction] = [currentUserUid];
        }

        setMessages((prevMessages) =>
          prevMessages.map((msg, index) => {
            if (index === selectedMessageIndex) {
              const existingReactions = msg.reactions || {}; // Existing reactions of the selected message
              const mergedReactions = {
                ...existingReactions, // Copy existing reactions
                ...updatedReactions, // Merge with updated reactions
              };
              return {
                ...msg,
                reactions: mergedReactions || {}, // Set reactions to the merged reactions
              };
            }
            return msg;
          })
        );
      } else {
        console.log("Not a message type");
      }
    });

    socket.on("sessionKey", (data) => {
      console.log("Received session key:", data.key);
      setSessionKey(data.key);
    });

    setSocketInstance(socket);

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return function cleanup() {
      socket.disconnect();
    };
  }, [selectedChat.chatId, sessionKey]);

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
          messages={selectedChat.messages}
          currentUserUid={currentUserUid}
          socket={socketInstance}
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

      <TouchableOpacity style={styles.optionsButton} onPress={toggleDropdown}>
        <Text style={styles.optionsButtonText}>Options</Text>
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdownOptions}>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Text style={styles.OptionText}>Rename Chat</Text>
          </TouchableOpacity>
          <RenameChat
            isVisible={isModalVisible}
            onSubmit={handleRenameChat}
            onCancel={() => setIsModalVisible(false)}
          />
          <TouchableOpacity onPress={handleDeleteChat}>
            <Text style={styles.OptionText}>Delete Chat</Text>
          </TouchableOpacity>
        </View>
      )}
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

  optionsButton: {
    backgroundColor: "#6FBAFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 0,
  },
  optionsButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  dropdownOptions: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },
  OptionText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#4D4D4D",
  },
});
