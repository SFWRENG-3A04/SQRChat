import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

export default function MessagesScreen({route, navigation}) {

  useEffect(() => {
    navigation.setOptions({
      title: `Team Test`,
      headerLeft: () => (
        <Button title="Confirm"
          onPress={() =>
            navigation.push('FinalTeams', {
              numOfTeams: 2,
              currTeam: 1,
            })}
        />)
    }
  )}, [navigation]);
  
  return (

    <View style={styles.container}>
      <Text>Messages</Text>
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
