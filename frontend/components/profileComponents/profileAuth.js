import React, { useState, useRef } from "react";
import {StyleSheet, View, Text, TextInput, Button, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView} from "react-native";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from '../../services/firebase'

const profileAuth = ({user}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [username, setUsername] = useState(user.displayName)
  const [email, setEmail] = useState(user.email)

  const scrollViewRef = useRef(null);
  
  const handleChangePassword = async (newPassword) => {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    if (user) {
      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        console.log("Password updated successfully");
      } catch (error) {
        console.error("Error updating password:", error.message);
      }
    } else {
      console.error("No user is currently signed in");
    }
    scrollViewRef.current.scrollToEnd({ animated: true });
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.scrollViewContent}
      keyboardShouldPersistTaps="handled"
      >
      <KeyboardAvoidingView behavior="height" style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <Text style={styles.label}>Username</Text>
            <View style={styles.section}>
              <Text style={styles.value}>{username}</Text>
            </View>
            <Text style={styles.label}>Email</Text>
            <View style={styles.section}>
              <Text style={styles.value}>{email}</Text>
            </View>
            <Text style={styles.label}>Change Password</Text> 
            <View style={[styles.section, styles.changePasswordBox]}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Current Password</Text> 
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={(text) => setCurrentPassword(text)}
                />
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={(text) => setNewPassword(text)}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  title="Update"
                  color="#4B8DF7"
                  onPress={() => {
                    handleChangePassword(newPassword);
                    Keyboard.dismiss(); // Dismiss keyboard after pressing "Update"
                  }
                }
                />
              </View>
            </View>
          </View>
          </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F8F8",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
  },
  inputContainer: {
    marginTop: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  changePasswordBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BDBDBD",
    padding: 10,
    paddingBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default profileAuth;