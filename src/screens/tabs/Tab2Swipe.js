import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Modal, TouchableHighlight, TextInput,
  Platform, PermissionsAndroid
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Card from '../../components/Card'
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Geolocation from '@react-native-community/geolocation';
// import { request, PERMISSIONS } from 'react-native-permissions'

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
    // requestLocationPermissions();
    // Geolocation.getCurrentPosition(position => {
    //   const {
    //     coords: { latitude, longitude }
    //   } = position;

    //   getLocation({ latitude: latitude, longitude: longitude });
    //   // console.log('latitude', latitude);
    //   // console.log('longitude', longitude);
    // });
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

  // const locateCurrentPosition = () => {
  //   Geolocation.getCurrentPosition(position => {
  //     const {
  //       coords: { latitude, longitude }
  //     } = position;

  //     getLocation({ latitude: latitude, longitude: longitude });
  //     // console.log('latitude', latitude);
  //     // console.log('longitude', longitude);
  //   });
  // }

  let onRegionChange = (region) => {
    // console.log('region', region);
  };


  const callAPI = _.debounce(async () => {
    const { latitude, longitude } = getLocation;

    try {
      const api = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=API_KEY&input=${destination}&location=${latitude},${longitude}&radius=2000`;
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
            <Marker coordinate={{ latitude, longitude }} />
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
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default SwipeTab;