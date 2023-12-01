import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import GlobalStackNav from './src/navigations/GlobalStackNav';
import {AppContext} from './src/context/AppContext';
import moment from 'moment';

const App = () => {
  const [globalData, setGlobalDate] = useState({
    holidaysList: [
      {
        date: '2023-11-14',
        title: 'Holiday1',
      },
      {
        date: '2023-11-27',
        title: 'Holiday2',
      },
      {
        date: '2023-12-06',
        title: 'Holiday3',
      },
      {
        date: '2023-12-25',
        title: 'New Year',
      },
      {
        date: '2024-01-01',
        title: 'New Year',
      },
    ],
    minDate: null,
    maxDate: null,
  });

  useEffect(() => {
    minMaxDateHandler();
  }, []);

  function minMaxDateHandler() {
    let todayDate = moment(new Date()).format('YYYY-MM-DD');
    const endMonth = moment().month('March').format('MM');
    const startMonth = moment().month('April').format('MM');

    if (moment(todayDate).format('MM') >= startMonth) {
      let year = moment(todayDate).format('YYYY');
      let year2 = moment(todayDate).add(1, 'year').format('YYYY');
      setGlobalDate(prev => ({
        ...prev,
        minDate: `${year}-${startMonth}-01`,
        maxDate: `${year2}-${endMonth}-31`,
      }));
    }

    if (endMonth >= moment(todayDate).format('MM')) {
      let year = moment(todayDate).format('YYYY');
      let year2 = moment(todayDate).subtract(1, 'year').format('YYYY');
      setGlobalDate(prev => ({
        ...prev,
        minDate: `${year2}-${startMonth}-01`,
        maxDate: `${year}-${endMonth}-31`,
      }));
    }
  }
  return (
    <AppContext.Provider value={{globalData, setGlobalDate}}>
      <NavigationContainer>
        <GlobalStackNav />
      </NavigationContainer>
    </AppContext.Provider>
  );
};

export default App;
