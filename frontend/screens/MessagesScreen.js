import React, { useState, useEffect } from 'react';
import { Image, ScrollView } from 'react-native';
import { StyleSheet, FlatList, Text, ImageBackground, View, Button, TextInput, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectMessageScreen from './SelectMessageScreen';
import MessageLogsScreen from './MessageLogsScreen';
import Icon from '../assets/logo.png';
import Background from '../assets/loginbackground.png';

const Stack = createNativeStackNavigator();

export default function MessagesScreen({ route, navigation }) {
 return (
    <ImageBackground source={Background} style={styles.Background}>
      <View style={styles.imageContainer}>
        <Image source={Icon} style={styles.topImage} />
      </View>
     
        <View style={styles.container}>
          <View style={styles.listContainer}>
            <Stack.Navigator initialRouteName="SelectMessage">
              <Stack.Screen
                name="Group Chats"
                component={SelectMessageScreen}
                options={{
                 headerTitle: '', // This line removes the title
                }}
              />
              <Stack.Screen name="MessageLogs" component={MessageLogsScreen} />
            </Stack.Navigator>
          </View>
        </View>
   
    </ImageBackground>
 );
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    
    alignItems: 'center',
    justifyContent: 'center',
    
 },
 imageContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',

    
 },
 topImage: {
    width: '25%',
    height: '61%',
 },

 Background: {
    width: '100%',
    height: '100%',

 },

 listContainer:{



    paddingBottom:20,

    height:900,
    width:'100%',
    backgroundColor:'white',
    
 },

});