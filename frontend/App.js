import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, View, Button } from "react-native";
import { logOut } from "./services/login";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';

import LandingScreen from "./screens/LandingScreen"; // Your login screen
import MessagesScreen from "./screens/MessagesScreen";
import ScanningScreen from "./screens/ScanningScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ManageUsersScreen from "./screens/ManageUsersScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        {!loggedIn ? (
          <LandingScreen setLoggedIn={setLoggedIn} setIsAdmin={setIsAdmin} />
        ) : (
          <Tab.Navigator 
            initialRouteName="Messages"
            screenOptions= {({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                switch (route.name) {
                  case 'Messages':
                    iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    break;
                  case 'ManageUsers':
                    iconName = focused ? 'hammer' : 'hammer-outline';
                    break;
                  case 'Settings':
                    iconName = focused ? 'settings' : 'settings-outline';
                    break;
                  case 'Profile':
                    iconName = focused ? 'person' : 'person-outline';
                    break;
                  default:
                    iconName = focused ? 'camera' : 'camera-outline';
                }
                
                return <Ionicons name={iconName} size={size} color={color} />;
              }
            })}
          >
            <Tab.Screen
              name="Messages"
              component={MessagesScreen}
              options={{ title: "Messages" }}
            />
            {/* <Tab.Screen
              name="Scanning"
              component={ScanningScreen}
              options={{ title: "Scanning" }}
            /> */}
            {isAdmin && (
              <Tab.Screen
                name="ManageUsers"
                component={ManageUsersScreen}
                options={{ title: "Manage Users" }}
              />
            )}
            {/* <Tab.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: "Settings Title" }}
            /> */}
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                title: "Profile Title",
                tabBarLabel: "Profile",
                headerRight: () => (
                  <View style={{ marginRight: 8, zIndex: 2 }}>
                    <Button title="Logout" onPress={logOut} />
                  </View>
                ),
              }}
            />
          </Tab.Navigator>
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
