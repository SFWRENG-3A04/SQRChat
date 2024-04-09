import React, { useRef, useState, useEffect } from 'react';
import { Alert, View, Image, Switch, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref, set, onValue } from "firebase/database";


const ProfileHeader = ({ toggleAvailability, user }) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [image, setImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const uploadBottomSheetRef = useRef(null);
  const saveBottomSheetRef = useRef(null);

  const [cameraStatus, requestCameraPermissions] = ImagePicker.useCameraPermissions();
  const [mediaStatus, requestMediaPermissions] = ImagePicker.useMediaLibraryPermissions();

  const database = getDatabase();

  const toggleSwitch = () => {
    const newAvailability = !isAvailable;
    setIsAvailable(newAvailability);

    if (user) {
      const userAvailabilityRef = ref(database, `users/${user.uid}/availability`);

      set(userAvailabilityRef, newAvailability)
        .then(() => {
          console.log("User availability updated successfully");
          toggleAvailability && toggleAvailability(newAvailability);
        })
        .catch((error) => {
          console.error("Failed updating user availability: ", error);
        });
    }
  };

  useEffect(() => {
    if (user) {
      const imageUrl = user.photoURL || require('../../assets/employeeImage.png');
      setImage(imageUrl);

      const userAvailabilityRef = ref(database, `users/${user.uid}/availability`);
      const unsubscribe = onValue(userAvailabilityRef, (snapshot) => {
        const databaseStatus = snapshot.val();
        setIsAvailable(databaseStatus);
      });

      return () => unsubscribe();
    }
  }, [user, database]);

  const checkCameraPermissions = async () => {
    if (cameraStatus.status !== 'granted') {
      const { status } = await requestCameraPermissions();
      return status === 'granted';
    }

    return true;
  };

  const checkMediaPermissions = async () => {
    if (mediaStatus.status !== 'granted') {
      const { status } = await requestMediaPermissions();
      return status === 'granted';
    }

    return true;
  };

  const takePhotoCamera = async () => {
	  const hasCameraPermission = await checkCameraPermissions();

    if (!hasCameraPermission) {
        Alert.alert(
            'Permission Required',
            'Camera access is needed to take photos. Please enable camera access in the settings.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Settings',
                    onPress: () => Linking.openSettings(),
                },
            ],
        );

        return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setTempImage(result.assets[0].uri);
      uploadBottomSheetRef.current.close();
      setTimeout(() => {
        saveBottomSheetRef.current.open();
      }, 200);
    } else {
      console.log('Camera picking cancelled or no assets returned');
    }
  };

  const choosePhotoLibrary = async () => {
	  const hasMediaPermission = await checkMediaPermissions();

    if (!hasMediaPermission) {
        Alert.alert(
            'Permission Required',
            'Media library access is needed to choose photos. Please enable media access in the settings.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Settings',
                    onPress: () => Linking.openSettings(),
                },
            ],
        );
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setTempImage(result.assets[0].uri);
      uploadBottomSheetRef.current.close();
      setTimeout(() => {
        saveBottomSheetRef.current.open();
      }, 300);
    } else {
      console.log('Library picking cancelled or no assets returned');
    }
  };



  const saveProfilePicture = async () => {
    if (!tempImage || !user) return; 

    const storage = getStorage();
  
    const imageRef = storageRef(storage, `profilePictures/${user.uid}/${Date.now()}`);
    const response = await fetch(tempImage);
    const blob = await response.blob();

    try {
        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);

        await updateProfile(user, {
            displayName: "Jane Q. User",
            photoURL: downloadURL
        });
        console.log("Firebase Auth profile updated");
        console.log("New Image URL:", downloadURL);

        setImage(downloadURL);
    } catch (error) {
        console.error("Failed uploading image and updating profile: ", error);
    }

    setTempImage(null);
    saveBottomSheetRef.current.close();
  };

  const showConfirmationDialog = () => {
    Alert.alert(
      "Discard changes?",
      "If you go back now, you will lose your changes.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Discard", onPress: () => {
            setTempImage(null);
            saveBottomSheetRef.current.close();
          }
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => uploadBottomSheetRef.current.open()} style={styles.profileImageContainer}>
        <Image 
          source={typeof image === 'string' ? { uri: image } : image}
          style={styles.profileImage}
          key={image}
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
        ref={uploadBottomSheetRef}
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
          <TouchableOpacity style={styles.panelButton} onPress={() => uploadBottomSheetRef.current.close()}>
            <Text style={styles.panelButtonTitle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
      <RBSheet 
        ref={saveBottomSheetRef} 
        draggable={true} 
        closeOnPressMask={true} 
        height={700} 
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
          <Text style={styles.panelTitle}>Profile Picture</Text>
          <View style={styles.centeredImageView}>
            <Image source={{ uri: tempImage }} style={{ width: 200, height: 200, borderRadius: 100, marginTop: 120, marginBottom: 145 }} />
          </View>
          <TouchableOpacity style={styles.panelButton} onPress={saveProfilePicture}>
            <Text style={styles.panelButtonTitle}>Save Profile Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.panelButton} onPress={showConfirmationDialog}>
            <Text style={styles.panelButtonTitle}>Close</Text>
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
  },
});

export default ProfileHeader;
