import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import Chat from '../components/Chat';
import Constants from 'expo-constants';

export default function HistoryScreen({navigation}) {
  const backendEndpoint = Constants.expoConfig.extra.backendEndpoint;
  
  return (
    <View style={styles.container}>
      <Chat serverUrl={`wss://${backendEndpoint}/message`} />
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
