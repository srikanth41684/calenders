import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {AppContext} from '../../context/AppContext';

const ApplyLeaveScreen = props => {
  const customNavigation = useNavigation();
  const {globalData} = useContext(AppContext);
  const [commObj, setCommObj] = useState({
    fromDate: new Date(props.route.params.date),
    toDate: new Date(props.route.params.date),
    reason: '',
    numberOfDays: 0,
    formDatePicker: false,
    toDatePicker: false,
    maxDate: null,
    leaveData: [],
  });

  useEffect(() => {
    getLeaveDataHandler();
  }, []);

  const getLeaveDataHandler = async () => {
    let leaveData = await AsyncStorage.getItem('apply-leave');
    let data = JSON.parse(leaveData);
    setCommObj(prev => ({
      ...prev,
      leaveData: data !== null ? data : [],
    }));
  };

  // const getLeaveDataHandler = async () => {
  //   let tempArr = [];
  //   let leaveData = await AsyncStorage.getItem('apply-leave');
  //   let data = JSON.parse(leaveData);
  //   if (data) {
  //     data.filter(item => {
  //       tempArr.push(item.fromDate);
  //     });
  //     setCommObj(prev => ({
  //       ...prev,
  //       leaveData: data,
  //     }));
  //   }
  //   setCommObj(prev => ({
  //     ...prev,
  //     leaveStartDates: tempArr,
  //     leaveData: data,
  //   }));
  // };

  const applyLeaveHandler = async () => {
    let obj = {
      fromDate: moment(commObj.fromDate).format('YYYY-MM-DD'),
      toDate: moment(commObj.toDate).format('YYYY-MM-DD'),
      reason: commObj.reason,
      numberOfDays: commObj.numberOfDays,
    };
    if (obj.reason !== '' && obj.numberOfDays > 0) {
      commObj.leaveData.push(obj);
    }

    let sortedDates = commObj.leaveData.sort(
      (a, b) => new Date(a.fromDate) - new Date(b.fromDate),
    );

    await AsyncStorage.setItem('apply-leave', JSON.stringify(sortedDates));
    setCommObj(prev => ({
      ...prev,
      reason: '',
    }));
    customNavigation.goBack();
  };

  // const applyLeaveHandler = async () => {
  //   let array = [
  //     {
  //       fromDate: moment(commObj.fromDate).format('YYYY-MM-DD'),
  //       toDate: moment(commObj.toDate).format('YYYY-MM-DD'),
  //       reason: commObj.reason,
  //       numberOfDays: commObj.numberOfDays,
  //     },
  //   ];
  //   // let leaveData = await AsyncStorage.getItem('apply-leave');
  //   // let data = JSON.parse(leaveData);
  //   if (commObj.leaveData) {
  //     commObj.leaveData.forEach(item => {
  //       array.push(item);
  //     });
  //   }
  //   let sortedDates;
  //   if (array) {
  //     sortedDates = array.sort(
  //       (a, b) => new Date(a.fromDate) - new Date(b.fromDate),
  //     );
  //   }
  //   console.log('sortedDates------->', sortedDates);

  //   await AsyncStorage.setItem('apply-leave', JSON.stringify(sortedDates));
  //   setCommObj(prev => ({
  //     ...prev,
  //     reason: '',
  //   }));
  //   customNavigation.goBack();
  // };

  useEffect(() => {
    const startDate = commObj.fromDate;
    const endDate = commObj.toDate;

    const resultDates = [];
    for (
      let currentDate = new Date(startDate);
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      resultDates.push(moment(new Date(currentDate)).format('YYYY-MM-DD'));
    }

    let newArr = resultDates.filter(
      item =>
        moment(item).format('ddd') !== 'Sun' &&
        moment(item).format('ddd') !== 'Sat' &&
        !globalData.holidaysList.map(holiday => holiday.date).includes(item),
    );

    setCommObj(prev => ({
      ...prev,
      numberOfDays: newArr.length,
    }));
  }, [commObj.fromDate, commObj.toDate]);

  // useEffect(() => {
  //   const startDate = commObj.fromDate;
  //   const endDate = commObj.toDate;

  //   const resultDates = [];
  //   for (
  //     let currentDate = new Date(startDate);
  //     currentDate <= endDate;
  //     currentDate.setDate(currentDate.getDate() + 1)
  //   ) {
  //     resultDates.push(moment(new Date(currentDate)).format('YYYY-MM-DD'));
  //   }

  //   let newArr = [];
  //   let dates = [];
  //   globalData.holidaysList.forEach(res => {
  //     dates.push(res.date);
  //   });
  //   if (resultDates) {
  //     resultDates.forEach(item => {
  //       if (
  //         moment(item).format('ddd') !== 'Sun' &&
  //         moment(item).format('ddd') !== 'Sat'
  //       ) {
  //         if (!dates.includes(item)) {
  //           newArr.push(item);
  //         }
  //       }
  //     });
  //   }
  //   setCommObj(prev => ({
  //     ...prev,
  //     numberOfDays: newArr.length,
  //   }));
  // }, [commObj.fromDate, commObj.toDate]);

  useEffect(() => {
    if (commObj.leaveData) {
      let myDate = moment(commObj.fromDate).format('YYYY-MM-DD');
      for (let i = 0; commObj.leaveData.length > i; i++) {
        if (commObj.leaveData[i].fromDate >= myDate) {
          setCommObj(prev => ({
            ...prev,
            maxDate: commObj.leaveData[i].fromDate,
          }));
          break;
        } else {
          setCommObj(prev => ({
            ...prev,
            maxDate: null,
          }));
        }
      }
    }
    // if (commObj.leaveStartDates) {
    //   let myDate = moment(commObj.fromDate).format('YYYY-MM-DD');
    //   let leaveDates = commObj.leaveStartDates;

    //   let arr = [];
    //   if (leaveDates) {
    //     leaveDates.filter(item => {
    //       if (item >= myDate) {
    //         arr.push(item);
    //       }
    //     });
    //   }
    //   if (arr) {
    // setCommObj(prev => ({
    //   ...prev,
    //   maxDate: arr[0],
    // }));
    //   }
    // }
  }, [commObj.fromDate, commObj.leaveData]);

  useEffect(() => {
    console.log('TopTabNav commObj-------->', commObj);
  }, [commObj]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
            paddingBottom: 20,
          }}>
          <View
            style={{
              flex: 1,
              paddingTop: 30,
              gap: 15,
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                customNavigation.goBack();
              }}>
              <View
                style={{
                  padding: 5,
                }}>
                <Text
                  style={{
                    color: '#000',
                  }}>
                  back
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#000',
                  fontWeight: 'bold',
                }}>
                Apply Leave
              </Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                setCommObj(prev => ({
                  ...prev,
                  formDatePicker: true,
                }));
              }}>
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: 'blue',
                  borderRadius: 8,
                  paddingLeft: 10,
                  paddingVertical: 5,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#777777',
                  }}>
                  Start Date :
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#000000',
                  }}>
                  {moment(commObj.fromDate).format('MMMM DD, YYYY')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                setCommObj(prev => ({
                  ...prev,
                  toDatePicker: true,
                }));
              }}>
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: 'blue',
                  borderRadius: 8,
                  paddingLeft: 10,
                  paddingVertical: 5,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#777777',
                  }}>
                  End Date :
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#000000',
                  }}>
                  {moment(commObj.toDate).format('MMMM DD, YYYY')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: '#777777',
                  paddingBottom: 5,
                }}>
                Reason for a leave
              </Text>
              <TextInput
                value={commObj.reason}
                multiline={true}
                numberOfLines={10}
                style={{
                  height: 90,
                  textAlignVertical: 'top',
                  borderWidth: 0.5,
                  borderColor: 'blue',
                  borderRadius: 8,
                  color: '#000',
                  paddingLeft: 10,
                }}
                placeholder="Enter reason for a Leave"
                placeholderTextColor="#777777"
                onChangeText={text => {
                  setCommObj(prev => ({
                    ...prev,
                    reason: text,
                  }));
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 5,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#777777',
                }}>
                Number of Days:{' '}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#000',
                }}>
                {commObj.numberOfDays}
              </Text>
            </View>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              if (commObj.reason !== '' && commObj.numberOfDays > 0) {
                applyLeaveHandler();
              }
            }}>
            <View
              style={{
                paddingVertical: 10,
                alignItems: 'center',
                backgroundColor:
                  commObj.reason !== '' && commObj.numberOfDays > 0
                    ? 'blue'
                    : 'lightblue',
                borderRadius: 8,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#fff',
                  fontWeight: 'bold',
                }}>
                Apply Leave
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <DatePicker
            modal
            mode="date"
            date={commObj.fromDate}
            minimumDate={new Date(globalData.minDate)}
            maximumDate={new Date(globalData.maxDate)}
            open={commObj.formDatePicker}
            title="Select Start Date"
            onConfirm={date => {
              setCommObj(prev => ({
                ...prev,
                fromDate: date,
                formDatePicker: false,
              }));
              if (date >= commObj.toDate) {
                setCommObj(prev => ({
                  ...prev,
                  toDate: date,
                }));
              }
            }}
            onCancel={() => {
              setCommObj(prev => ({
                ...prev,
                formDatePicker: false,
              }));
            }}
          />
          <DatePicker
            modal
            mode="date"
            maximumDate={
              commObj.maxDate
                ? new Date(
                    moment(commObj.maxDate)
                      .subtract(1, 'days')
                      .format('YYYY-MM-DD'),
                  )
                : new Date(globalData.maxDate)
            }
            minimumDate={
              commObj.fromDate <= commObj.toDate ? commObj.fromDate : null
            }
            title="Select End Date"
            date={commObj.toDate}
            open={commObj.toDatePicker}
            onConfirm={date => {
              setCommObj(prev => ({
                ...prev,
                toDate: date,
                toDatePicker: false,
              }));
            }}
            onCancel={() => {
              setCommObj(prev => ({
                ...prev,
                toDatePicker: false,
              }));
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ApplyLeaveScreen;
