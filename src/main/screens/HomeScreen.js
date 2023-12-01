import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Calendar} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment/moment';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppContext} from '../../context/AppContext';

const HomeScreen = () => {
  const customNavigation = useNavigation();
  const isFocused = useIsFocused();
  const {globalData} = useContext(AppContext);
  const [commObj, setCommObj] = useState({
    todayDate: null,
    months: moment.months(),
    selectadDate: null,
    changedMonth: null,
    changedYear: null,
    dataInfo: null,
    modalVisible: false,
  });

  // initially select today's date
  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = moment(currentDate).format('YYYY-MM-DD');
    setCommObj(prev => ({
      ...prev,
      todayDate: formattedDate,
      selectadDate: formattedDate,
      changedMonth: moment(formattedDate).format('MMMM YYYY'),
      changedYear: moment(formattedDate).format('YYYY'),
    }));
  }, []);

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Handler for onVisibleMonthsChange
  const handleVisibleMonthsChange = useCallback(
    debounce(months => {
      setCommObj(prev => ({
        ...prev,
        selectadDate: months[0]?.dateString,
      }));
    }, 20),
    [],
  );

  useEffect(() => {
    isFocused && leaveDataHanlder();
  }, [isFocused, commObj.selectadDate]);

  const leaveDataHanlder = async () => {
    let leaveData = await AsyncStorage.getItem('apply-leave');
    let data = JSON.parse(leaveData);
    if (data) {
      let arr = data.filter(
        item =>
          moment(item.fromDate).format('MM') ===
            moment(commObj.selectadDate).format('MM') &&
          moment(item.fromDate).year() === moment(commObj.selectadDate).year(),
      );
      setCommObj(prev => ({
        ...prev,
        dataInfo: arr,
      }));
    }
  };

  // const leaveDataHanlder = async () => {
  //   let leaveData = await AsyncStorage.getItem('apply-leave');
  //   let data = JSON.parse(leaveData);
  //   let arr = [];
  //   if (data) {
  //     setCommObj(prev => ({
  //       ...prev,
  //       markedDates: data,
  //     }));
  //     data.filter(item => {
  //       if (
  //         moment(item.fromDate).format('MM') ===
  //           moment(commObj.selectadDate).format('MM') &&
  //         moment(item.fromDate).year() === moment(commObj.selectadDate).year()
  //       ) {
  //         arr.push(item);
  //       }
  //     });
  //   }
  //   setCommObj(prev => ({
  //     ...prev,
  //     dataInfo: arr,
  //   }));
  // };

  const leaveApplyHandler = date => {
    customNavigation.navigate('applyLeave', {
      date: date.dateString,
    });
  };

  const customHeader = () => (
    <TouchableWithoutFeedback
      onPress={() => {
        setCommObj(prev => ({
          ...prev,
          modalVisible: true,
        }));
      }}>
      <View>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 23,
            fontWeight: 'bold',
            color: '#000',
          }}>
          {moment(commObj.selectadDate).format('MMMM YYYY')}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );

  useEffect(() => {
    console.log('HomeScreen-commObj------->', commObj);
  }, [commObj]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            paddingTop: 30,
          }}>
          <Calendar
            initialDate={commObj.selectadDate}
            minDate={globalData.minDate}
            maxDate={globalData.maxDate}
            // dayComponent={({date, state}) => (
            //   <CustomDayComponent date={date} state={state} />
            // )}
            dayComponent={({date, state}) => {
              let marked = false;
              let start = false;
              let end = false;
              let dd = moment(date.dateString).format('ddd');
              let holiday = false;
              if (commObj.dataInfo) {
                commObj.dataInfo.forEach(item => {
                  if (
                    item.fromDate <= date.dateString &&
                    date.dateString <= item.toDate
                  ) {
                    marked = true;
                  }
                  if (item.fromDate === date.dateString) {
                    start = true;
                  }
                  if (item.toDate === date.dateString) {
                    end = true;
                  }
                });
              }
              if (globalData.holidaysList) {
                globalData.holidaysList.forEach(item => {
                  if (item.date === date.dateString) {
                    holiday = true;
                  }
                });
              }
              return (
                <TouchableWithoutFeedback
                  onPress={() => {
                    setCommObj(prev => ({
                      ...prev,
                      selectadDate: date.dateString,
                    }));
                    console.log('date---->', date);
                    if (
                      !holiday &&
                      dd !== 'Sun' &&
                      dd !== 'Sat' &&
                      !marked &&
                      state !== 'disabled'
                    ) {
                      leaveApplyHandler(date);
                    }
                  }}>
                  <View
                    style={{
                      width: '100%',
                      height: 40,
                      backgroundColor: marked
                        ? state === 'disabled'
                          ? ''
                          : 'lightblue'
                        : state === 'today'
                        ? 'lightgreen'
                        : '',
                      borderTopLeftRadius:
                        start || state === 'today' ? 40 / 2 : 0,
                      borderBottomLeftRadius:
                        start || state === 'today' ? 40 / 2 : 0,
                      borderTopRightRadius:
                        end || state === 'today' ? 40 / 2 : 0,
                      borderBottomRightRadius:
                        end || state === 'today' ? 40 / 2 : 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {dd === 'Sun' || dd === 'Sat' ? (
                      <Text
                        style={{
                          textAlign: 'center',
                          color: state === 'disabled' ? 'lightgray' : 'red',
                        }}>
                        {date.day}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          textAlign: 'center',
                          color:
                            state === 'disabled'
                              ? 'lightgray'
                              : holiday
                              ? 'red'
                              : 'black',
                        }}>
                        {date.day}
                      </Text>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              );
            }}
            style={{}}
            theme={{}}
            renderArrow={direction =>
              direction === 'left' ? (
                <Icon
                  name="angle-left"
                  size={30}
                  color={'gray'}
                  style={{
                    paddingHorizontal: 10,
                    marginLeft: -10,
                  }}
                />
              ) : (
                <Icon
                  name="angle-right"
                  size={30}
                  color={'gray'}
                  style={{
                    paddingHorizontal: 10,
                    marginRight: -10,
                  }}
                />
              )
            }
            renderHeader={customHeader}
            enableSwipeMonths={true}
            onVisibleMonthsChange={handleVisibleMonthsChange}
          />
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            setCommObj(prev => ({
              ...prev,
              selectadDate: commObj.todayDate,
            }));
          }}>
          <View
            style={{
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 23,
                color: '#000',
              }}>
              {commObj.todayDate}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <View
          style={{
            flex: 1,
            paddingTop: 10,
          }}>
          {commObj.dataInfo && commObj.dataInfo.length > 0 ? (
            <FlatList
              data={commObj.dataInfo}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                gap: 15,
                paddingBottom: 15,
              }}
              keyExtractor={item => item.fromDate}
              renderItem={({item}) => {
                return (
                  <View
                    style={{
                      padding: 15,
                      borderRadius: 8,
                      backgroundColor: '#fff',
                    }}>
                    <Text
                      style={{
                        color: '#000000',
                      }}>
                      {item.reason}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                      }}>
                      {item.fromDate} to {item.toDate}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                      }}>
                      Number of Days: {item.numberOfDays}
                    </Text>
                  </View>
                );
              }}
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#000',
                  lineHeight: 23,
                }}>
                No Leaves
              </Text>
            </View>
          )}
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={commObj.modalVisible}
          onRequestClose={() => {
            setCommObj(prev => ({
              ...prev,
              modalVisible: false,
            }));
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              setCommObj(prev => ({
                ...prev,
                changedYear: moment(commObj.selectadDate).format('YYYY'),
                modalVisible: !prev.modalVisible,
              }));
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
                backgroundColor: 'rgba(0,0,0,0.7)',
              }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setCommObj(prev => ({
                    ...prev,
                    modalVisible: true,
                  }));
                }}>
                <View
                  style={{
                    paddingVertical: 25,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    backgroundColor: '#fff',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingBottom: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: 'lightgray',
                      gap: 20,
                    }}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setCommObj(prev => ({
                          ...prev,
                          changedYear: prev.changedYear - 1,
                        }));
                      }}>
                      <View>
                        <Icon
                          name="angle-left"
                          size={20}
                          color={'gray'}
                          style={{
                            paddingHorizontal: 10,
                          }}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          lineHeight: 25,
                          color: '#000',
                        }}>
                        {commObj.changedYear}
                      </Text>
                    </View>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setCommObj(prev => ({
                          ...prev,
                          changedYear: Number(prev.changedYear) + 1,
                        }));
                      }}>
                      <View>
                        <Icon
                          name="angle-right"
                          size={20}
                          color={'gray'}
                          style={{
                            paddingHorizontal: 10,
                          }}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      rowGap: 20,
                      paddingTop: 15,
                    }}>
                    {commObj.months.map((item, index) => {
                      return (
                        <TouchableWithoutFeedback
                          key={index}
                          onPress={() => {
                            let date = `${commObj.changedYear}-${moment()
                              .month(item)
                              .format('MM')}-01`;
                            setCommObj(prev => ({
                              ...prev,
                              changedMonth: `${item} ${commObj.changedYear}`,
                              selectadDate: date,
                              modalVisible: false,
                            }));
                          }}>
                          <View
                            style={{
                              width: '22%',
                              alignItems: 'center',
                              paddingVertical: 10,
                              backgroundColor:
                                commObj.changedMonth &&
                                commObj.changedMonth.split(' ')[0] === item
                                  ? 'lightblue'
                                  : '#fff',
                              borderRadius: 4,
                            }}>
                            <Text
                              style={{
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {item}
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      );
                    })}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
