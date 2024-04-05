import React, { useState } from "react";
import {TouchableOpacity,StyleSheet, View,Text,TextInput,Button,} from "react-native";
import { getAuth, updatePassword } from "firebase/auth";

const auth = getAuth();

const user = auth.currentUser;
const emailName = user.email;
const username = emailName.split('@')[0];

const profileAuth = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const handleCancel = () => {
    // Implement cancel action
  };

  const handleSave = () => {
    // Implement save action
  };

  const handleChangePassword = async () => {
    if (user) {
      try {
        await updatePassword(user, newPassword);
        console.log("Password updated successfully");
      } catch (error) {
        console.error("Error updating password:", error.message);
      }
    } else {
      console.error("No user is currently signed in");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <View style={styles.section}>
        <Text style={styles.value}>{username}</Text>
      </View>
      <Text style={styles.label}>Email</Text>
      <View style={styles.section}>
        <Text style={styles.value}>{emailName}</Text>
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
          <Button title="Update" color="#4B8DF7" />
        </View>
      </View>
    </View>
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
  saveButton: {
    backgroundColor: "blue",
  },
  cancelButton: {
    backgroundColor: "grey",
  },
  saveButtonText: {
    color: "white",
  },
  cancelButtonText: {
    color: "white",
  },
});

export default profileAuth;
