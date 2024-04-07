import React, { useState, useContext } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ChatContext } from '../context/ChatContext';

const CreateChatModal = ({ isVisible, onClose, onChatCreated }) => {
  const { users } = useContext(ChatContext);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [chatName, setChatName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  

  const toggleUserSelection = (uid) => {
    if (selectedUsers.includes(uid)) {
      setSelectedUsers(selectedUsers.filter((selectedUid) => selectedUid !== uid));
    } else {
      setSelectedUsers([...selectedUsers, uid]);
    }
  };

  const handleCreateChat = () => {
    if (selectedUsers.length > 0 && chatName) {
      onChatCreated(selectedUsers, chatName);
      setChatName('');
      setSelectedUsers([]);
      onClose();
    } else {
      alert('Please select users and enter a chat name.');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleUserSelection(item.uid)}
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
            source={require("../assets/employeeImage.png")} // Replace with your default image path
            style={styles.profileImage}
          />
        )}
        <Text>
          {item.displayName ? `${item.displayName} (${item.email})` : item.email}
        </Text>
      </View>
      {selectedUsers.includes(item.uid) && (
        <MaterialIcons name="check" size={24} color="green" />
      )}
    </TouchableOpacity>
  );

  const filteredUsers = availableUsers.filter(
    (user) =>
      (user.displayName &&
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Chat</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={(item) => item.uid.toString()}
          />
          <TextInput
            style={styles.input}
            placeholder="Chat Name"
            value={chatName}
            onChangeText={setChatName}
          />
          <TouchableOpacity style={styles.button} onPress={handleCreateChat}>
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
    backgroundColor: '#F2F2F2',
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