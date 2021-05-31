import React, { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import BLEModule from '../services/BLEModule';

const BUTTON_LABEL_DEFAULT  = "CONNECT";
const BUTTON_LABEL_SCANNING = "SCANNING";
const BUTTON_LABEL_PAIRING  = "PAIRING";

const Home = ({ navigation }) => {
  const [ buttonDisabled, setButtonDisabled ] = useState(false);
  const [ buttonLabel, setButtonLabel ] = useState(BUTTON_LABEL_DEFAULT);
  const [ showIndicator, setShowIndicator ] = useState(false);

  useEffect(() => {
    setShowIndicator(buttonDisabled)
  }, [buttonDisabled]);
  
  function bindWithVehicle() {
    BLEModule.connectToVehicle(() => {
    }, () => {
    });

    setTimeout(() => {
      setButtonDisabled(false);
      setButtonLabel(BUTTON_LABEL_DEFAULT);

    }, 3000);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Welcome to Intelligent Transportation System application - an application bound to make your journey safe.
      </Text>
      <Text style={styles.text}>This application connects with your vehicle and displays vital parameters on the main screen.</Text>
      <Text style={styles.text}>
        Click on Connect to connect with your vehicle.
      </Text>
      <ActivityIndicator animating={showIndicator} size={50} color='#2196F3'/>
      <View style={styles.buttonContainer}>
        <Button
          disabled={buttonDisabled}
          onPress={ () => {
            setButtonDisabled(true);
            setButtonLabel(BUTTON_LABEL_SCANNING);

            bindWithVehicle()
          }}
          style={styles.connectButton}
          title={buttonLabel}
          />
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
  }
});

export default Home;