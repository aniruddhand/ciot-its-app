import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { PermissionsAndroid, ToastAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Provider } from 'react-redux';
import store from './redux/store'

import Home from './components/Home';
import Profile from './components/Profile';

const ITSApp = () => {
  const Stack = createStackNavigator();

  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN);
  });

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          headerMode="screen">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{title: 'Intelligent Transportation System', }}/>
          <Stack.Screen
            name="Profile"
            component={Profile}/>
        </Stack.Navigator>
      </NavigationContainer>
      </Provider>
  )
}

export default ITSApp;