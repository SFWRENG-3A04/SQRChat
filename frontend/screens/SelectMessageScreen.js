import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground, TouchableOpacity } from 'react-native';
import Chat from '../components/Chat';
import { getAuth } from '../services/firebase'
import { getChats, getUser, getdmChats, getGroupChats } from '../mock/functions'
import Icon from'../assets/logo.png';
import Background from '../assets/loginbackground.png';

export default function SelectMessageScreen({ navigation }) {
 const [groupChats, setGroupChats] = useState([]);
 const [dms, setDms] = useState([]);
 const [groupChatsVisible, setGroupChatsVisible] = useState(true);
 const [dmsVisible, setDmsVisible] = useState(true);

 useEffect(() => {
    const groupChats = getGroupChats("1");
    setGroupChats(groupChats);
    const dmChats = getdmChats("1");
    setDms(dmChats);
 }, []);

 const handleChatSelected = (chat) => {
    navigation.navigate('Chats', { chatDetails: chat });
 };

 const toggleGroupChatsVisibility = () => {
    setGroupChatsVisible(!groupChatsVisible);
 };

 const toggleDmsVisibility = () => {
    setDmsVisible(!dmsVisible);
 };

 return (
    <ImageBackground source={Background} style={styles.Background}>
      <View style={styles.container}>
        
      <TouchableOpacity style={styles.titlecontainer} onPress={toggleGroupChatsVisibility}>
 <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
    <Image
      style={{ width: 30, height: 30, marginRight: 10, marginLeft: 10 }}
      source={require('../assets/DMs.png')} // Ensure this path is correct
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
            <Chat groupChats={groupChats} onChatSelected={handleChatSelected} />
          </ScrollView>
        )}

<TouchableOpacity style={styles.titlecontainer} onPress={toggleDmsVisibility}>
 <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
    <Image
      style={{ width: 30, height: 30, marginRight: 10, marginLeft: 10 }}
      source={require('../assets/TeamChat.png')} // Ensure this path is correct
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
});