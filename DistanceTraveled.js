import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DistanceTravelled = ({speed, isMetric, isOdo, label}) => {
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    (async () => {
      const storedDistance = await AsyncStorage.getItem(label);
      if (storedDistance !== null) {
        setDistance(parseFloat(storedDistance));
      } else {
        setDistance(0);
      }
    })();

    const intervalId = setInterval(() => {
      setDistance((prevDistance) => {
        const newDistance = prevDistance + speed / (isMetric ? 3600 : 3600 / 1.609);
        AsyncStorage.setItem(label, newDistance.toString());
        return newDistance;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [speed, isMetric, label]);

  const resetDistance = async () => {
    setDistance(0);
    await AsyncStorage.setItem(label, '0');
  };

  return (
    <View>
      <Text>{`${label}: ${distance.toFixed(2)} ${
        isMetric ? 'km' : 'miles'
      }`}</Text>
      {!isOdo && <Button title="Reset" onPress={resetDistance} />}
    </View>
  );
};

export default DistanceTravelled;
