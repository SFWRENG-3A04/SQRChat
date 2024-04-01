import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import Chat from '../components/Chat';

export default function SelectDMScreen({route, navigation}) {
  // const { groupChats, setGroupChats, dms, setDms } = route.params;
  const [groupChats, setGroupChats] = useState([])
  const [dms, setDms] = useState([])


  useEffect(() => {
    console.log(groupChats)
    setDms([
      { id: 1, name: "DM Chat 1" },
      { id: 2, name: "DM Chat 2" },
      { id: 3, name: "DM Chat 3" },
    ]);

    setGroupChats([
      { id: 1, name: "Group Chat 1" },
      { id: 2, name: "Group Chat 2" },
      { id: 3, name: "Group Chat 3" },
    ]);
  }, []);
  
  return (
    <View style={styles.container}>
      <Text>Select DMs</Text>
      <Chat groupChats={groupChats} />
      <Chat groupChats={dms} />
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
});
