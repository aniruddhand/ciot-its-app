import React from 'react';

import { Button,
  View,
  Text,
  StyleSheet,
  ActivityIndicator } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { connectToVehicle, disconnectFromVehicle, STATUS_DICONNECTING } from '../redux/reducers/connectionStateSlice';
import {
  STATUS_CONNECTING,
  STATUS_CONNECTED,
  STATUS_DISCONNECTED } from '../redux/reducers/connectionStateSlice';

const BUTTON_LABEL_DEFAULT  = "CONNECT";
const BUTTON_LABEL_DISCONNECT = "DISCONNECT";

const Home = ({ navigation }) => {
  const connectionStatus = useSelector((state) => state.connection.status);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Welcome to Intelligent Transportation System application - an application bound to make your journey safe.
      </Text>
      <Text style={styles.text}>This application connects with your vehicle and displays vital parameters on the main screen.</Text>
      <Text style={styles.text}>
        Click on Connect to connect with your vehicle.
      </Text>
      <ActivityIndicator animating={connectionStatus === STATUS_CONNECTING 
        || connectionStatus === STATUS_DICONNECTING} size={50} color='#2196F3'/>
      <View style={styles.buttonContainer}>
        {connectionStatus === STATUS_CONNECTED &&
        <Button
          color='#EE0290'
          onPress={()=>{ dispatch(disconnectFromVehicle()) }}
          style={styles.disconnectButton}
          title={BUTTON_LABEL_DISCONNECT} />
        }
        { connectionStatus <= STATUS_CONNECTING &&
        <Button
          color='#6200EE'
          disabled={connectionStatus > STATUS_DISCONNECTED}
          onPress={() => { dispatch(connectToVehicle()) }}
          style={styles.connectButton}
          title={BUTTON_LABEL_DEFAULT} />
        }
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