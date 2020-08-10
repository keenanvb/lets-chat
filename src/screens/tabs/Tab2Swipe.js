import React from 'react';
import { View, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { styles } from '../../styles/styles.js'

const Swipe = () => {

  const isFocused = useIsFocused();

  console.log(`tab 2 ${isFocused}`);

  return <View style={styles.center}>
    <Text style={styles.title}>Tab 2</Text>
  </View>

}



export default Swipe;