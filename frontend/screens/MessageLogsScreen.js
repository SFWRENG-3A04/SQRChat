// Adjustments within MessageLogsScreen component
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Messages from '../components/Messages';
import { sendMessage } from '../mock/functions';

export default function MessageLogsScreen({ route }) {
  const { chatDetails } = route.params;
  const currentUserUid = "1";
  const [messageText, setMessageText] = useState('');

  const handleMessageSend = () => {
    if (messageText.trim()) {
      const newMessage = {
        senderUid: "1", // Assuming "1" is the UID of the current user
        text: messageText.trim()
      };
  
      sendMessage(chatDetails.chatId, newMessage);
      setMessageText('');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === "ios" ? 135 : 0}
    >
      <ScrollView style={styles.messageContainer}>
        <Messages messages={chatDetails.messages} currentUserUid={currentUserUid} />
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
    justifyContent: 'space-between',
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
});