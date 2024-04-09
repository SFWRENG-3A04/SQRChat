import React, { useState, useRef } from "react";
import {StyleSheet, View, Text, TextInput, Button, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView, Dimensions} from "react-native";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

const ProfileAuth = ({user}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [username, setUsername] = useState(user.displayName)
  const [email, setEmail] = useState(user.email)
  const [notification, setNotification] = useState(null);

  const scrollViewRef = useRef(null);
  
  const handleChangePassword = async (newPassword) => {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    if (user) {
      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        console.log("Password updated successfully");
        showNotification("Password updated successfully", "#77DD77");
        setCurrentPassword("");
        setNewPassword("");
      } catch (error) {
        console.log("Error updating password:", error.message);
        showNotification("Error updating password", "#FF6961");
        setCurrentPassword("");
        setNewPassword("");
      }
    } else {
      console.log("No user is currently signed in");
    }
    scrollViewRef.current.scrollToEnd({ animated: true });
  }

  const showNotification = (message, color) => {
    setNotification({'message': message, 'color': color});
    setTimeout(() => {
      setNotification(null);
    }, 5000); // Hide notification after 3 seconds
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.scrollViewContent}
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView behavior="height" style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.background}>
          <View>
            <Text style={styles.label}>Display Name</Text>
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
                  onFocus={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                />
              </View>
              {notification && (
                <View style={styles.notificationContainer} backgroundColor={notification['color']}>
                  <Text style={styles.notification}>{notification['message']}</Text>
                </View>
              )}
              <View style={styles.buttonContainer}>
                <Button title="Update" color="#4B8DF7" 
                  onPress={() => {
                    handleChangePassword(newPassword);
                    Keyboard.dismiss(); // Dismiss keyboard after pressing "Update"
                  }}
                />
              </View>
            </View>
          </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 20,
    backgroundColor: "#C3E2FF",
    width: windowWidth,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
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
    width: 300,
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
    backgroundColor: "#FFFFFF",
  },
  buttonContainer: {
    marginTop: 5,
    alignItems: "center",
  },
  changePasswordBox: {
    backgroundColor: "#C3E2FF",
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
  notificationContainer: {
    backgroundColor: "#FCEBBF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  notification: {
    textAlign: 'center',
  },
});

export default ProfileAuth;
