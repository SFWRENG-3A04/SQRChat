import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectMessageScreen from './SelectMessageScreen';
import MessageLogsScreen from './MessageLogsScreen';

const Stack = createNativeStackNavigator();

export default function MessagesScreen({route, navigation}) {
  // const [groupChats, setGroupChats] = useState([])
  // const [dms, setDms] = useState([])

  // useEffect(() => {
  //   setGroupChats([
  //     { id: 1, name: "Group Chat 1" },
  //     { id: 2, name: "Group Chat 2" },
  //     { id: 3, name: "Group Chat 3" },
  //   ]);
  // }, []);

  return (
    <Stack.Navigator initialRouteName="SelectMessage">
      <Stack.Screen name="SelectMessage" component={SelectMessageScreen} //initialParams={{ 'groupChats': groupChats, 'setGroupChats': setGroupChats, 'dms': dms, 'setDms': setDms}}
        options={({ route, navigation }) => ({
          title: 'Messages',
          headerRight: () => (
            <Button title="Forward" 
              onPress={() => navigation.push('MessageLogs', { chatDetails: {id: "lol", name: "Forward button was hit"} })}
            />
          ),
        })}
      />
      <Stack.Screen name="MessageLogs" component={MessageLogsScreen} />
    </Stack.Navigator>
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
