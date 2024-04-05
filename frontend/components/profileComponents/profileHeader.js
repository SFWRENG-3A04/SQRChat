import React, { useRef, useState, useEffect } from 'react';
import { View, Image, Switch, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraType } from 'expo-camera';

const ProfileHeader = ({ onToggleAvailability }) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [image, setImage] = useState(null);
  const bottomSheetRef = useRef(null);
  const [cameraStatus, requestCameraPermissions] = ImagePicker.useCameraPermissions();
  const [mediaStatus, requestMediaPermissions] = ImagePicker.useMediaLibraryPermissions();

  const permisionFunction = async () => {
    if (cameraStatus.status !== 'granted') {
      const cameraPermission = await requestCameraPermissions();
      if (cameraPermission.status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }
    }

    if (mediaStatus.status !== 'granted') {
      const mediaPermission = await requestMediaPermissions();
      if (mediaPermission.status !== 'granted') {
        alert('Sorry, we need mediallibrary permissions to make this work!');
        return;
      }
    }
  };

  // useEffect(() => {
  //   permisionFunction();
  // }, []);

  const toggleSwitch = () => {
    setIsAvailable(prevState => !prevState);
    onToggleAvailability && onToggleAvailability(!isAvailable);
  };

    const takePhotoCamera = async () => {
        permisionFunction();
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        } else {
            console.log('Camera picking cancelled or no assets returned');
        }
    };

    const choosePhotoLibrary = async () => {
        permisionFunction();
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        } else {
            console.log('Library picking cancelled or no assets returned');
        }
    };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => bottomSheetRef.current.open()} style={styles.profileImageContainer}>
        <Image 
          source={image ? { uri: image } : require('../../assets/profile-placeholder.png')}
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
          trackColor={{ false: "#ff0000", true: "#34eb4f" }}
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
          <TouchableOpacity style={styles.panelButton} onPress={takePhotoCamera}>
            <Text style={styles.panelButtonTitle}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.panelButton} onPress={choosePhotoLibrary}>
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
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  }
});

export default ProfileHeader;
