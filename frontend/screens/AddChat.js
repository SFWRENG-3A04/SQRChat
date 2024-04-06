import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProfileHeader from '../components/profileComponents/profileHeader';

export default function AddChat({ navigation }) {
  // Handler function when toggling availability
  const onToggleAvailability = (isAvailable) => {
    console.log(isAvailable ? 'Available' : 'Not available');
  };

  return (
    <View style={styles.container}>
      <ProfileHeader onToggleAvailability={onToggleAvailability} />
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