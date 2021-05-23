import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import ProfileScreen from './components/ProfileScreen';
import { Provider } from 'react-redux';
import store from './redux/store'

const ITSApp = () => {
  const Stack = createStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'Welcome'}}/>
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
      </Provider>
  )
}

export default ITSApp;