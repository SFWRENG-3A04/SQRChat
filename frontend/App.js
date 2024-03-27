import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LandingScreen from './screens/LandingScreen';
import ScanningScreen from './screens/ScanningScreen';
import HistoryScreen from './screens/HistoryScreen';
import EducationScreen from './screens/EducationScreen';


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
          name="Profile" 
          component={ScanningScreen} 
          options={{title: 'Scanning'}}
        />
        <Tab.Screen 
          name="History" 
          component={HistoryScreen} 
          options={{title: 'History and Results'}}
        />
        <Tab.Screen 
          name="Education" 
          component={EducationScreen} 
          options={{title: 'Learn More!'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}