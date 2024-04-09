import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard  } from 'react-native';
import ProfileHeader from '../components/profileComponents/profileHeader';
import ProfileAuth from '../components/profileComponents/profileAuth';
import { auth } from '../services/firebase';

export default function ProfileScreen({ navigation, user }) {
  // Handler function when toggling availability
  const toggleAvailability = (isAvailable) => {
    console.log(isAvailable ? 'Available' : 'Not available');
  };

  const user = auth.currentUser;

  return (
     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <ProfileHeader onToggleAvailability={onToggleAvailability} user={user} />
          <ProfileAuth user={user}/>
        </View>
     </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C3E2FF',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});