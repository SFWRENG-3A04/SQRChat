import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';

export default function Login({ user, uid, db, logIn, signUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true} // This will obscure the text for password input
      />
      <Button title={'Create Account'} onPress={() => signUp(email, password)} />
      <Button title={'Login'} onPress={() => logIn(email, password)} />
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
    width: 300, // Adjust the width as necessary
    borderRadius: 5, // Optional: to make it look nicer
  },
});
