import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getUser } from '../mock/functions';

const Chat = ({ groupChats, onChatSelected }) => {
  // Function to get user names from their UIDs
  const getUserNames = (participants) => {
    return participants.map(uid => {
      const user = getUser(uid);
      return user ? user.displayName : 'Unknown';
    }).join(', ');
  };

  return (
    <View style={styles.listContainer}>
      {groupChats.map(chat => (
        <TouchableOpacity
          key={chat.chatId}
          onPress={() => onChatSelected(chat)}
          style={styles.buttonStyle}
        >
          <Text style={styles.chatNameStyle}>{chat.displayName || "Chat"}</Text>
          <Text style={styles.participantsStyle}>
            {getUserNames(chat.participants)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 20,
  },
  buttonStyle: {
    backgroundColor: '#007bff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  chatNameStyle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  participantsStyle: {
    color: '#dddddd',
    fontSize: 14,
  },
});

export default Chat;
