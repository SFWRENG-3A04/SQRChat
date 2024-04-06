import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { auth, db, ref } from "../services/firebase";
import { update } from "firebase/database";
import { ChatContext } from "../context/ChatContext";

const AddUsersScreen = ({ route, navigation }) => {
  const { users } = route.params;
  const { selectedChat } = useContext(ChatContext);
  const currentUser = auth.currentUser.uid;

  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const usersNotInChat = () => {
    return users.filter(
      (user) =>
        !selectedChat.participants.includes(user.uid) &&
        user.uid !== currentUser
    );
  };

  useEffect(() => {
    setAvailableUsers(usersNotInChat());
  }, [selectedChat]);

  const toggleUserSelection = (user) => {
    const userUid = user.uid;
    if (selectedUsers.includes(userUid)) {
      setSelectedUsers(
        selectedUsers.filter((selectedUser) => selectedUser !== userUid)
      );
    } else {
      setSelectedUsers([...selectedUsers, userUid]);
    }
  };

  const handleAddUsers = () => {
    const updatedParticipants = [
      ...selectedChat.participants,
      ...selectedUsers,
    ];

    const updatedChat = {
      ...selectedChat,
      participants: updatedParticipants,
    };

    update(ref(db, `chats/${selectedChat.chatId}`), updatedChat)
      .then(() => {
        setSelectedUsers([]);
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Error updating chat details:", error);
      });
  };

  const filteredUsers = availableUsers.filter(
    (user) =>
      (user.displayName &&
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleUserSelection(item)}
            style={styles.userItem}
          >
            <View style={styles.userInfo}>
              {item.photoUrl ? (
                <Image
                  source={{ uri: item.photoUrl }}
                  style={styles.profileImage}
                />
              ) : (
                <Image
                  source={require("../assets/employeeImage.png")}
                  style={styles.profileImage}
                />
              )}
              <View style={styles.userText}>
                <Text>
                  {item.displayName
                    ? `${item.displayName} (${item.email})`
                    : item.email}
                </Text>
              </View>
            </View>
            <View style={styles.selectionIndicator}>
              {selectedUsers.includes(item.uid) && (
                <MaterialIcons name="check" size={24} color="green" />
              )}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity onPress={handleAddUsers} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingRight: 20,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  userText: {
    flexDirection: "column",
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: "#007bff",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AddUsersScreen;
