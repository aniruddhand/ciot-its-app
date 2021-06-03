import React, { useEffect, useState } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, View, StyleSheet, ActivityIndicator } from 'react-native';

import Geolocation from 'react-native-geolocation-service';

import { useDispatch, useSelector } from 'react-redux';
import { disconnectFromVehicle } from '../redux/reducers/connectionStateSlice';
import {
  STATUS_DISCONNECTED,
  STATUS_DISCONNECTING,
  STATUS_CONNECTED } from '../redux/reducers/connectionStateSlice';

const BUTTON_LABEL_DISCONNECT = "End";

const DrivingAssistance = ({ navigation, route }) => {
  const [ currentLocation, setCurrentLocation] = useState(undefined);
  const connectionStatus = useSelector(state => state.connection.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if (connectionStatus === STATUS_DISCONNECTING) {
      ToastAndroid.showWithGravity('Disconnecting...',
        ToastAndroid.SHORT, ToastAndroid.CENTER);
    }

    if (connectionStatus === STATUS_DISCONNECTED) {
      setTimeout(() => {
        navigation.navigate('Home');
      }, 800);
    }
  }, [ connectionStatus ]);

  useEffect(() => {
    if (connectionStatus != STATUS_CONNECTED) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => setCurrentLocation(position),
      error => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });

  return (
    <View style={styles.container}>
      {currentLocation &&
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
        loadingEnabled={true}
        loadingIndicatorColor='#EE0290'
        minZoomLevel={18}
        region={{...currentLocation.coords, latitudeDelta: 0.015, longitudeDelta: 0.0121}}/>}
      <ActivityIndicator
        animating={connectionStatus === STATUS_DISCONNECTING}
        size={50} color='#2196F3'/>
      <View style={styles.buttonContainer}>
        <Button
          disabled={connectionStatus != STATUS_CONNECTED}
          color='#E51C23'
          onPress={()=>{ dispatch(disconnectFromVehicle()) }}
          style={styles.disconnectButton}
          title={BUTTON_LABEL_DISCONNECT} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    padding: 15
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column-reverse',
    alignItems: 'center',
    flexGrow: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

export default DrivingAssistance;