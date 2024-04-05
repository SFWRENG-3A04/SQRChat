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
import Messages from '../components/Messages';
import { sendMessage,getUser } from '../mock/functions';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import Icon from 'react-native-vector-icons/MaterialIcons';
import { io } from "socket.io-client";
import { db, ref, auth } from "../services/firebase";
import { update } from "firebase/database";
import { backendEndpoint } from "../common/constants";

export default function ChatScreen({route}) {
  const navigation = useNavigation(); // Get the navigation object

  if (!route || !route.params) {
      return (
          <View style={styles.defaultScreen}>
              <Text style={styles.defaultScreenText}>No chat details available. Please select a chat first</Text>
          </View>
      );
  }

  const { chatDetails,users } = route.params;
  const currentUserUid = auth.currentUser.uid;
  const [socketInstance, setSocketInstance] = useState(null);
  const [messages, setMessages] = useState(chatDetails.messages);
  const [messageText, setMessageText] = useState("");


  const getParticipantNames = (participants) => {
    // Filter out the participant with ID 1
    const filteredParticipants = participants.filter(uid => uid != auth.currentUser.uid);
  
  
  
    return filteredParticipants.map(uid => {
  
      const user = users.find((user) => user.uid === uid);
      return user && user.displayName ? user.displayName : "Unknown";
    })
    .join(", ");
   };
   const handleMessageSend = () => {
    if (messageText.trim()) {
      const socketMessage = {
        senderUid: currentUserUid,
        text: messageText.trim(),
        chatId: chatDetails.chatId,
      };

      socketInstance.emit("sendMessage", socketMessage);

      const newMessage = {
        senderUid: currentUserUid,
        text: messageText.trim(),
      };

      const updatedChat = {
        ...chatDetails,
        messages: [...chatDetails.messages, newMessage],
        lastUpdated: Date.now(), // Update lastUpdated timestamp
      };

      update(ref(db, `chats/${chatDetails.chatId}`), updatedChat);
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === "ios" ? 135 : 0}
      >
          <View style={styles.container}>
              <View style={styles.headerContainer}>
                  <TouchableOpacity
                      style={styles.backButtonStyle}
                      onPress={() => navigation.goBack()} // Navigate back when pressed
                  >
                      <Icon name="chevron-left" size={26} color="black" />
                  </TouchableOpacity>
                  {participants.length === 2 ? (
                      <Text style={styles.participantsStyle}>{getParticipantNames(chatDetails.participants)}</Text>
                  ) : (
                      <Text style={styles.chatNameStyle}>{chatDetails.displayName || "Chat Name"}</Text>
                  )}
              </View>
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
          </View>
      </KeyboardAvoidingView>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      height:200,
      
    },
    messageContainer: {
      // might need flex here
      
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 10,
      borderTopWidth: 1,
      borderColor: '#ccc',
      backgroundColor: '#fff',
    },
    input: {
      flex: 1,
      marginRight: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 20,
      padding: 10,
      fontSize: 16,
      backgroundColor: '#f9f9f9',
    },
    sendButton: {
      justifyContent: 'center',
      padding: 10,
      backgroundColor: '#007bff',
      borderRadius: 20,
    },
    sendButtonText: {
      color: '#ffffff',
      fontSize: 16,
    },
     backButtonStyle: {

    padding: 10,
    alignSelf: 'flex-start', // Align to the left
 },
 backButtonTextStyle: {
    fontSize: 18,
    color: 'black',
 },
 headerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  borderBottomWidth: 1,
  borderColor: '#ccc',
},
chatNameStyle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginLeft: 10, // Add some space between the back button and the chat name
},
participantsStyle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginLeft: 10, // Add some space between the back button and the chat name
},
  });