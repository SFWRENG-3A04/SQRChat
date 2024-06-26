import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert, // Import Alert
} from 'react-native';

export default function Login({ user, uid, db, logIn, signUp }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  // Function to handle sign up button click
  const handleSignUp = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      // Alert user or handle the error state
      Alert.alert("Error", "All fields are required.");
      return; // Stop the sign-up process if any field is empty
    }
    
    const fullName = `${firstName} ${lastName}`;
    signUp(email, password, fullName);
    setIsCreatingAccount(false); // Reset to login mode after sign up
  };

  // Function for login that also checks for empty fields
  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }

    logIn(email, password);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <Text style={styles.title}>SQRChat</Text>
            <Image source={require("../assets/logo.png")} style={styles.image} />
            {isCreatingAccount && (
              <>
                <TextInput
                  style={styles.input}
                  onChangeText={setFirstName}
                  value={firstName}
                  placeholder="First Name"
                  keyboardType="default"
                />
                <TextInput
                  style={styles.input}
                  onChangeText={setLastName}
                  value={lastName}
                  placeholder="Last Name"
                  keyboardType="default"
                />
              </>
            )}
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
              secureTextEntry={true}
            />
            <View style={styles.button}>
              <Button
                title={isCreatingAccount ? 'Sign Up' : 'Login'}
                onPress={isCreatingAccount ? handleSignUp : handleLogin}
              />
            </View>
            <View style={styles.spacing} />
            <View style={styles.createAccountContainer}>
              <Text>{isCreatingAccount ? 'Already have an account? ' : "Don't have an account? "}</Text>
              <TouchableOpacity onPress={() => setIsCreatingAccount(!isCreatingAccount)}>
                <Text style={styles.createAccountText}>{isCreatingAccount ? 'Login' : 'Create Account'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C3E2FF',
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 300,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  spacing: {
    height: 10,
  },
  button: {
    width: 300,
  },
  createAccountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: 'transparent',
  },
  createAccountText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
