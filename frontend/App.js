import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View, Button } from 'react-native';
import { logOut } from './services/login';
import Icon from 'react-native-vector-icons/MaterialIcons';


import LandingScreen from './screens/LandingScreen'; // Your login screen
import MessagesScreen from './screens/MessagesScreen';
import ChatScreen from './screens/ChatScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      {!loggedIn ? (
        <LandingScreen setLoggedIn={setLoggedIn} />
      ) : (
        <Tab.Navigator initialRouteName="Messages">
          <Tab.Screen
            name="Messages"
            component={MessagesScreen}
            options={{ title: '',
            tabBarLabel: 'Messages', }}
          />
          <Tab.Screen
          
            name="Chats"
            component={ChatScreen}
            options={({ navigation }) => ({
              title: '',
              tabBarLabel: 'Chat',
              
            
           })}
          />
   
          <Tab.Screen
            name="Profile" 
            component={ProfileScreen}
            options={{
              title: 'Profile Title',
              tabBarLabel: 'Profile',
              headerRight: () => (
                <View style={{marginRight:8,zIndex:2}}>
                    <Button title="Logout" onPress={logOut}/>
                </View>
              )
            }}
          />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}
