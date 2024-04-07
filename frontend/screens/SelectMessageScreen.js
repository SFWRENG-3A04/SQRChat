import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground, TouchableOpacity,Modal,TextInput } from "react-native";
import Chat from "../components/Chat";
import { auth, db, ref } from "../services/firebase";
import { getDatabase, set } from "firebase/database";
import { onValue } from "firebase/database";
import Icon from'../assets/logo.png';
import Background from '../assets/loginbackground.png';



export default function SelectMessageScreen({ navigation, route, users }) {
  const [groupChats, setGroupChats] = useState([]);
  const [dms, setDms] = useState([]);
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

  useEffect(() => {
    onValue(ref(db, "chats/"), (snapshot) => {
      if (snapshot.exists()) {
        chats = snapshot.val();
        const groupChatsArray = [];
        const dmsArray = [];

        for (const chatId in chats) {
          const chat = chats[chatId];
          const participants = chat.participants;
          // Check if current user is a participant in this chat
          if (participants && participants.includes(currentUserUid)) {
            // Check if it's a group chat or direct message
            if (participants.length > 2) {
              groupChatsArray.push(chat);
            } else {
              dmsArray.push(chat);
            }
          }
        }

        setGroupChats(groupChatsArray);
        setDms(dmsArray);
      }
    });
  }, []);

  const handleChatSelected = (chat) => {
    navigation.navigate("MessageLogs", { chatDetails: chat });
  };
  const toggleGroupChatsVisibility = () => {
    setGroupChatsVisible(!groupChatsVisible);
 };

 const toggleDmsVisibility = () => {
  setDmsVisible(!dmsVisible);
};


const [chatPictureInput, setChatPictureInput] = useState('');
const [chatIdInput, setChatIdInput] = useState('');
const [displayNameInput, setDisplayNameInput] = useState('');
const [participantsInput, setParticipantsInput] = useState('');


const createNewChat = async (chatPicture,chatId, displayName, participants) => {
  try {
     const db = getDatabase();
     const participantsArray = (participants ?? '').split(',').map(participant => participant.trim());
  participantsArray.push(currentUserUid);
     const participantsObject = {};
     participantsArray.forEach((participant, index) => {
       participantsObject[index] = participant;
     });
 
     const chatData = {
      pictureURL:chatPicture,
       chatId: chatId,
       displayName: displayName,
       lastUpdated: new Date().toISOString(),
       participants: participantsObject,
     };
 

     await set(ref(db, `chats/${chatId}`), chatData);
 
     console.log('Chat created successfully');
     closeModal();
  } catch (error) {
     console.error('Error creating new chat:', error);
  }
 };

 
  return (
    <ImageBackground source={Background} style={styles.Background}>
      <View style={styles.banner}>
         <Image source={Icon} style={styles.Icon}/>
         </View>
    <View style={styles.container}>
    <TouchableOpacity style={styles.titlecontainer} onPress={toggleGroupChatsVisibility}>
 <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
    <Image
      style={{ width: 30, height: 30, marginRight: 10, marginLeft: 10 }}
      source={require('../assets/DMs.png')}
    />
    <Text style={styles.title}>Group Chats</Text>
    <Image
      style={{ width: 20, height: 20, marginLeft: 55 }}
      source={groupChatsVisible ? require('../assets/chevronDown.png') : require('../assets/chevronUp.png')}
    />
 </View>
</TouchableOpacity>
{groupChatsVisible && (
          <ScrollView style={styles.chatcontainer}>
            
            <Chat  users={users}
        groupChats={groupChats}
        onChatSelected={handleChatSelected} />
            <View style={styles.NewChatBox}>
            <TouchableOpacity style={styles.NewChatBox} onPress={openModal}>
        <Text style={styles.NewChat}>+ Add Chat</Text>
      </TouchableOpacity>
      <Modal visible={isModalVisible} onRequestClose={closeModal} animationType="slide">
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

<TextInput
 style={styles.input}
 placeholder="ParticipantIDs (comma-separated)"
 onChangeText={setParticipantsInput}
 value={participantsInput}
/>

    <TouchableOpacity onPress={() => createNewChat(chatPictureInput,chatIdInput, displayNameInput, participantsInput)} style={styles.submitButton}>
      <Text style={styles.submitButtonText}>Submit</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
      <Text style={styles.closeButtonText}>Close</Text>
    </TouchableOpacity>
 </View>
</Modal>
            </View>
          </ScrollView>                   
        )}
<TouchableOpacity style={styles.titlecontainer} onPress={toggleDmsVisibility}>
 <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
    <Image
      style={{ width: 30, height: 30, marginRight: 10, marginLeft: 10 }}
      source={require('../assets/TeamChat.png')}
    />
    <Text style={styles.title}>DMs</Text>
    <Image
      style={{ width: 20, height: 20, marginLeft: '50%' }}
      source={dmsVisible ? require('../assets/chevronDown.png') : require('../assets/chevronUp.png')}
    />
 </View>
</TouchableOpacity>
{dmsVisible && (
          <ScrollView style={styles.chatcontainer}>
            <Chat groupChats={dms} onChatSelected={handleChatSelected} />
            <View style={styles.NewChatBox}>
            <TouchableOpacity style={styles.NewChatBox} onPress={openModal}>
        <Text style={styles.NewChat}>+ Add Chat</Text>
      </TouchableOpacity>
      <Modal visible={isModalVisible} onRequestClose={closeModal} animationType="slide">
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

<TextInput
 style={styles.input}
 placeholder="ParticipantIDs (comma-separated)"
 onChangeText={setParticipantsInput}
 value={participantsInput}
/>

    <TouchableOpacity onPress={() => createNewChat(chatPictureInput,chatIdInput, displayNameInput, participantsInput)} style={styles.submitButton}>
      <Text style={styles.submitButtonText}>Submit</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
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


const styles = StyleSheet.create({
  container: {
   marginTop:'5%',
 marginLeft:'10%',
 marginRight:'10%',
     width:'80%',
  },
  chatcontainer: {
     backgroundColor:"white",
     paddingTop:0,
     borderRadius:10,
     borderTopLeftRadius:0,
     borderTopRightRadius:0,
     height:200,
     width:'100%',
  },
  Background: {
     width: '100%',
     height: '100%',
  },
  titlecontainer: {
     backgroundColor:"white",
     width:'100%',
     height:50,
     borderTopLeftRadius:10,
     borderTopRightRadius:10,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.9,
     shadowRadius: 3.84,
     elevation: 5,
     zIndex:999,
     fontSize:30,
     marginTop:40,
  },
  title: {
     fontSize:25,
     color:"#6FBAFF"
  },
  banner:{
    backgroundColor:'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3.84,
    elevation: 5,
  },
  Icon:{
    width:145,
    height:100,
    zIndex:999,
  },
  NewChat:{
    color:'white',
    fontSize:25,
   
  },
  NewChatBox:{
    backgroundColor:'#C3E2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: '40%',
 },
 modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
 },
 input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
 },
 submitButton: {
    backgroundColor: '#6FBAFF',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
 },
 submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
 },
 closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
 },
 closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
 },
 modalContainer: {
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 5,
  alignItems: 'center',
  justifyContent: 'center',
  width: '80%',
  height: '40%',
  marginTop: '10%',
  marginBottom: '10%',
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 20,
  textAlign: 'center',
},
input: {
  height: 40,
  borderColor: 'gray',
  borderWidth: 1,
  marginBottom: 10,
  paddingLeft: 10,
  width: '100%',
  borderRadius: 5,
},
submitButton: {
  backgroundColor: '#6FBAFF',
  padding: 10,
  borderRadius: 5,
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 10,
},
submitButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
closeButton: {
  marginTop: 20,
  padding: 10,
  backgroundColor: 'blue',
  borderRadius: 5,
},
closeButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
 });
