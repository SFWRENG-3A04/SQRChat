import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Image, Switch, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';

const ProfileHeader = ({ onToggleAvailability, opacity }) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const bottomSheetModalRef = useRef(null);

  const toggleSwitch = () => {
    setIsAvailable(!isAvailable);
    onToggleAvailability(!isAvailable);
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

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };

  const renderContent = () => (
    <View style={styles.shadowContainer}>
        <View style={styles.panel}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
            <Text style={styles.panelButtonTitle}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibrary}>
            <Text style={styles.panelButtonTitle}>Choose From Library</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.panelButton} onPress={() => bottomSheetModalRef.current?.dismiss()}>
            <Text style={styles.panelButtonTitle}>Cancel</Text>
        </TouchableOpacity>
        </View>
    </View>
  );

  const snapPoints = useMemo(() => ['25%', '50%'], []);

  return (
    <BottomSheetModalProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={handlePresentModalPress} style={styles.profileImageContainer}>
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
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            children={renderContent()}
          />
        </View>
      </GestureHandlerRootView>
    </BottomSheetModalProvider>
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
    backgroundColor: '#FFFFFF',
  },
  panelTitle: {
    fontSize: 25,
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#6FBAFF',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  
});

export default ProfileHeader;
