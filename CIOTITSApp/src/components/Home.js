import React, { useEffect, useState } from 'react';

import { Button,
  View,
  Text,
  StyleSheet,
  ActivityIndicator, 
  ToastAndroid} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { connectToVehicle } from '../redux/reducers/connectionStateSlice';
import {
  STATUS_DISCONNECTED,
  STATUS_CONNECTING,
  STATUS_DISCOVERING,
  STATUS_CONNECTED,
  STATUS_DICONNECTING,
  STATUS_FAILED } from '../redux/reducers/connectionStateSlice';

const BUTTON_LABEL_DEFAULT  = "Start";

const Home = ({ navigation }) => {
  const [ loading, setLoading ] = useState(true);
  const connectionStatus = useSelector((state) => state.connection.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if (connectionStatus === STATUS_FAILED) {
      ToastAndroid.showWithGravity('Connection failed! Please try again.',
        ToastAndroid.LONG, ToastAndroid.CENTER);

    } else if (connectionStatus === STATUS_CONNECTING
      || connectionStatus === STATUS_DISCOVERING) {
      ToastAndroid.showWithGravity('Connecting, please wait...',
        ToastAndroid.SHORT, ToastAndroid.CENTER);

    } else if (connectionStatus === STATUS_DICONNECTING) {
      ToastAndroid.showWithGravity('Disconnecting...',
        ToastAndroid.SHORT, ToastAndroid.CENTER);
    }

    if (connectionStatus === STATUS_CONNECTED) {
      setTimeout(() => {
        navigation.navigate('DrivingAssistance');
      }, 800);
    }
  }, [ connectionStatus ]);

  useEffect(() => {
    if (!loading) {
      return
    }
    setLoading(false);
  });

  const showIndicator = (loading ||
                          (connectionStatus === STATUS_CONNECTING) || 
                          (connectionStatus === STATUS_DICONNECTING));

  const disabled = (loading ||
      (connectionStatus === STATUS_DICONNECTING) ||
      (connectionStatus > STATUS_DISCONNECTED));

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Welcome to Intelligent Transportation System application - an application bound to make your journey safe and enjoyable.
      </Text>
      <Text style={styles.text}>This application connects with your vehicle and displays vital parameters on the main screen.</Text>
      <Text style={styles.text}>
        Click on Connect to connect with your vehicle.
      </Text>
      <ActivityIndicator
        animating={showIndicator}
        size={50} color='#2196F3'/>
      <View style={styles.buttonContainer}>
        <Button
          disabled={disabled}
          onPress={() => { dispatch(connectToVehicle()) }}
          style={styles.connectButton}
          title={BUTTON_LABEL_DEFAULT} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 15,
  },
  text: {
    marginBottom: 10,
    flexGrow: 0
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column-reverse',
    alignItems: 'center',
    flexGrow: 1
  },
  connectButton: {
    
  },
  disconnectButton: {
    
  }
});

export default Home;