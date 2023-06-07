import React from 'react';
import { View, Text } from 'react-native';
import Speedometer from 'react-native-speedometer-chart';

const SpeedometerComponent = ({ speed, totalValue, isMetric }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Speedometer value={speed} totalValue={totalValue} />
    <Text>{`Speed: ${speed.toFixed(0)} ${isMetric ? 'km/h' : 'mph'}`}</Text>
  </View>
);

export default SpeedometerComponent;
