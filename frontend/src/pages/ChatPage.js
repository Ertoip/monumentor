import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'react-native-uuid';

export default function ChatPage({ route, navigation }) {
    const [message, setMessage] = useState(''); // State to store the message
    const [messages, setMessages] = useState([]); // State to store all messages
    const [readOnly, setReadOnly] = useState(false);
    const scrollViewRef = useRef();
    const [loading, setLoading] = useState(true); // Initially set to true
    const [uiid, setUiid] = useState("")

    const IP = "192.168.230.44"

    const sendMessage = async () => {
        if (message.trim() === '') {
            return; // Exit early if the message is empty
        }
    
        const userMessage = { content: message, role: "user" };
        
        // Disable input field while sending
        setReadOnly(true);
        
        try {
            // Append the new user message to the messages array
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            setMessage(''); // Clear the input field
                        
            // Send the messages array to a FastAPI endpoint
            const response = await fetch('http://192.168.230.44:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userMessage: userMessage, argument: route.params.arg, uiid: await uiid }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Parse the response JSON
            const responseData = await response.json();

            // Add the AI response message to the messages array
            const aiMessage = { content: responseData, role: "assistant" };
            setMessages((prevMessages) => [...prevMessages, aiMessage]);
    
            // Scroll to the end of the ScrollView
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true });
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            // Re-enable input field
            setReadOnly(false);
        }
    };

    const checkAndGenerateUUID = async () => {
        try {
          // Check if the UUID exists in AsyncStorage
            let uid = AsyncStorage.getItem('userId');
            if (await !uid) {
                // If it doesn't exist, generate a new UUID
                uid = uuidv4();
                
                // Store the generated UUID in AsyncStorage
                AsyncStorage.setItem('userId', uid);
            }

            setUiid(uid);
            return uid
        } catch (error) {
          // Handle errors (e.g., AsyncStorage not available)
            console.error('Error:', error);
            return null; // Return null in case of an error
        }
    };

    useEffect(() => {
        // Function to initialize the chat when the component mounts
        const initChat = async () => {
            try {
                let uiidTemp = await checkAndGenerateUUID();
                console.log(await uiidTemp)
                // Send a request to the initChat endpoint with route params arg as data
                const response = await fetch('http://192.168.230.44:8000/initChat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ argument: route.params.arg, uiid: uiidTemp }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Parse the response JSON
                const responseData = await response.json();

                // Extract the result and articles from the response
                const { result } = responseData;

                // Create a new array of messages, including the AI response
                const aiMessage = { content: result, role: "assistant" };
                const updatedMessages = [...messages, aiMessage];

                // Update the state with the new messages
                setMessages(updatedMessages);

                // Scroll to the end of the ScrollView
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollToEnd({ animated: true });
                }

                // Set loading to false after the initial response is received
                setLoading(false);
            } catch (error) {
                console.error('Error initializing chat:', error);
            }
        };

        // Call the initChat function when the component mounts
        initChat();
    }, []); // Empty dependency array ensures this effect runs only once on mount    

    return (
        <View style={styles.container}>
            <Spinner
                visible={loading} // Show spinner when loading is true
                textStyle={styles.spinnerText}
            />
            <FlatList
                style={styles.chats}
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={item.role === "user" ? styles.chatBubbleUser : styles.chatBubbleAi}>
                        <Text style={styles.chatText}>{item.content}</Text>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 60 }}
                onContentSizeChange={() => {
                    if (scrollViewRef.current) {
                        scrollViewRef.current.scrollToEnd({ animated: true });
                    }
                }}
                ref={scrollViewRef}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    onSubmitEditing={sendMessage}
                    multiline={true}
                    numberOfLines={2}
                    blurOnSubmit={false}
                    editable={!readOnly} // Use editable prop instead of readOnly
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.chatText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end', // Place the input and chats at the bottom of the screen
        padding: 10,
        backgroundColor: '#000',
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
        borderWidth: 1,
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
    },
    spinnerText: {
        color: '#FFF',
    },
});



//          __
//          /
//         /             ___
//        /\           <___< 
//      _/_ \           /
//           \/--------/---------\
//    _____  /                    \  _____
//   /     \/                      \/     \
//  /       \                      /       \
// |    *    |                    |    *    |           
//  \       /                      \       /
//   \_____/                        \_____/
