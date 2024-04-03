import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";

const RightSwipeActions = ({ onDelete }) => {
  return (
    <TouchableOpacity style={{ backgroundColor: "red" }} onPress={onDelete}>
      <Text style={styles.swipe}>Delete</Text>
    </TouchableOpacity>
  );
};

export default function UserCard({ item, onDelete }) {
  return (
    <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#929292" }}>
      <Swipeable
        renderRightActions={() => <RightSwipeActions onDelete={onDelete} />}
      >
        <View style={styles.viewRow}>
          <View style={styles.rowItems}>
            <Image
              style={styles.profilePicture}
              source={
                item.photoUrl
                  ? {
                      uri: item.photoUrl,
                    }
                  : require("../assets/employeeImage.png")
              }
            ></Image>
            <View>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.displayName}>
                {"Display Name: " + (item.displayName || "N/A")}
              </Text>
            </View>
          </View>
        </View>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  displayName: {
    fontWeight: 600,
    fontSize: 12,
    color: "#4d4d4d",
  },
  email: {
    fontWeight: 600,
    fontSize: 16,
    color: "#4d4d4d",
  },
  profilePicture: {
    borderRadius: 50,
    width: 50,
    height: 50,
    marginRight: 10,
  },
  rowItems: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  viewRow: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  swipe: {
    color: "white",
    justifyContent: "center",
    fontWeight: "600",
    paddingHorizontal: 30,
    paddingVertical: 35,
    backgroundColor: "red",
    height: "100%",
  },
});
