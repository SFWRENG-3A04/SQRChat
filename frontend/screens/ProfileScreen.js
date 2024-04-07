import React, {useRef} from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard  } from 'react-native';
import ProfileHeader from '../components/profileComponents/profileHeader';
import ProfileAuth from '../components/profileComponents/profileAuth';

export default function ProfileScreen({ navigation, user }) {
  // Handler function when toggling availability
  const onToggleAvailability = (isAvailable) => {
    console.log(isAvailable ? 'Available' : 'Not available');
  };

  const scrollViewRef = useRef(null);

  const handleTextInputFocus = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <ProfileHeader onToggleAvailability={onToggleAvailability} />
          <ProfileAuth user={user} onTextInputFocus={handleTextInputFocus}/>
        </View>
     </TouchableWithoutFeedback>
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