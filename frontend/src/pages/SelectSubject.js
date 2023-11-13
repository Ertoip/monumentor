import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function SelectSubject({ route, navigation }) {
    const selectArg = (arg) => {
        navigation.navigate("ChatPage", {arg: arg});
    }

    return (
        <View style={styles.container}>
            <Text style={styles.Title}>What do you want to talk about?</Text>
            <TouchableOpacity onPress={() => selectArg(route.params.arg1)} style={styles.buttonArgumentSelector}>
                <Text style={styles.Paragraph}>{route.params.arg1}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectArg(route.params.arg2)} style={styles.buttonArgumentSelector}>
                <Text style={styles.Paragraph}>{route.params.arg2}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectArg(route.params.arg3)} style={styles.buttonArgumentSelector}>
                <Text style={styles.Paragraph}>{route.params.arg3}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center vertically
    },
    Title: {
        fontSize: 20, // Adjust the title font size as per your design
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 30 // Add some space below the title
    },
    buttonArgumentSelector: {
        borderWidth: 1.5,
        borderColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        width: '95%', // Adjust the width of your buttons as needed
        marginBottom: 30, // Add some space between buttons
        flex: 0.15,
        justifyContent: "center",
        backgroundColor: "#4D4D4D"
    },
    Paragraph: {
        fontSize: 16, // Adjust the paragraph font size as per your design
        color: 'white',
        textAlign: 'center' // Center text horizontally within the button
    }
});