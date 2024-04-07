
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
  Keyboard,Image
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import Messages from "../components/Messages";
import RenameChat from "../components/RenameChat";
import { io } from "socket.io-client";
import { db, ref, auth } from "../services/firebase";
import { getDatabase,  remove } from "firebase/database";
import { update } from "firebase/database";
import { backendEndpoint } from "../common/constants";
import Send from'../assets/Send.png';
import { ChatContext } from "../context/ChatContext";

export default function MessageLogsScreen({ route }) {
  const navigation = useNavigation();
  const { chatDetails, users } = route.params;
    const { users } = route.params;
  const { selectedChat } = useContext(ChatContext);
  

  const currentUserUid = auth.currentUser.uid;

  const [socketInstance, setSocketInstance] = useState(null);
  const [messageText, setMessageText] = useState("");

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

    console.log('Keyboard shown');

    scrollDown(0)

  };

  const handleMessageSend = () => {
    if (messageText.trim()) {
      const socketMessage = {
        senderUid: currentUserUid,
        text: messageText.trim(),
        chatId: selectedChat.chatId,
      };

      socketInstance.emit("sendMessage", socketMessage);

      const newMessage = {
        senderUid: currentUserUid,
        text: messageText.trim(),
      };

      const updatedChat = {

        ...(chatDetails || []),
        messages: chatDetails && Array.isArray(chatDetails.messages) ? [...chatDetails.messages, newMessage] : [newMessage],
        lastUpdated: Date.now(),

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
      socket.emit("joinRoom", selectedChat.chatId);
    });

    socket.on("message", (message) => {
      console.log("Received message:", message);
      scrollViewRef.current.scrollToEnd({ animated: true });
    });

    setSocketInstance(socket);

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return function cleanup() {
      socket.disconnect();
    };
  }, [selectedChat.chatId]);

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
  const chatId = chatDetails.chatId;
 
  const chatRef = ref(db, `chats/${chatId}`);

  remove(chatRef)
     .then(() => {
       console.log('Chat deleted successfully');
       navigation.goBack();

     })
     .catch((error) => {
       console.error('Error deleting chat:', error);
     });
 };

 const handleRenameChat = (newChatName) => {
  const db = getDatabase();
  const chatId = chatDetails.chatId;

  const chatRef = ref(db, `chats/${chatId}`);

  update(chatRef, { displayName: newChatName })
     .then(() => {
       console.log('Chat renamed successfully');
      
     })
     .catch((error) => {
       console.error('Error renaming chat:', error);
     });
     console.log('New chat name:', newChatName);
    setIsModalVisible(false); 
 };
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
        <Image source={Send} style={styles.Send}/>
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
    borderWidth: 2,
    borderColor: "#6FBAFF",
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  sendButton: {
    justifyContent: "center",
  
  },
  sendButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  optionsButton: {
    backgroundColor: '#6FBAFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
 },
 optionsButtonText: {
    color: '#fff',
    fontSize: 16,
 },
 dropdownOptions: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems:'center',
 },
 OptionText: {

    fontSize: 16,
    marginBottom: 10,
    color:'#4D4D4D'
 },
 Send: {

height:40,
width:40
},
 
});
