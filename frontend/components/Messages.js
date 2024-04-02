import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getUser } from '../mock/functions';

export default function Messages({ messages, currentUserUid }) {
  const getSenderName = (uid) => {
    const user = getUser(uid);
    return user ? user.name : 'Unknown';
  };

  return (
    <View style={styles.container}>
      {messages.map((message, index) => (
        <View
          key={index}
          style={[
            styles.messageBubble,
            message.senderUid === currentUserUid ? styles.rightBubble : styles.leftBubble,
          ]}
        >
          <Text style={styles.senderName}>{getSenderName(message.senderUid)}</Text>
          <Text style={styles.messageText}>{message.text}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 2,
  },
  messageText: {
    color: 'black',
  },
});
