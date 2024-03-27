import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';


// https://docs.expo.dev/versions/latest/sdk/camera/

export default function ScanningScreen({navigation}) {
  const backendEndpoint = Constants.expoConfig.extra.backendEndpoint;

  const [cameraPermission, setCameraPermission] = Camera.useCameraPermissions();
  const [galleryPermission, setGalleryPermission] = useState(null);

  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  // this function is in shambles
  const permisionFunction = async () => {
    // here is how you can get the camera permission
    // const cameraPermission = await Camera.getCameraPermissionsAsync();
    
    // setCameraPermission(cameraPermission.status === 'granted');

    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    // console.log("image: " + imagePermission.status);
    // console.log("camera: " + cameraPermission.status);

    setGalleryPermission(imagePermission.status === 'granted');

    if (
      imagePermission.status !== 'granted'
      // cameraPermission.status !== 'granted'
    ) {
      // alert('Permission for media access needed.');
    }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

  const sendImageToBackend = async (uri) => { //uri comes in
    // Convert the image to Base64
    console.log("here " + uri)
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    const base64Image = `data:image/jpeg;base64,${base64}`;

    console.log("in sendImageToBackend2")

    axios.post(`http://${backendEndpoint}/upload`, {
      image: base64Image
    })
    .then((response) => {
      console.log('Image uploaded successfully:', response.data);
    })
    .catch((error) => {
      console.error('Error uploading image:', error);
    });
  };

  const takePicture = async () => {
    if (camera) {
      // Make sure to wait for the onCameraReady callback before calling this method.
      camera.takePictureAsync({ onPictureSaved: onPictureSaved });      
    }
  };

  const onPictureSaved = (photo) => {
    setImageUri(photo.uri);
    sendImageToBackend(photo.uri)
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      // base64: true,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
      sendImageToBackend(result.assets[0].uri)
    }
  };

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={'1:1'}
        />
      </View>

      <Button title={'Flip'} onPress={toggleCameraType} />
      <Button title={'Take Picture'} onPress={takePicture} />
      <Button title={'Gallery'} onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ flex: 1 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  button: {
    flex: 0.1,
    padding: 10,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
});