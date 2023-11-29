import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNav from './BottomTabNav';
import ApplyLeaveScreen from '../main/screens/ApplyLeaveScreen';

const GlobalStack = createNativeStackNavigator();

const GlobalStackNav = () => {
  return (
    <GlobalStack.Navigator>
      <GlobalStack.Screen
        name="bottomTab"
        component={BottomTabNav}
        options={{headerShown: false}}
      />
      <GlobalStack.Screen
        name="applyLeave"
        component={ApplyLeaveScreen}
        options={{headerShown: false}}
      />
    </GlobalStack.Navigator>
  );
};

export default GlobalStackNav;
