import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NativeBaseProvider } from "native-base";

import LandingScreen from './screens/LandingScreen';
import ScanningScreen from './screens/ScanningScreen';
import MessagesScreen from './screens/MessagesScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';


const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen
          name="Home"
          component={LandingScreen}
          options={{title: 'Welcome'}}
        />
        <Tab.Screen 
          name="Scanning" 
          component={ScanningScreen} 
          options={{title: 'Scanning'}}
        />
        <Tab.Screen 
          name="Messages" 
          component={MessagesScreen} 
          options={{title: 'Messages Title'}}
        />
        <Tab.Screen 
          name="Education" 
          component={SettingsScreen} 
          options={{title: 'Settings Title'}}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{title: 'Profile Title'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}