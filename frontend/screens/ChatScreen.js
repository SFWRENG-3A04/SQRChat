import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import Messages from '../components/Messages';
import { sendMessage ,getUser} from '../mock/functions';
import { useNavigation} from '@react-navigation/native'; // Import useNavigation
import Icon from 'react-native-vector-icons/MaterialIcons';
import Send from '../assets/Send.png';
import { AutoFocus } from 'expo-camera';

export default function ChatScreen({route}) {
  const navigation = useNavigation(); // Get the navigation object

  if (!route || !route.params) {
      return (
          <View style={styles.defaultScreen}>
              <Text style={styles.defaultScreenText}>No chat details available. Please select a chat first</Text>
          </View>
      );
  }

  const { chatDetails } = route.params;
  const currentUserUid = "1";
  const [messageText, setMessageText] = useState('');

  // Function to get participant names
  const getParticipantNames = (participants) => {
    // Filter out the participant with ID 1
    const filteredParticipants = participants.filter(uid => uid != 1);

    return filteredParticipants.map(uid => {
        const user = getUser(uid); // Assuming getUser is a function that fetches user details
        return user ? user.displayName : 'Unknown';
    }).join(', ');
};

const getUserPhoto = (participants) => {
  // Filter out the participant with ID 1
  const filteredParticipants = participants.filter(uid => uid != 1);
 
  return filteredParticipants.map(uid => {
     const user = getUser(uid);
     return user ? user.photoUrl : 'Unknown';
  }).join(', ');
 };
  const handleMessageSend = () => {
      if (messageText.trim()) {
          const newMessage = {
              senderUid: "1", // Assuming "1" is the UID of the current user
              text: messageText.trim()
          };

          sendMessage(chatDetails.chatId, newMessage);
          setMessageText('');
      }
  };

  return (
      <KeyboardAvoidingView 
          style={styles.container} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === "ios" ? 135 : 0}
      >
          <View style={styles.container}>
              <View style={styles.headerContainer}>
                  <TouchableOpacity
                      style={styles.backButtonStyle}
                      onPress={() => navigation.goBack()} // Navigate back when pressed
                  >
                      <Icon name="chevron-left" size={26} color="black" />
                  </TouchableOpacity>
                  {chatDetails.participants.length === 2 && (<Image
              style={styles.chatImageStyle} 
              source={{uri: getUserPhoto(chatDetails.participants)}}
            /> )} 

{chatDetails.participants.length != 2 && (<Image
              style={styles.chatImageStyle} 
              source={{uri: chatDetails.pictureURL}}
            /> )} 
                  {chatDetails.participants.length === 2 ? (
                        
                      <Text style={styles.participantsStyle}>{getParticipantNames(chatDetails.participants)}</Text>
                  ) : (
                    
                      <Text style={styles.chatNameStyle}>{chatDetails.displayName || "Chat Name"}</Text>
                  )}
              </View>
              <ScrollView style={styles.messageContainer}>
                  <Messages messages={chatDetails.messages} currentUserUid={currentUserUid} />
              </ScrollView>
              <View style={styles.inputContainer}>
                  <TextInput
                      value={messageText}
                      onChangeText={setMessageText}
                      placeholder="Type a message..."
                      style={styles.input}
                  />
                  <TouchableOpacity onPress={handleMessageSend} style={styles.sendButton}>
                  <Image source={Send} style={styles.Send}/>
                  </TouchableOpacity>
              </View>
          </View>
      </KeyboardAvoidingView>
  );
}


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      height:200,
      
    },
    messageContainer: {
      // might need flex here
      
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 10,
      borderTopWidth: 1,
      borderColor: '#ccc',
      backgroundColor: '#fff',
    },
    input: {
      flex: 1,
      marginRight: 10,
      borderWidth: 3,
      borderColor: '#6FBAFF',
      borderRadius: 20,
      padding: 10,
      fontSize: 16,
      backgroundColor: '#f9f9f9',
    },
    sendButton: {
      justifyContent: 'center',

    },
    sendButtonText: {
      color: '#ffffff',
      fontSize: 16,
    },
     backButtonStyle: {

    padding: 10,
    alignSelf: 'flex-start', // Align to the left
 },
 backButtonTextStyle: {
    fontSize: 18,
    color: 'black',
 },

 headerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  borderBottomWidth: 1,
  borderColor: '#ccc',
  backgroundColor:'white',
},
chatNameStyle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginLeft: 10, // Add some space between the back button and the chat name
},
participantsStyle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginLeft: 10, // Add some space between the back button and the participants' names
},
chatImageStyle: {
  width: 50, 
  height: 50, 
  borderRadius: 25,
  marginRight: 10
},
Send:{
  width:45,
  height:45,

}
  });