import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Modal, TouchableHighlight, TextInput,
  Platform, Image, ScrollView
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import Card from '../../components/Card'
import CardSection from '../../components/CardSection'
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions';
// import FloatingActionButton from '../../components/FloatingActionButton'

const SwipeTab = ({ navigation }) => {
  const mapRef = useRef()
  const isFocused = useIsFocused();
  const [showModal, setShowModal] = useState(false);
  const [location, getLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [predictions, getPredictions] = useState([]);
  const [destination, getDestination] = useState('');

  const goToSwipe = () => {
    navigation.navigate('Swipe');
  }

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'ios') {
        let response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        console.log('Iphone response', response);
        if (response == 'granted') {
          locateCurrentPosition()
        }
      }

      if (Platform.OS === 'android') {
        let response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        console.log('android response', response);
        if (response == 'granted') {
          locateCurrentPosition()
        }
      }
    })();
  }, []);

  // const requestLocationPermissions = async () => {
  //   if (Platform.OS === 'ios') {
  //     let response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  //     // Geolocation.requestAuthorization();
  //     // Geolocation.setRNConfiguration({
  //     //   skipPermissionRequests: false,
  //     //   authorizationLevel: 'whenInUse',
  //     // });
  //     console.log('Iphone response', response);
  //     if (response == 'granted') {
  //       locateCurrentPosition()
  //     }
  //   }

  //   if (Platform.OS === 'android') {
  //     let response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  //     // await PermissionsAndroid.request(
  //     //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //     // );
  //     if (response == 'granted') {
  //       locateCurrentPosition()
  //     }
  //   }
  // }

  const locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(position => {
      const {
        coords: { latitude, longitude }
      } = position;

      getLocation({ latitude: latitude, longitude: longitude });
      console.log('latitude', latitude);
      console.log('longitude', longitude);
    });
  }

  let onRegionChange = (region) => {
    // console.log('region', region);
  };


  const callAPI = _.debounce(async () => {
    const { latitude, longitude } = getLocation;

    try {
      const api = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=GOOGLE_API_KEY&input=${destination}&location=${latitude},${longitude}&radius=2000`;
      let res = await axios.get(api);

      let data = res.data.predictions;
      getPredictions(data);
    } catch (err) {
      console.log('err', err);
    }
  }, 1000);

  const { longitude, latitude } = location;

  const onChangeDestination = async (text) => {
    getDestination(text);
    await callAPI();
  };

  const predictionList = predictions.map(prediction => {
    return (
      <TouchableHighlight
        // onPress={() => {
        //   getRouteDirections(
        //     prediction.place_id,
        //     prediction.structured_formatting.main_text,
        //   );
        // }}
        key={prediction.id}>
        <View>
          <Text style={styles.suggestions}>{prediction.description}</Text>
          {/* <Text style={styles.suggestions}>{prediction.structured_formatting.main_text}</Text> */}
        </View>
      </TouchableHighlight>
    );
  });

  const modal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={showModal}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
        }}
      >
        {/* <view style={styles.container}> */}
        <SafeAreaView style={styles.container}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            onRegionChange={onRegionChange}>
            <Marker coordinate={{ latitude, longitude }}>
              {/* <Image source={require('../../assets/blank-profile-picture.png')} /> */}
              <Callout>
                <Text>That's Me</Text>
              </Callout>
            </Marker>
          </MapView>
          <TextInput
            style={styles.destinationInput}
            onChangeText={text => onChangeDestination(text)}
            placeholder="Enter destination"
            value={destination}
          />

          <View style={styles.button}>
            <TouchableOpacity onPress={() => { setShowModal(!showModal) }}>
              <LinearGradient colors={['#05375a', '#05375a']} style={styles.signIn}>
                <Text style={styles.textSignIn}>Update Location</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {destination.length > 0 ? <View>{predictionList}</View> : null}
        </SafeAreaView>
        {/* <View style={styles.centeredView}>
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
        </View> */}
      </Modal>

    )
  }

  return (
    <View style={[styles.container]} >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.swipeInfoContainer}>
          <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>Swipe Settings</Text>
        </View>
        <Card>
          <TouchableOpacity >
            <CardSection>
              <Text style={[styles.bold, styles.text, styles.center]}>Interested in</Text>
              <View style={styles.iconContent}>
                {/* <Image style={styles.icon} source={require('../../assets/blank-profile-picture.png')} /> */}
                <Ionicons style={styles.icon} name='ios-arrow-forward' size={20} color='black' />
              </View>
            </CardSection>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity onPress={() => setShowModal(!showModal)}>
            <CardSection>
              <Text style={[styles.bold, styles.text, styles.center]}>Set current location</Text>
              <View style={styles.iconContent}>
                {/* <Image style={styles.icon} source={require('../../assets/blank-profile-picture.png')} /> */}
                <Ionicons style={styles.icon} name='ios-arrow-forward' size={20} color='black' />
              </View>
            </CardSection>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity  >
            <CardSection>
              <Text style={[styles.bold, styles.text, styles.center]}>Maximum distance</Text>
              <View style={styles.iconContent}>
                {/* <Image style={styles.icon} source={require('../../assets/blank-profile-picture.png')} /> */}
                <Ionicons style={styles.icon} name='ios-arrow-forward' size={20} color='black' />
              </View>
            </CardSection>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity  >
            <CardSection>
              <Text style={[styles.bold, styles.text, styles.center]}>Show Me</Text>
              <View style={styles.iconContent}>
                {/* <Image style={styles.icon} source={require('../../assets/blank-profile-picture.png')} /> */}
                <Ionicons style={styles.icon} name='ios-arrow-forward' size={20} color='black' />
              </View>
            </CardSection>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity  >
            <CardSection>
              <Text style={[styles.bold, styles.text, styles.center]}>Age range</Text>
              <View style={styles.iconContent}>
                {/* <Image style={styles.icon} source={require('../../assets/blank-profile-picture.png')} /> */}
                <Ionicons style={styles.icon} name='ios-arrow-forward' size={20} color='black' />
              </View>
            </CardSection>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity onPress={() => goToSwipe()}>
            <CardSection>
              <Text style={[styles.bold, styles.text, styles.center]}>Swipe</Text>
              <View style={styles.iconContent}>
                <MaterialCommunityIcons style={styles.icon} name='gesture-swipe' size={20} color='black' />
              </View>
            </CardSection>
          </TouchableOpacity>
        </Card>
        {modal()}
      </ScrollView>
      {/* {isFocused ?
        <FloatingActionButton /> : null
      } */}
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontFamily: "HelveticaNeue",
    color: "#52575D"
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
  suggestions: {
    backgroundColor: 'white',
    padding: 5,
    fontSize: 18,
    borderWidth: 0.5,
    marginLeft: 5,
    marginRight: 5,
  },
  destinationInput: {
    padding: 5,
    marginTop: 15,
    height: 40,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 8,
    marginRight: 80,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    height: 500,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    position: 'absolute',
    bottom: 25,
    left: 60,
    right: 60,
  },
  iconContent: {
    width: 60,
    height: 60,
    // backgroundColor: '#40E0D0',
    marginLeft: 'auto',
  },
  center: {
    fontSize: 22,
    alignSelf: 'center',
    marginLeft: 10
  },
  icon: {
    marginTop: 20,
    //   width: 50,
    //   height: 50,
  },
  bold: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  swipeInfoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 16
  },
  swipe: {
    position: 'absolute',
    bottom: 10
  }
});

export default SwipeTab;