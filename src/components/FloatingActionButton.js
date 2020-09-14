import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Dimensions
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const FloatingActionButton = (props) => {


  let state = {
    animation: new Animated.Value(0),
    open: 0,
  };



  const toggleOpen = () => {

    const toValue = state.open ? 0 : 1

    Animated.timing(state.animation, {
      toValue,
      duration: 300,
      useNativeDriver: true
    }).start();

    state.open = !state.open;
  }

  const watchStyle = {
    transform: [
      {
        scale: state.animation
      }, {
        translateY: state.animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -70]
        })
      }
    ]
  }

  const swipeStyle = {
    transform: [
      {
        scale: state.animation
      }, {
        translateY: state.animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -140]
        })
      }
    ]
  }

  const bgStyle = {
    transform: [
      {
        scale: state.animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 30]
        })
      }
    ]
  }

  const labelPositionInterpolate = state.animation.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [-30, -60, -90],
  });
  const opacityInterpolate = state.animation.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 0, 1],
  });

  const labelStyle = {
    opacity: opacityInterpolate,
    transform: [
      {
        translateX: labelPositionInterpolate,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.background, bgStyle]} />

      <TouchableWithoutFeedback onPress={() => { props.navigation.navigate('Swipe'); }}>
        <Animated.View style={[styles.button, styles.other, swipeStyle]}>
          <Animated.Text style={[styles.label, labelStyle]}>Swipe</Animated.Text>
          <MaterialCommunityIcons style={styles.icon} name='gesture-swipe' size={20} color='black' />
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback>
        <Animated.View style={[styles.button, styles.other, watchStyle]}>
          <Animated.Text style={[styles.label, labelStyle]}>Watch Ad</Animated.Text>
          <MaterialCommunityIcons name="reload" size={30} color="#555" />
        </Animated.View>
      </TouchableWithoutFeedback>


      <TouchableWithoutFeedback onPress={toggleOpen}>
        <View style={[styles.button, styles.Coins]}>
          <Animated.Text style={[styles.label, labelStyle]}>Coins</Animated.Text>
          <Text style={styles.CoinsText}>Coins</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    backgroundColor: 'rgba(0,0,0,.8)',
    position: 'absolute',
    width: 60,
    height: 60,
    bottom: 20,
    right: 20,
    borderRadius: 30
  },
  button: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#333',
    shadowOpacity: .1,
    shadowOffset: { x: 2, y: 0 },
    elevation: .1,
    shadowRadius: 2,
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
    right: 20
  },
  Coins: {
    backgroundColor: '#05375a'
  },
  CoinsText: {
    color: '#FFF'
  },
  other: {
    backgroundColor: '#FFF',
  },
  label: {
    color: "#FFF",
    position: "absolute",
    fontSize: 18,
    backgroundColor: "transparent",
  }
});


export default FloatingActionButton;
