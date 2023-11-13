
import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraPage from './src/pages/CameraPage'
import LoadingPage from './src/pages/loadingPage';
import SelectSubject from './src/pages/SelectSubject';
import ChatPage from './src/pages/ChatPage';
import TutorialPage from './src/pages/TutorialPage';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CameraPage" screenOptions={{headerShown: false,}}>
        
        <Stack.Screen name='TutorialPage' component={TutorialPage}/>
        <Stack.Screen name="CameraPage" component={CameraPage} />
        <Stack.Screen name="LoadingPage" component={LoadingPage} />
        <Stack.Screen name='SelectSubject' component={SelectSubject}/>
        <Stack.Screen name='ChatPage' component={ChatPage}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;