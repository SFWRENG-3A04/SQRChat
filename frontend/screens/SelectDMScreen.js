import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Chat from '../components/Chat';

export default function SelectDMScreen({ navigation }) {
  const [groupChats, setGroupChats] = useState([]);
  const [dms, setDms] = useState([]);

  useEffect(() => {
    setGroupChats([
      { id: 1, name: "Group Chat 1" },
      { id: 2, name: "Group Chat 2" },
      { id: 3, name: "Group Chat 3" },
    ]);
    setDms([
      { id: 4, name: "DM Chat 1" },
      { id: 5, name: "DM Chat 2" },
      { id: 6, name: "DM Chat 3" },
    ]);
  }, []);

  const handleChatSelected = (chat) => {
    navigation.navigate('DM', { chatDetails: chat });
  };

  return (
    <View style={styles.container}>
      <Text>Select DMs</Text>
      <Chat groupChats={groupChats} onChatSelected={handleChatSelected} />
      <Chat groupChats={dms} onChatSelected={handleChatSelected} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
