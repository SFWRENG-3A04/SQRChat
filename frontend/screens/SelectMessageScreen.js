import React, { useState, useEffect, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import Chat from "../components/Chat";
import { auth, db, ref } from "../services/firebase";
import { getDatabase, set } from "firebase/database";
import { onValue } from "firebase/database";
import Icon from "../assets/logo.png";
import Background from "../assets/loginbackground.png";

export default function SelectMessageScreen({ navigation, users }) {
  const { dms, groupChats, setSelectedChat } = useContext(ChatContext);
  const [groupChatsVisible, setGroupChatsVisible] = useState(true);
  const [dmsVisible, setDmsVisible] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const currentUserUid = auth.currentUser.uid;

  const handleChatSelected = (chat) => {
    setSelectedChat(chat);
    navigation.navigate("MessageLogs");
  };
  const toggleGroupChatsVisibility = () => {
    setGroupChatsVisible(!groupChatsVisible);
  };

  const toggleDmsVisibility = () => {
    setDmsVisible(!dmsVisible);
  };

  const [chatPictureInput, setChatPictureInput] = useState("");
  const [chatIdInput, setChatIdInput] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [participantsInput, setParticipantsInput] = useState("");

  const createNewChat = async (
    chatPicture,
    chatId,
    displayName,
    participants
  ) => {
    try {
      const db = getDatabase();
      // Use optional chaining and provide a fallback value to prevent calling split on undefined
      const participantsArray = (participants ?? "")
        .split(",")
        .map((participant) => participant.trim());
      participantsArray.push(currentUserUid);
      // Construct the participants object with numeric keys
      const participantsObject = {};
      participantsArray.forEach((participant, index) => {
        participantsObject[index] = participant;
      });

      const chatData = {
        pictureUrl: chatPicture,
        chatId: chatId,
        displayName: displayName,
        lastUpdated: new Date().toISOString(), // Use current date for Realtime Database
        participants: participantsObject, // Store participants as an object with numeric keys
      };

      // Add the chat data to the 'chats' collection
      await set(ref(db, `chats/${chatId}`), chatData);

      console.log("Chat created successfully");
      closeModal(); // Close the modal after successful creation
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };
  return (
    <ImageBackground source={Background} style={styles.Background}>
      <View style={styles.banner}>
        <Image source={Icon} style={styles.Icon} />
      </View>
      <TouchableOpacity style={styles.NewChatBox} onPress={openModal}>
        <Text style={styles.NewChat}>+ Add Chat</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.titlecontainer}
          onPress={toggleGroupChatsVisibility}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
          >
            <Image
              style={{ width: 30, height: 30, marginRight: 10, marginLeft: 10 }}
              source={require("../assets/DMs.png")} // Ensure this path is correct
            />
            <Text style={styles.title}>Group Chats</Text>
            <Image
              style={{ width: 20, height: 20, marginLeft: 55 }}
              source={
                groupChatsVisible
                  ? require("../assets/chevronDown.png")
                  : require("../assets/chevronUp.png")
              }
            />
          </View>
        </TouchableOpacity>
        {groupChatsVisible && (
          <ScrollView style={styles.chatcontainer}>
            <Chat
              users={users}
              groupChats={groupChats}
              onChatSelected={handleChatSelected}
            />
            <View style={styles.NewChatBox}>
              <Modal
                visible={isModalVisible}
                onRequestClose={closeModal}
                animationType="slide"
              >
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Add New Chat</Text>
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="gray"
                    placeholder="Chat Picture URL"
                    onChangeText={setChatPictureInput}
                    value={chatPictureInput}
                  />
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="gray"
                    placeholder="Chat ID"
                    onChangeText={setChatIdInput}
                    value={chatIdInput}
                  />
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="gray"
                    placeholder="Display Name"
                    onChangeText={setDisplayNameInput}
                    value={displayNameInput}
                  />

                  <TouchableOpacity
                    onPress={() =>
                      createNewChat(
                        chatPictureInput,
                        chatIdInput,
                        displayNameInput,
                        participantsInput
                      )
                    }
                    style={styles.submitButton}
                  >
                    <Text style={styles.submitButtonText}>Create Chat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          </ScrollView>
        )}
        <TouchableOpacity
          style={styles.titlecontainer}
          onPress={toggleDmsVisibility}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
          >
            <Image
              style={{ width: 30, height: 30, marginRight: 10, marginLeft: 10 }}
              source={require("../assets/TeamChat.png")} // Ensure this path is correct
            />
            <Text style={styles.title}>DMs</Text>
            <Image
              style={{ width: 20, height: 20, marginLeft: "50%" }}
              source={
                dmsVisible
                  ? require("../assets/chevronDown.png")
                  : require("../assets/chevronUp.png")
              }
            />
          </View>
        </TouchableOpacity>
        {dmsVisible && (
          <ScrollView style={styles.chatcontainer}>
            <Chat
              users={users}
              groupChats={dms}
              onChatSelected={handleChatSelected}
            />
            <View style={styles.NewChatBox}>
              <Modal
                visible={isModalVisible}
                onRequestClose={closeModal}
                animationType="slide"
              >
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Add New Chat</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Chat Picture URL"
                    onChangeText={setChatPictureInput}
                    value={chatPictureInput}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Chat ID"
                    onChangeText={setChatIdInput}
                    value={chatIdInput}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Display Name"
                    onChangeText={setDisplayNameInput}
                    value={displayNameInput}
                  />

                  <TouchableOpacity
                    onPress={() =>
                      createNewChat(
                        chatPictureInput,
                        chatIdInput,
                        displayNameInput,
                        participantsInput
                      )
                    }
                    style={styles.submitButton}
                  >
                    <Text style={styles.submitButtonText}>Create Chat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          </ScrollView>
        )}
      </View>
    </ImageBackground>
  );
}

{
  /*       <Chat
        users={users}
        groupChats={groupChats}
        onChatSelected={handleChatSelected}
      />
      <Chat
        users={users}
        groupChats={dms}
        onChatSelected={handleChatSelected}
      /> */
}

const styles = StyleSheet.create({
  container: {
    marginTop: "5%",
    marginLeft: "10%",
    marginRight: "10%",
    width: "80%",
  },
  chatcontainer: {
    backgroundColor: "white",
    paddingTop: 0,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    height: 200,
    width: "100%",
  },
  Background: {
    width: "100%",
    height: "100%",
  },
  titlecontainer: {
    backgroundColor: "white",
    width: "100%",
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 999,
    fontSize: 30,
    marginTop: 40,
  },
  title: {
    fontSize: 25,
    color: "#6FBAFF",
  },
  banner: {
    backgroundColor: "white",
    alignItems: "center", // This will center the Image horizontally
    justifyContent: "center", // This will center the Image vertically
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3.84,
    elevation: 5,
  },
  Icon: {
    width: 145,
    height: 100,
    zIndex: 999,
  },
  NewChat: {
    color: "white",
    fontSize: 25,
  },
  NewChatBox: {
    backgroundColor: "#C3E2FF",
    alignItems: "center", // This will center the Image horizontally
    justifyContent: "center", // This will center the Image vertically
  },
  modalContainer: {
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center", // Center the content vertically
    width: "100%", // Adjust the width as needed
    height: "40%", // Adjust the height as needed
    marginTop: "auto", // Adjust the top margin as needed
    marginBottom: "auto", // Adjust the bottom margin as needed
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center", // Center the title text
    color: "blue",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: "100%",
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: "#6FBAFF",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 10,
    width: "100%",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
