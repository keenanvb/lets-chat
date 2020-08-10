import React, { useEffect } from 'react';
import { View, Text, ScrollView, Alert, Image, StyleSheet, TouchableOpacity, TextInput, Dimensions, BackHandler } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
// import { styles } from '../../styles/styles.js'
import { connect } from 'react-redux';
import {
  auth, db
} from '../../config/firebase';

const width = Dimensions.get('window').width;

const Profile = ({ authenticate: { user } }) => {

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  }, [])

  const isFocused = useIsFocused();

  console.log(`tab 1 ${isFocused}`);

  const handleBackButton = () => {
    // Alert.alert(
    //   'Exit App',
    //   'Exiting the application?', [{
    //     text: 'Cancel',
    //     onPress: () => console.log('Cancel Pressed'),
    //     style: 'cancel'
    //   }, {
    //     text: 'OK',
    //     onPress: () => BackHandler.exitApp()
    //   },], {
    //   cancelable: false
    // }
    // )
    BackHandler.exitApp();
    return true;
  }

  const addImage = () => {


  }
  return (
    <ScrollView>
      <View style={[styles.container, styles.center]}>
        <View style={styles.container}>
          <Image style={styles.img} source={{ uri: null }} />
          <Text style={[styles.center, styles.bold]} >{null}</Text>
        </View>
        <View style={styles.imgRow}>
          {/* {user.images.map((uri, key) => {
            return (
              <TouchableOpacity key={{ key }} onPress={null} >
                <Image style={styles.img} source={{ uri: uri }} />
              </TouchableOpacity>
            );
          })} */}
          <TouchableOpacity style={[styles.img, styles.center]} onPress={() => { addImage() }}>
            <Feather name="plus" size={75} style={styles.color} />
          </TouchableOpacity>
        </View>
        <Text style={styles.bold}>About</Text>
        <TextInput
          style={styles.textInput}
          multiline={true}
          numberOfLines={5}
          onChangeText={(text) => null}
          value={null} />
      </View>
      <TouchableOpacity onPress={() => null}>
        <Text style={styles.button}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  color: {
    color: '#df4723'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  img: {
    width: 90,
    height: 90,
    borderRadius: 45,
    margin: 10,
    backgroundColor: '#fff',
  },
  imgRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 15,
  },
  textInput: {
    width: width,
    padding: 15,
    backgroundColor: '#fff',
    height: 100
  },
  bold: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#df4723',
    textAlign: 'center',
    color: '#df4723',
    padding: 15,
    margin: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
})



const mapStateToProps = (state) => {
  return {
    authenticate: state.auth
  }
}

export default connect(mapStateToProps, {})(Profile)