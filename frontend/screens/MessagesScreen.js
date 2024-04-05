import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Button,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SelectMessageScreen from "./SelectMessageScreen";
import MessageLogsScreen from "./MessageLogsScreen";
import axios from "axios";
import { backendEndpoint } from "../common/constants";

const Stack = createNativeStackNavigator();

export default function MessagesScreen({ route, navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const LoadingScreen = () => {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  };

  useEffect(() => {
    console.log("attempting to fetch users");
    axios
      .get(`http://${backendEndpoint}/get_user_list`)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error retrieving users:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Stack.Navigator initialRouteName="SelectMessage">
      <Stack.Screen
        name="SelectMessage"
        component={
          loading
            ? LoadingScreen
            : () => (
                <SelectMessageScreen navigation={navigation} users={users} />
              )
        }
        initialParams={{ users: users }} // Set initialParams here
        options={({ route, navigation }) => ({
          title: "Messages",
          headerRight: () => (
            <Button
              title="Forward"
              onPress={() =>
                navigation.push("MessageLogs", {
                  chatDetails: { id: "lol", name: "Forward button was hit" },
                })
              }
            />
          ),
        })}
      />
      <Stack.Screen
        name="MessageLogs"
        component={MessageLogsScreen}
        initialParams={{ users: users }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
