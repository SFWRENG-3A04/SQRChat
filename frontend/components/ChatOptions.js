import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
// Ensure you have the correct path to your image asset
import chatOptionsIcon from '../assets/chevronUp.png';

const ChatOptions = () => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                <Image source={chatOptionsIcon} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
            {isVisible && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity onPress={() => console.log('Rename Chat')}>
                    <Text style={styles.menuItemText}>Rename Chat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => console.log('Delete Chat')}>
                    <Text style={styles.menuItemText}>Delete Chat</Text>
                  </TouchableOpacity>
              </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    top: 30, // Adjust based on your header's height
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
    borderRadius: 5,
    width: 120, // Set a specific width or use 'auto' if you want it to expand with content
    padding: 10, // Add some padding so the text doesn't stick to the edges
  },
  menuItemText: {
    // Define text styles such as padding, font size, etc
    paddingVertical: 5, // Add some vertical padding for each menu item
    paddingHorizontal: 10, // Add some horizontal padding for each menu item
    fontSize: 16, // Increase font size if necessary
  },
});

export default ChatOptions;