import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Chat({ groupChats, onChatSelected }) {
  return (
    <View style={styles.listContainer}>
      {groupChats.map(chat => (
        <TouchableOpacity
          key={chat.id}
          onPress={() => onChatSelected(chat)}
          style={styles.buttonStyle}
        >
          <Text style={styles.textStyle}>{chat.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 20,
  },
  buttonStyle: {
    backgroundColor: '#007bff', // Bootstrap primary button color
    padding: 10,
    marginVertical: 5, // Add some space between the buttons
    borderRadius: 5, // Rounded corners
    alignItems: 'center', // Center the text inside the button
  },
  textStyle: {
    color: '#ffffff', // Text color
    fontSize: 16, // Increase font size for better readability
  },
});
