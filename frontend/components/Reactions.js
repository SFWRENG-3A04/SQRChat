// Reactions.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

const Reactions = ({ onSelect, onUnsend }) => {
  return (
    <View style={styles.container}>
      {reactions.map(reaction => (
        <TouchableOpacity key={reaction} onPress={() => onSelect(reaction)} style={styles.reactionButton}>
          <Text style={styles.reactionText}>{reaction}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={onUnsend} style={styles.unsendButton}>
        <Text style={styles.unsendText}>Unsend</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reactionButton: {
    marginHorizontal: 4,
  },
  reactionText: {
    fontSize: 24,
  },
  unsendButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    backgroundColor: '#dbdbdb', // Changed for a more subtle appearance
  },
  unsendText: {
    color: '#000', // Changed for better readability
    fontSize: 16,
  },
});

export default Reactions;
