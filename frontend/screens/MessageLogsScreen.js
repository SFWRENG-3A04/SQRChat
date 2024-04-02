import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getUser } from '../mock/functions'; // Adjust the import path as needed

export default function MessageLogsScreen({ route }) {
  const { chatDetails } = route.params;
  const currentUserUid = "1";

  // Function to get a message sender's name by their UID
  const getSenderName = (uid) => {
    const user = getUser(uid);
    return user ? user.name : 'Unknown';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chatHeader}>{chatDetails.chatId}</Text>
      <ScrollView style={styles.messageContainer}>
        {chatDetails.messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.senderUid === currentUserUid ? styles.rightBubble : styles.leftBubble,
            ]}
          >
            {/* Adding the sender's name above the message */}
            <Text style={styles.senderName}>{getSenderName(message.senderUid)}</Text>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  chatHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  messageContainer: {
    flex: 1,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 4,
    maxWidth: '80%',
  },
  rightBubble: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  leftBubble: {
    backgroundColor: '#e5e5ea',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 2, // Give some space between the sender's name and their message
  },
  messageText: {
    color: 'black',
  },
});
