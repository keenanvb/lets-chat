import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { connect } from 'react-redux';
import { db } from '../config/firebase';
import { createChatId } from '../utils/utils'
import firebase from 'firebase'

function clamp(value, min, max) {
  return min < max
    ? (value < min ? min : value > max ? max : value)
    : (value < max ? max : value > min ? min : value)
}

// let SWIPE_THRESHOLD = 120;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_HEIGHT2 = SCREEN_HEIGHT / 3;
const SWIPE_THRESHOLD = 0.5 * SCREEN_WIDTH;


const Swipe = ({ authenticate }) => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    db.collection('users').get().then(snapShot => {
      let userList = [];
      snapShot.forEach((doc) => {
        let data = doc.data();
        if (data.uid !== authenticate.uid && data.swipes[authenticate.uid] === false || data.swipes[authenticate.uid] === undefined) {
          // if (data.uid !== authenticate.uid) {
          userList.push(data);
        }

      });
      setUsers(userList);
    });
  }, []);

  console.log('swipe users', users);

  const state = {
    animation: new Animated.ValueXY(),
    opacity: new Animated.Value(1),
    next: new Animated.Value(0.9),
  };

  let currentCard = null;


  const checkMatch = async () => {
    console.log('checking match')
    console.log('authenticate.uid', authenticate.uid);
    console.log('checking match', currentCard.swipes[authenticate.uid])
    try {
      if (authenticate.user.swipes[currentCard.uid] === true) {

        let me = {
          id: authenticate.uid,
          fullName: authenticate.user.fullName,
          // photo: currentCard.photo,
          // createdAt: firebase.firestore.FieldValue.serverTimestamp(), //Time stamp not supported in arrays??
          // updateAt: firebase.firestore.FieldValue.serverTimestamp(),
        }

        let connection = {
          users: [me],
          notifications: [],
        };
        await db.collection('connections').doc(currentCard.uid).set(connection);

        let otheUser = {
          id: currentCard.uid,
          fullName: currentCard.fullName,
          // photo: currentCard.photo,
          // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          // updateAt: firebase.firestore.FieldValue.serverTimestamp(),
        }

        let connection2 = {
          users: [otheUser],
          notifications: [],
        };
        await db.collection('connections').doc(authenticate.uid).set(connection2);

        let chat = {
          notifications: [],
          messages: []
        }

        await db.collection('chats').doc(createChatId(authenticate.uid, currentCard.uid)).set(chat);
      }
    } catch (e) {
      console.log('e', e)
    }

  }

  const _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    // onPanResponderMove: () => false,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: state.animation.x,
        dy: state.animation.y,
      },
    ]),
    onPanResponderRelease: async (evt, { dx, vx, vy }) => {
      let velocity;

      if (vx >= 0) {
        velocity = clamp(vx, 3, 5);
      } else if (vx < 0) {
        velocity = clamp(Math.abs(vx), 3, 5) * -1;
      }



      // if (Math.abs(dx) > SWIPE_THRESHOLD) {
      //   Animated.decay(state.animation, {
      //     velocity: { x: velocity, y: vy },
      //     deceleration: 0.98,
      //     useNativeDriver: true
      //   }).start(transitionNext);

      if (dx > SWIPE_THRESHOLD) {
        await handleFirebaseYes();
        await Animated.decay(state.animation, {
          velocity: { x: velocity, y: vy },
          deceleration: 0.98,
          useNativeDriver: true
        }).start(transitionNext);
      } else if (dx < -SWIPE_THRESHOLD) {
        await handleFirebaseNo()
        Animated.decay(state.animation, {
          velocity: { x: velocity, y: vy },
          deceleration: 0.98,
          useNativeDriver: true
        }).start(transitionNext);
      } else {
        Animated.spring(state.animation, {
          toValue: { x: 0, y: 0 },
          friction: 4,
          useNativeDriver: true
        }).start();
      }
    },
  });

  const transitionNext = () => {
    Animated.parallel([
      Animated.timing(state.opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.spring(state.next, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true
      }),
    ]).start(() => {
      setUsers(users.slice(1));
      state.next.setValue(0.9);
      state.opacity.setValue(1);
      state.animation.setValue({ x: 0, y: 0 });
    });
  };

  const handleNo = async () => {
    await handleFirebaseNo()
    Animated.timing(state.animation.x, {
      toValue: -SWIPE_THRESHOLD,
      useNativeDriver: true
    }).start(transitionNext);
  };
  const handleYes = async () => {
    await handleFirebaseYes()
    Animated.timing(state.animation.x, {
      toValue: SWIPE_THRESHOLD,
      useNativeDriver: true
    }).start(transitionNext);
  };


  const handleFirebaseYes = async () => {
    await db.collection('users').doc(currentCard.uid).update({
      [`swipes.${authenticate.uid}`]: true
    });
    await checkMatch();
  }


  const handleFirebaseNo = async () => {
    await db.collection('users').doc(currentCard.uid).update({
      [`swipes.${authenticate.uid}`]: false
    });
  }


  const { animation } = state;

  const rotate = animation.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ["-30deg", "0deg", "30deg"],
    extrapolate: "clamp",
  });

  const opacity = animation.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [0.5, 1, 0.5],
  });

  const yesOpacity = animation.x.interpolate({ inputRange: [0, 150], outputRange: [0, 1] });
  const yesScale = animation.x.interpolate({
    inputRange: [0, 150],
    outputRange: [0.5, 1],
    extrapolate: "clamp",
  });
  const animatedYupStyles = {
    transform: [{ scale: yesScale }, { rotate: "-30deg" }],
    opacity: yesOpacity,
  };

  const noOpacity = animation.x.interpolate({ inputRange: [-150, 0], outputRange: [1, 0] });
  const noScale = animation.x.interpolate({
    inputRange: [-150, 0],
    outputRange: [1, 0.5],
    extrapolate: "clamp",
  });
  const animatedNopeStyles = {
    transform: [{ scale: noScale }, { rotate: "30deg" }],
    opacity: noOpacity,
  };

  const animatedCardStyles = {
    transform: [{ rotate }, ...state.animation.getTranslateTransform()],
    opacity: state.opacity,
  };

  const animatedImageStyles = {
    opacity,
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        {users.slice(0, 2).reverse().map(({ images, id, email }, index, items) => {
          const isLastItem = index === items.length - 1;
          const isSecondToLast = index === items.length - 2;
          const panHandlers = isLastItem ? _panResponder.panHandlers : {};
          const cardStyle = isLastItem ? animatedCardStyles : undefined;
          const imageStyle = isLastItem ? animatedImageStyles : undefined;
          const nextStyle = isSecondToLast
            ? { transform: [{ scale: state.next }] }
            : undefined;


          if (items.length === 1) {
            currentCard = items[0];
          } else {
            currentCard = items[1];
          }

          console.log('currentCard', currentCard);
          return (
            <Animated.View {...panHandlers} style={[styles.card, cardStyle, nextStyle]} key={`${index}-${id}`}>
              <Animated.Image
                source={{ uri: images[0].downloadURL }}
                style={[styles.image, imageStyle]}
                resizeMode="cover"
              />
              <View style={styles.lowerText}>
                <Text>
                  {email}
                </Text>
              </View>

              {isLastItem &&
                <Animated.View style={[styles.nope, animatedNopeStyles]}>
                  <Text style={styles.nopeText}>Nope!</Text>
                </Animated.View>}

              {isLastItem &&
                <Animated.View style={[styles.yup, animatedYupStyles]}>
                  <Text style={styles.yupText}>Yup!</Text>
                </Animated.View>}
            </Animated.View>
          );
        })}
      </View>
      <View style={styles.buttonBar}>
        <TouchableOpacity onPress={handleNo} style={[styles.button, styles.nopeButton]}>
          <Text style={styles.nopeText}>NO</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleYes} style={[styles.button, styles.yupButton]}>
          <Text style={styles.yupText}>YES</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  button: {
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.3,
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 5,
  },
  yupButton: {
    shadowColor: "green",
  },
  nopeButton: {
    shadowColor: "red",
  },
  card: {
    width: 400,
    height: 400,
    position: "absolute",
    borderRadius: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#FFF",
  },
  lowerText: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 5,
  },
  image: {
    width: null,
    height: null,
    borderRadius: 2,
    flex: 3,
  },
  yup: {
    borderColor: "green",
    borderWidth: 2,
    position: "absolute",
    padding: 20,
    borderRadius: 5,
    top: 20,
    left: 20,
    backgroundColor: "#FFF",
  },
  yupText: {
    fontSize: 16,
    color: "green",
  },
  nope: {
    borderColor: "red",
    borderWidth: 2,
    position: "absolute",
    padding: 20,
    borderRadius: 5,
    right: 20,
    top: 20,
    backgroundColor: "#FFF",
  },
  nopeText: {
    fontSize: 16,
    color: "red",
  },
});


const mapStateToProps = (state) => {
  return {
    authenticate: state.auth
  }
}

export default connect(mapStateToProps, {})(Swipe)
