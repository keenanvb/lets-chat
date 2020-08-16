import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const SwipeTab = ({ navigation }) => {

  const isFocused = useIsFocused();

  const goToSwipe = () => {
    navigation.navigate('Swipe');
  }

  return (
    <View style={[styles.container]} >
      <Text>Swipe settings</Text>

      <TouchableOpacity style={[styles.signIn, styles.signUp]} onPress={() => {
        goToSwipe()
      }}>
        <Text style={[styles.textSignIn, { color: '#4dc2f8' }]}>Swipe</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row'
  },
  textSignIn: {
    color: 'white',
    fontWeight: 'bold',
    margin: 8,
    fontSize: 18
  },
  signUp: {
    borderWidth: 1,
    borderColor: '#4dc2f8',
    marginTop: 15
  }
});

export default SwipeTab;