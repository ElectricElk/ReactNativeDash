import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions, Switch} from 'react-native';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import {activateKeepAwake} from 'expo-keep-awake';

import Speedometer from './Speedometer';
import DistanceTravelled from './DistanceTraveled';

// import * as firebase from 'firebase';
// import 'firebase/firestore';
//
// const firebaseConfig = {
//   apiKey: 'AIzaSyAiVL6CjmdcnTPhT79mXkCWApej_rKmgCs',
//   authDomain: 'e-elk-cluster.firebaseapp.com',
//   projectId: 'e-elk-cluster',
//   storageBucket: 'e-elk-cluster.appspot.com',
//   messagingSenderId: '667783217458',
//   appId: '1:667783217458:web:52a295eb309f3a6f22d72b',
// };
//
//
// // Initialize Firebase
//
// const app = initializeApp(firebaseConfig);

const App = () => {
  const [speed, setSpeed] = useState(0);
  const [layout, setLayout] = useState('portrait'); //getLayout());
  const [isMetric, setIsMetric] = useState(true);

  useEffect(() => {
    activateKeepAwake(); // Add this line to keep the screen awake

    Dimensions.addEventListener('change', () => {
      setLayout(getLayout());
    });

    (async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);

      if (status === 'granted') {
        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          location => {
            let speed = location.coords.speed || 0;

            if (speed < 0) {
              speed = 0;
            } else {
              speed = (speed * 3.6) //.toFixed(0); // convert m/s to km/h
            }

            setSpeed(speed);
          }
        );
      }
    })();

    return () => {
      Dimensions.removeEventListener('change', () => {
        setLayout(getLayout());
      });
    };

  }, []);

  const getLayout = () => {
    const { width, height } = Dimensions.get('window');
    return width < height ? 'portrait' : 'landscape';
  };

  const flexDirection = layout === 'portrait' ? 'column' : 'row';
  const speedInCurrentUnit = isMetric ? speed : speed / 1.609;
  const maxSpeedInCurrentUnit = isMetric ? 40 : 40 / 1.609;

  return(
    <View style={{ flex: 1, flexDirection: flexDirection }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Speedometer speed={speedInCurrentUnit} totalValue={maxSpeedInCurrentUnit} isMetric={isMetric} />
        <DistanceTravelled speed={speedInCurrentUnit} isMetric={isMetric} isOdo={false} label={"Trip A"} />
        <DistanceTravelled speed={speedInCurrentUnit} isMetric={isMetric} isOdo={true} label={"Odometer"} />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Other Bike information, coming soon</Text>
        <Text>
          Metric Units:
          <Switch
            value={isMetric}
            onValueChange={(newValue) => setIsMetric(newValue)}
          />
        </Text>
      </View>
    </View>
  )
};

export default App;
