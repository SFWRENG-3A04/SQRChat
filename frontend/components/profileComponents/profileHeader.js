import React, { useRef, useState } from 'react';
import { View, Image, Switch, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker from 'react-native-image-picker';

const ProfileHeader = ({ onToggleAvailability }) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const bottomSheetRef = useRef(null);

  const toggleSwitch = () => {
    setIsAvailable(previousState => !previousState);
    onToggleAvailability && onToggleAvailability(!isAvailable);
  };

  const takePhotoFromCamera = () => {
    ImagePicker.launchCamera({}, (response) => {
      // Handle camera photo capture here
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.launchImageLibrary({}, (response) => {
      // Handle image library selection here
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => bottomSheetRef.current.open()} style={styles.profileImageContainer}>
        <Image 
          source={require('../../assets/profile-placeholder.png')}
          style={styles.profileImage}
        />
        <Image
          source={require('../../assets/edit-icon.png')}
          style={styles.editIcon}
        />
      </TouchableOpacity>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Toggle Availability</Text>
        <Switch
          trackColor={{ false: "#d3d3d3", true: "#34eb4f" }}
          thumbColor={isAvailable ? "#ffffff" : "#ffffff"}
          ios_backgroundColor="#ff0000"
          onValueChange={toggleSwitch}
          value={isAvailable}
        />
      </View>
      <RBSheet
        ref={bottomSheetRef}
        draggable={true}
        closeOnPressMask={false}
        height={300}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            alignItems: 'center',
          },
          draggableIcon: {
            backgroundColor: '#d3d3d3',
          },
        }} 
      >
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Upload Photo</Text>
          <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
            <Text style={styles.panelButtonTitle}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibrary}>
            <Text style={styles.panelButtonTitle}>Choose From Library</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.panelButton} onPress={() => bottomSheetRef.current.close()}>
            <Text style={styles.panelButtonTitle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 40,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 25,
    height: 25,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  toggleLabel: {
    marginRight: 10,
    fontSize: 16,
  },
  panel: {
    padding: 20,
    backgroundColor: '#ffffff',
    paddingTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  panelTitle: {
    fontSize: 25,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#6fbaff',
    alignItems: 'center',
    marginVertical: 7,
    width: '100%',
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  }
});

export default ProfileHeader;
