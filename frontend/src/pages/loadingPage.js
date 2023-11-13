import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-crop-picker';

export default function LoadingPage({ route, navigation }) {
    const [isLoading, setIsLoading] = useState(true);
    const inference = new HfInference("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");
    const IP = "192.168.230.44"

    useEffect(() => {
        const asyncFunction = async () => {
            try {
                console.log("start");
                const uri = route.params.uri;
        
                // Use ImagePicker to crop and resize the image
                const imageInfo = await ImagePicker.openCropper({
                    path: uri,
                    width: 256,
                    height: 256,
                });
                
                console.log("image")

                // Convert the cropped and resized image data to a Blob
                const imagedata = new Blob([imageInfo.data], { type: 'image/jpeg' });

                // Send the image to your FastAPI backend
                const formData = new FormData();
                formData.append('file', imagedata);
                
                const response = await fetch(`http://${IP}:8000/classify`, {
                    method: 'POST',
                    body: formData,
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
        
                    setIsLoading(false); // Set isLoading to false once classification is done
                    navigation.navigate("SelectSubject", { arg1: data.label1, arg2: data.label2, arg3: data.label3 });
                } else {
                    throw new Error('Image classification failed');
                }
                
            } catch (error) {
                console.error(error);
                setIsLoading(false); // Handle errors and set isLoading to false
            }
        }

        asyncFunction();
    }, []);

    return (
        <View style={styles.container}>
            {/* Place the button above other elements */}
            <Image style={styles.image} source={{ uri: route.params.uri }} blurRadius={10} />
            <Animated.View style={[styles.coverImage]} />
            <Spinner
                visible={isLoading}
                textContent={'Thinking...'}
                textStyle={{ color: '#FFF' }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: '#000',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 1,
    },
    coverImage: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'absolute',
        zIndex: 2,
    },
});