import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
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
    top: 30, 
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
    borderRadius: 5,
    width: 120, 
    padding: 10,
  },
  menuItemText: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

export default ChatOptions;