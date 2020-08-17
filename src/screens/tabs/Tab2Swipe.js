import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Modal, TouchableHighlight
} from 'react-native';
import Card from '../../components/Card'
import { useIsFocused } from '@react-navigation/native';

const SwipeTab = ({ navigation }) => {

  const isFocused = useIsFocused();
  const [showModal, setShowModal] = useState(false);

  const goToSwipe = () => {
    navigation.navigate('Swipe');
  }


  const modal = () => {
    return (
      // <Modal animationType='fade' transparent={false} visible={showModal}>
      //   <SafeAreaView style={[styles.container, styles.center]}>
      //     <TouchableOpacity style={styles.border} onPress={() => setShowModal(!showModal)}>
      //       <Text style={styles.gray}>Location</Text>
      //     </TouchableOpacity>
      //   </SafeAreaView>
      // </Modal>
      <Modal
        animationType="fade"
        transparent={false}
        visible={showModal}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setShowModal(!showModal);
              }}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

    )
  }

  return (
    <View style={[styles.container]} >
      <Card>
        <Text>Swipe settings</Text>
      </Card>
      <Card>
        <TouchableOpacity style={[styles.signIn, styles.signUp]} onPress={() => {
          goToSwipe()
        }}>
          <Text style={[styles.textSignIn, { color: '#4dc2f8' }]}>Swipe</Text>
        </TouchableOpacity>
      </Card>
      <Card>
        <TouchableOpacity style={{}} onPress={() => setShowModal(!showModal)}>
          <Text style={{}}>{'Set current location'}</Text>
        </TouchableOpacity>
      </Card>
      {modal()}
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
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
});

export default SwipeTab;