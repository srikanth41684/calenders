import {View, Text} from 'react-native';
import React from 'react';

const CustomDayComponent = ({date, state}) => {
  console.log('{date, state}-------->', date, state);
  return (
    <View>
      <Text>CustomDayComponent</Text>
    </View>
  );
};

export default CustomDayComponent;
