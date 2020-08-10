import React from 'react';
import { View, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { styles } from '../../styles/styles.js'

const Chat = () => {

  const isFocused = useIsFocused();

  console.log(`tab 3 ${isFocused}`);
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Tab 3</Text>
    </View>
  )
}
export default Chat;