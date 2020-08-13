
import React, { Component, useRef, useState } from "react";
import {
  AppRegistry,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { connect } from 'react-redux'

const Notification = ({ alerts }) => {

  const state = {
    opacity: new Animated.Value(0),
    offset: new Animated.Value(0),
  };

  const _notification = useRef();
  if (alerts.length > 0) {
    _notification.current.measure((x, y, width, height, pageX, pageY) => {
      state.offset.setValue(height * -1);
      // state.notification = textValue;
      Animated.sequence([

        Animated.parallel([
          Animated.timing(state.opacity, {
            toValue: 1,
            duration: 400,
          }),
          Animated.timing(state.offset, {
            toValue: 0,
            duration: 400,
          }),
        ]),

        Animated.delay(1500),

        Animated.parallel([
          Animated.timing(state.opacity, {
            toValue: 0,
            duration: 400,
          }),
          Animated.timing(state.offset, {
            toValue: height * -1,
            duration: 400,
          }),
        ]),

      ]).start();
    });
  }

  const notificationStyle = {
    opacity: state.opacity,
    transform: [
      {
        translateY: state.offset,
      },
    ],
  };

  return (
    <>
      <Animated.View
        style={[styles.notification, notificationStyle]}
        ref={_notification}
      >
        <Text style={styles.notificationText}>
          {alerts !== null && alerts.length > 0 ? alerts[0].message : null}
        </Text>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  notification: {
    position: "absolute",
    paddingHorizontal: 7,
    paddingVertical: 15,
    left: 0,
    top: 0,
    right: 0,
    backgroundColor: "tomato",
  },
  notificationText: {
    color: "#FFF",
    textAlign: 'center'
  },
});

const mapStateToProps = (state) => {
  return {
    alerts: state.alert
  }
}

export default connect(mapStateToProps, {})(Notification)