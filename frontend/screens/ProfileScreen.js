import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileHeader from '../components/profileComponents/profileHeader';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ProfileScreen({ navigation }) {
  const handleToggleAvailability = (available) => {
    // Functionality to update availability status
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={styles.container}>
      <ProfileHeader 
        onToggleAvailability={handleToggleAvailability} 
      />
    </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
