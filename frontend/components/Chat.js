import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getUser } from '../mock/functions';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const Chat = ({ groupChats, onChatSelected }) => {
 const navigation = useNavigation(); // Use the useNavigation hook

 const getUserNames = (participants) => {
  // Filter out the participant with ID 1
  const filteredParticipants = participants.filter(uid => uid != 1);
 
  return filteredParticipants.map(uid => {
     const user = getUser(uid);
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

 return (
    <View style={styles.listContainer}>
     
      {groupChats.map(chat => (
        
        <TouchableOpacity
        
          key={chat.chatId}
          onPress={() => onChatSelected(chat)}
          style={styles.buttonStyle}
        >
          <View style={styles.chatItem}>
          {chat.participants.length === 2 && (
          <Image
              style={styles.chatImageStyle} 
              source={{uri:getUserPhoto(chat.participants)}}
            />
            )}
             {chat.participants.length != 2 && (<Image
              style={styles.chatImageStyle} 
              source={{uri: chat.pictureURL}}
            /> )} 
                      {chat.participants.length === 2 && (
            <Text style={styles.participantsStyle}>
              {getUserNames(chat.participants)}
            </Text>
          )}
            {chat.participants.length != 2 && (
              <Text style={styles.chatNameStyle}>{chat.displayName || "Chat"}</Text>
            )}
          </View>

        </TouchableOpacity>
        
      ))}


    </View>
 );
};

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 0,
    width:300,
  },


  chatImageStyle: {
    width: 50, 
    height: 50, 
    borderRadius: 25,
    marginRight: 10
  },

  buttonStyle: {

    padding: 10,


    
    borderRadius: 5,
    width:'90%',
    marginLeft:'3%',
  },
  chatNameStyle: {
    color: '#4D4D4D',
    fontSize: 18,
    fontWeight: 'bold',
  },

  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  chatImageStyle: {
    width: 50, 
    height: 50, 
    borderRadius: 25,
    marginRight: 10
  },
  participantsStyle: {
    color: '#4D4D4D',
    fontSize: 18,
    fontWeight: 'bold',
    
   
  },
  backButtonStyle: {
    // Style for the back button container
    marginTop:100,
    padding: 10,
    alignSelf: 'flex-start', // Align to the left
 },
 backButtonTextStyle: {
    // Style for the back button text
    fontSize: 18,
    color: 'blue',
 },
});

export default Chat;
