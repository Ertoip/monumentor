import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 

export default function Button({onPress, icon, color, size}) {
    return(
        <TouchableOpacity onPress={onPress}>
            <AntDesign name={icon} size={size} color={color ? color : "#FFFFFF"}/>
        </TouchableOpacity>
    )
}