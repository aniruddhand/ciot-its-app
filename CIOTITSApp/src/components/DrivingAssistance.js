import React, { useEffect, useState } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, View, StyleSheet, ActivityIndicator, Text } from 'react-native';

import Geolocation from 'react-native-geolocation-service';

import { useDispatch, useSelector } from 'react-redux';
import { disconnectFromVehicle, STATUS_CONNECTING } from '../redux/reducers/connectionStateSlice';
import {
  STATUS_DISCONNECTED,
  STATUS_DISCONNECTING,
  STATUS_CONNECTED } from '../redux/reducers/connectionStateSlice';

import { NativeEventEmitter } from 'react-native';

import BLEModule from '../native/BLEModule';

const { VEHICLE_STATUS_EVENT } = BLEModule.getConstants();
const eventEmitter = new NativeEventEmitter(BLEModule);

const BUTTON_LABEL_DISCONNECT = "End";

const DrivingAssistance = ({ navigation, route }) => {
  const [ currentLocation, setCurrentLocation] = useState(undefined);
  const [ vehicleData, setVehicleData ] = useState({vehicleID: undefined, temperature: -1});

  const connectionStatus = useSelector(state => state.connection.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if (connectionStatus === STATUS_DISCONNECTING) {
      ToastAndroid.showWithGravity('Disconnecting...',
        ToastAndroid.SHORT, ToastAndroid.CENTER);
    }

    if (connectionStatus === STATUS_DISCONNECTED) {
      eventEmitter.removeAllListeners(VEHICLE_STATUS_EVENT);

      setTimeout(() => {
        navigation.navigate('Home');
      }, 800);
    }

    if (connectionStatus === STATUS_CONNECTING
      || connectionStatus === STATUS_CONNECTED) {
      
      eventEmitter.addListener(VEHICLE_STATUS_EVENT, (vehData) => {
        if (!vehData) {
          console.error("Vehicle data was empty or null!");
        }

        setVehicleData(JSON.parse(vehData));
      });
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
      { enableHighAccuracy: true, interval: 5000, timeout: 15000, maximumAge: 10000 }
    );
  });

  return (
    <View style={styles.container}>
      {currentLocation &&
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        showsPointsOfInterest={false}

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
      <View style={styles.floatingPanel}>
        <View style={styles.kpiItemsContainer}></View>
        <View style={styles.kpiContainer}>
          {vehicleData.temperature > 0 && 
          <Text style={styles.kpi}>{vehicleData.temperature}&#176;</Text>}
          {vehicleData.temperature < 0 &&
          <Text style={styles.kpi}></Text>}
          <Text style={styles.kpiHeader}>Temperature</Text>
        </View>
        <View style={styles.kpiContainer}>
          <Text style={styles.kpi}>{currentLocation ? Math.floor(currentLocation.coords.speed * 1.609) : 0}</Text>
          <Text style={styles.kpiHeader}>Speed</Text>
        </View>
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
  },
  floatingPanel: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    bottom: 10,
    right: 10
  },
  kpiItemsContainer: {
    backgroundColor: 'blue',
    opacity: 0.6,
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'white',
    opacity: 0.4,
    width: 80
  },
  kpiContainer: {
    paddingBottom: 25,
    alignItems: 'center'
  },
  kpiHeader: {
    fontWeight: 'bold',
    color: '#555555',
    fontSize: 12,
    zIndex: 100
  },
  kpi: {
    fontSize: 24,
    zIndex: 100
  }
});

export default DrivingAssistance;