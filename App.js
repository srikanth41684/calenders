import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import GlobalStackNav from './src/navigations/GlobalStackNav';

const App = () => {
  return (
    <NavigationContainer>
      <GlobalStackNav />
    </NavigationContainer>
  );
};

export default App;
