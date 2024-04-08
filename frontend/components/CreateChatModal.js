import React, { useState, useContext } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ChatContext } from '../context/ChatContext';
import { ref } from "../services/firebase";
import { getDatabase, set } from "firebase/database";


const CreateChatModal = ({ isVisible, onClose, onChatCreated }) => {
  const { users } = useContext(ChatContext);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [chatName, setChatName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [chatID, setChatID] = useState('');
  const [addUsers, setAddUsers] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);

// Function to close the modal
const closeModal = () => {
  setIsModalVisible(false);
};

  const createNewChat = async (chatPicture,chatId, displayName, participants) => {
    try {
       const db = getDatabase();
       // Use optional chaining and provide a fallback value to prevent calling split on undefined
       const participantsArray = (participants ?? '').split(',').map(participant => participant.trim());
   
       // Construct the participants object with numeric keys
       const participantsObject = {};
       participantsArray.forEach((participant, index) => {
         participantsObject[index] = participant;
       });
   
       const chatData = {
        pictureUrl:chatPicture,
         chatId: chatId,
         displayName: displayName,
         lastUpdated: new Date().toISOString(), // Use current date for Realtime Database
         participants: participantsObject, // Store participants as an object with numeric keys
       };
   
       // Add the chat data to the 'chats' collection
       await set(ref(db, `chats/${chatId}`), chatData);
   
       console.log('Chat created successfully');
       closeModal(); // Close the modal after successful creation
    } catch (error) {
       console.error('Error creating new chat:', error);
    }
   };

  const handleCreateChat = () => {
    if (selectedUsers.length > 0 && chatName && photoUrl && chatID) {
      // Assuming `selectedUsers` is an array of user IDs
      // and `addUsers` is a comma-separated string of user IDs
      const usersArray = addUsers.split(',').map(uid => uid.trim());
      onChatCreated(photoUrl, chatID, chatName, usersArray); // Passes the correctly ordered parameters
      setChatName('');
      setPhotoUrl('');
      setChatID('');
      setSelectedUsers([]);
      onClose();
    } else {
      alert('Please fill all fields and select users.');
    }
  };
 

    return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Chat</Text>
          <TextInput
            style={styles.input}
            placeholder="Add Users"
            placeholderTextColor="#6FBAFF"
            value={addUsers}
            onChangeText={setAddUsers}
          />
          {/* <FlatList
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={(item) => item.uid.toString()}
          /> */}
          <TextInput
            style={styles.input}
            placeholder="Photo URL"
            placeholderTextColor="#6FBAFF" // Adding placeholder text color for better contrast
            value={photoUrl}
            onChangeText={setPhotoUrl}
          />
          <TextInput
            style={styles.input}
            placeholder="Chat ID"
            placeholderTextColor="#6FBAFF"
            value={chatID}
            onChangeText={setChatID}
          />
          <TextInput
            style={styles.input}
            placeholder="Chat Name"
            placeholderTextColor="#6FBAFF"
            value={chatName}
            onChangeText={setChatName}
          />
          <TouchableOpacity onPress={() => createNewChat(photoUrl,chatID, chatName, addUsers)} style={styles.button}>
            <Text style={styles.buttonText}>Create Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0047AB', // A shade of blue from the image
  },
  searchInput: {
    alignSelf: 'stretch', // Ensure the input stretches to the width of the container
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 15,
    backgroundColor: '#F2F2F2',
    color: 'black',
    fontSize: 16,
  },
  input: {
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 15,
    backgroundColor: '#FFFFFF', // Changed to white for better contrast
    color: 'black',
    fontSize: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2', // Light gray background color for the list item
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  userText: {
    color: 'black',
    fontSize: 16,
  },
  selectionIndicator: {
   
  },
  button: {
    backgroundColor: '#0047AB', // Button color matching the image
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginVertical: 10,
    elevation: 2,
    width: '100%', // Full width of the modal content
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateChatModal;