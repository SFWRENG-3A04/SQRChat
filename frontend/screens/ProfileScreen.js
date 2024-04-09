import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProfileHeader from '../components/profileComponents/profileHeader';
import { auth } from '../services/firebase';

export default function ProfileScreen({ navigation }) {
  // Handler function when toggling availability
  const toggleAvailability = (isAvailable) => {
    console.log(isAvailable ? 'Available' : 'Not available');
  };

  const userId = auth.currentUser;

  return (
    <View style={styles.container}>
      <ProfileHeader toggleAvailability={toggleAvailability} userId={userId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});