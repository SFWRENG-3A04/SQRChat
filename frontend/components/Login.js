import React from 'react';
import { StyleSheet, View, Button } from 'react-native';


export default function Login({user, uid, db, logIn}) {

  return (
    <View style={styles.container}>
      <Button title={'Login'} onPress={logIn} />
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
})