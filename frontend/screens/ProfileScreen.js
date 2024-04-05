import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProfileHeader from '../components/profileComponents/profileHeader';
import ProfileAuth from '../components/profileComponents/profileAuth';

export default function ProfileScreen({ navigation, user }) {
  // Handler function when toggling availability
  const onToggleAvailability = (isAvailable) => {
    console.log(isAvailable ? 'Available' : 'Not available');
  };

  return (
    <View style={styles.container}>
      <ProfileHeader onToggleAvailability={onToggleAvailability} />
      <ProfileAuth user={user}/>
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