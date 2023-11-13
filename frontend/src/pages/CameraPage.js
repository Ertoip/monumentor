import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from '../components/button';
import { useIsFocused } from '@react-navigation/native';

export default function CameraPage({ navigation }) {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  const [flashBackgroundColor, setFlashBackgroundColor] = useState("transparent");
  const isFocused = useIsFocused();

  const cameraClicked = async () => {
    if (cameraRef) {
      try {
        // Change the background color briefly to simulate a flash
        setFlashBackgroundColor("rgba(0, 0, 0, 0.8)");
        setTimeout(() => {
          setFlashBackgroundColor("transparent");
        }, 200); // Change it back to transparent
        const data = await cameraRef.current.takePictureAsync({
          fixOrientation: false,
          skipProcessing: false,
          width: 1920,
        })


        navigation.navigate("LoadingPage", {uri: data.uri});

      } catch (e) {
        console.error(e);
      }
    }

  };

  const questionClicked = async () => {
    navigation.navigate("TutorialPage");
  };

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === "granted");
      setType()
    })();
  }, []);

  if (cameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Button icon="questioncircleo" size={40} style={styles.questionButton} onPress={questionClicked}></Button>
        <Button icon="questioncircleo" size={40} style={styles.questionButton} onPress={questionClicked}></Button>
      </View>
      <View style={styles.cameraContainer}>
        {isFocused && <Camera style={styles.camera} type={type} ref={cameraRef} ratio='16:9'>
          <TouchableOpacity
            onPress={cameraClicked}
            style={[
              styles.TouchableOpacity,
              { backgroundColor: flashBackgroundColor } // Change background color based on flashBackgroundColor
            ]}
          >
          </TouchableOpacity>
        </Camera>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignContent: "center",
    flex: 1,
    backgroundColor: '#000',
    padding: 10
  },
  cameraContainer: {
    flex: 0.85,
    alignSelf: "center",
    marginBottom: 5,
    borderWidth: 3,
    borderColor: "#FFF",
    borderRadius: 20,
    overflow: 'hidden',
    aspectRatio: 9/16
  },
  camera: {
    flex: 1
  },
  topBar: {
    flex: 0.11,
    textAlign: "center",
    flexDirection: "row",
    alignItems: 'flex-end',       // Vertically center the content
    justifyContent:"space-between", // Push the button to the right
    width: "80%",
    marginLeft: "10%",
    marginBottom: 16
  },
  questionButton: {
    height: '100%', // Ensure the button takes up the full height of the top row
    paddingRight: 50
  },
  TouchableOpacity: {
    flex: 1,
  }
});