import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  View,
  Text,
} from "react-native";
import UserCard from "../components/UserCard";
import axios from "axios";
import Constants from "expo-constants";
import { auth } from "../services/firebase";

export default function ManageUsersScreen({ route }) {
  const [users, setUsers] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const backendEndpoint = Constants.expoConfig.extra.backendEndpoint;

  const fetchData = () => {
    axios
      .get(`http://${backendEndpoint}/get_user_list`)
      .then((response) => {
        setUsers(response.data);
        setRefreshing(false); // After data is fetched, set refreshing to false
      })
      .catch((error) => {
        console.error("Error retrieving users:", error);
        setRefreshing(false); // In case of error, still need to set refreshing to false
      });
  };

  useEffect(() => {
    fetchData();
    console.log(auth.uid);
  }, []);

  const handleUserDelete = (userId) => {
    axios
      .delete(`http://${backendEndpoint}/delete_user/${userId}`)
      .then(() => {
        // Filter out the deleted user from the list
        setUsers(users.filter((user) => user.uid !== userId));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const onRefresh = () => {
    setRefreshing(true); // Set refreshing to true when refresh starts
    fetchData(); // Fetch data again
  };

  return (
    <SafeAreaView>
      {!users ? (
        <View style={styles.textContainer}>
          <Text>No users found</Text>
        </View>
      ) : (
        <FlatList
          style={styles.listContainer}
          data={users}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <UserCard onDelete={() => handleUserDelete(item.uid)} item={item} />
          )}
          refreshControl={
            // Add refresh control to the FlatList
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: { height: "100%" },
  textContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
