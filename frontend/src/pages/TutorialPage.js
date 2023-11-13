import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import Button from '../components/button';
import { AntDesign } from '@expo/vector-icons'; 
import { Animated, Easing } from 'react-native';

export default function TutorialPage({ navigation }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [animatedBackgroundColor] = useState(new Animated.Value(0));

    const handlePageChange = (event) => {
        const { position } = event.nativeEvent;
        setCurrentPage(position);
    };

    const animateBackgroundColor = () => {
        Animated.sequence([
            Animated.timing(animatedBackgroundColor, {
                toValue: 1,
                duration: 600, // 1 second
                easing: Easing.ease,
                useNativeDriver: false, // Set to true if using Hermes engine
            }),
            Animated.delay(600),
            Animated.timing(animatedBackgroundColor, {
                toValue: 0,
                duration: 600, // 1 second
                easing: Easing.ease,
                useNativeDriver: false, // Set to true if using Hermes engine
            }),
        ]).start();
    };

    useEffect(() => {
        if (currentPage === 3) { 
            navigation.navigate('CameraPage');
        }
    }, [currentPage]);

    useEffect(() => {
        animateBackgroundColor();

        const intervalId = setInterval(() => {
            animateBackgroundColor();
        }, 3000);
    
        return () => clearInterval(intervalId); // Clean up on component unmount
    }, []);
    
    return (
        <View style={styles.container}>
            <PagerView style={styles.viewPager} initialPage={0} onPageSelected={handlePageChange}>
                
                <View style={styles.page} key="1">
                    <View style={styles.textSection}>
                        <Text style={styles.text}>First take a picture of the object you want to scan by pressing the camera on your screen</Text>
                    </View>
                    <View style={styles.exampleSection}>
                        <View style={styles.pageExample}>
                            <View style={styles.topBar}>
                                <AntDesign name="questioncircleo" size={35} color="#FFFFFF"/>
                                <AntDesign name="questioncircleo" size={35} color="#FFFFFF"/>
                            </View>

                            <View style={styles.cameraContainer}>
                                <Animated.View
                                    style={[
                                    styles.cameraBackground,
                                    {
                                        backgroundColor: animatedBackgroundColor.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['black', '#FFFFFF'],
                                        }),
                                    },
                                    ]}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                
                <View style={styles.page} key="2">
                    <View style={styles.textSection}>
                        <Text style={styles.text}>Choose the desired subject among the list</Text>
                    </View>
                    <View style={styles.exampleSection}>
                        <View style={styles.pageExample}>
                            <View style={styles.titleExample}></View>
                            <View style={styles.buttonArgumentSelector}>
                                <Animated.View
                                    style={[
                                    styles.cameraBackground,
                                    {
                                        backgroundColor: animatedBackgroundColor.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['black', '#FFFFFF'],
                                        }),
                                    },
                                    ]}
                                />
                            </View>
                            <View style={styles.buttonArgumentSelector}>
                                <Animated.View
                                    style={[
                                    styles.cameraBackground,
                                    {
                                        backgroundColor: animatedBackgroundColor.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['black', '#FFFFFF'],
                                        }),
                                    },
                                    ]}
                                />
                            </View>
                            <View style={styles.buttonArgumentSelector}>
                                <Animated.View
                                    style={[
                                    styles.cameraBackground,
                                    {
                                        backgroundColor: animatedBackgroundColor.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['black', '#FFFFFF'],
                                        }),
                                    },
                                    ]}
                                />
                            </View>

                        </View>
                    </View>
                </View>
                
                <View style={styles.page} key="3">
                    <View style={styles.textSection}>
                        <Text style={styles.text}>Chat with the assistant by sending messages</Text>
                    </View>
                    <View style={styles.exampleSection}>
                        {/* Example content */}
                        <View style={styles.chatPageExample}>
                            <View style={styles.chats}>
                                <View style={styles.chatBubbleAi}>
                                    <View style={styles.fakeText}></View>
                                    <View style={styles.fakeText}></View>

                                </View>
                                <View style={styles.chatBubbleUser}>
                                    <View style={styles.fakeText}></View>
                                </View>
                                <View style={styles.chatBubbleAi}>
                                    <View style={styles.fakeText}></View>

                                </View>
                                <View style={styles.chatBubbleUser}>
                                    <View style={styles.fakeText}></View>
                                    <View style={styles.fakeText}></View>

                                </View>
                                <View style={styles.chatBubbleAi}>
                                    <View style={styles.fakeText}></View>
                                    <View style={styles.fakeText}></View>
                                    <View style={styles.fakeText}></View>
                                </View>
                            </View>
                            <View style={styles.inputContainer}>
                                <View style={styles.input}></View>
                                <View style={styles.sendButton}>
                                    <Animated.View
                                        style={[
                                        styles.cameraBackground,
                                        {
                                            backgroundColor: animatedBackgroundColor.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['transparent', '#FFFFFF'],
                                            }),
                                        },
                                        ]}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.page} key="4">
                    {/* final page return to camera */}
                </View>
            </PagerView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: '#000',
    },
    viewPager: {
        flex: 1,
    },
    page: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',
    },
    textSection: {
        flex: 0.2,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: "90%"
    },
    exampleSection: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        width: "90%"
    },
    text: {
        color: "#FFFFFF",
        fontSize: 14,
        textAlign: "center"
    },
    pageExample: {
        height: 580,
        width: 326,
        borderColor: "#FFFFFF",
        borderRadius: 25,
        borderWidth: 3,
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center vertically
        paddingLeft:15,
        paddingRight: 15,
        paddingBottom: 10
    },
    cameraContainer: {
        flex: 1,
        borderWidth: 2,
        borderColor: "#FFF",
        borderRadius: 20,
        overflow: 'hidden',
        width:"100%",
    },
    topBar: {
        flex: 0.1,
        textAlign: "center",
        flexDirection: "row",
        alignItems: 'flex-end',       // Vertically center the content
        justifyContent:"space-between", // Push the button to the right
        width: "80%",
        marginBottom: 16
    },
    questionButton: {
        height: '100%', // Ensure the button takes up the full height of the top row
    },
    cameraBackground: {
        flex: 1,
        opacity: 0.33, // Set your desired initial opacity
        width: "110%"
    },
    titleExample: {
        borderWidth: 8,
        borderColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        width: '95%', // Adjust the width of your buttons as needed
        justifyContent: "center",
        marginBottom: 20
    },
    buttonArgumentSelector: {
        borderWidth: 2,
        borderColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        width: '95%', // Adjust the width of your buttons as needed
        flex: 0.2,
        justifyContent: "center",
        marginBottom: 20
    },
    
    chatPageExample: {
        height: 580,
        width: 326,
        borderColor: "#FFFFFF",
        borderRadius: 25,
        borderWidth: 3,
        justifyContent: 'flex-end', // Place the input and chats at the bottom of the screen
        paddingLeft:15,
        paddingRight: 15,
        paddingBottom: 10
    },
    chats: {
        flex: 1, // Allow chats to take up the available space
        marginBottom: 10,
        marginTop: 20,
        overflow: 'hidden',

    },
    chatBubbleAi: {
        backgroundColor: '#323232',
        borderRadius: 15,
        padding: 10,
        marginVertical: 4,
        minWidth: "70%",
        width:"auto",
        maxWidth:"80%",
        marginLeft: "1%",
        borderColor: "#393939",
        borderWidth: 1,
    },
    chatBubbleUser: {
        backgroundColor: '#14C9CC',
        borderRadius: 15,
        padding: 10,
        marginVertical: 8,
        minWidth: "70%",
        width: "auto",
        maxWidth: "80%",
        marginLeft: "1%",
        borderColor: "#00B0B3",
        borderWidth: 1,
        alignSelf: "flex-end",
        shadowColor: '#14C9CC', // Color of the glow
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1, // Opacity of the glow
        shadowRadius: 20, // Radius of the glow
        elevation: 10, // For Android shadow
    },
    chatText:{
        color: "#FFFFFF",
        fontSize: 14
    },
    inputContainer: {
        flexDirection: 'row', // Arrange the TextInput and Send button in a row
        alignItems: 'center', // Vertically center them
        marginBottom: 10,
    },
    input: {
        flex: 1, // Take up the remaining space
        height: 40,
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginRight: 10, // Add some spacing between TextInput and Send button
        color: "#FFFFFF"
    },
    sendButton: {
        backgroundColor: '#14C9CC',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 60, // Set a fixed width for the Send button
        borderRadius: 8,
        overflow: "hidden"
    },
    fakeText: {
        borderWidth: 4,
        borderColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        width: 200, // Adjust the width of your buttons as needed
        justifyContent: "center",
        marginBottom: 5,
        alignSelf: "flex-end",
        marginTop: 3
    }
});