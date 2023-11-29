import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../main/screens/HomeScreen';
import ProfileScreen from '../main/screens/ProfileScreen';
import Icon from 'react-native-vector-icons/AntDesign';

const BottomTab = createBottomTabNavigator();

const BottomTabNav = () => {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 14,
          color: '#000',
          textAlign: 'center',
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 55,
        },
        tabBarActiveTintColor: 'blue',
      }}>
      <BottomTab.Screen
        name="home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size, focused}) => (
            <Icon
              name="home"
              size={25}
              color={focused ? '#000000' : 'gray'}
              style={
                {
                  // paddingHorizontal: 10,
                  // marginLeft: -10,
                }
              }
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size, focused}) => (
            <Icon
              name="user"
              size={25}
              color={focused ? '#000000' : 'gray'}
              style={
                {
                  // paddingHorizontal: 10,
                  // marginLeft: -10,
                }
              }
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabNav;
