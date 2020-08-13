import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Alert, Image, StyleSheet, TouchableOpacity, TextInput, Dimensions, BackHandler } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated'
import { uploadPhoto, removePhoto, loadUser } from '../../actions/index'
import Card from '../../components/Card'
import CardSection from '../../components/CardSection'
// import { styles } from '../../styles/styles.js'
import { connect } from 'react-redux';
import {
  auth, db
} from '../../config/firebase';

const width = Dimensions.get('window').width;

const Profile = ({ authenticate: { user, uid }, removePhoto, uploadPhoto }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const unsubscribe = db.collection('users').doc(uid).onSnapshot(snap => {
      const snapData = snap.data()
      setData(snapData);
    });
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      unsubscribe();
    }
  }, []);

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

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7
    }).then(image => {
      bs.current.snapTo(2);
      uploadPhoto(image);
    });
  }

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7
    }).then(image => {
      bs.current.snapTo(2);
      uploadPhoto(image);
    });
  }

  console.log('user-------', data);

  const bs = useRef();
  const fall = new Animated.Value(1)

  const renderContent = () => {
    return (
      <View style={styles.panel}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.panelTitle}>Upload Photo</Text>
          <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
        </View>
        <TouchableOpacity style={styles.panelButton} onPress={() => { takePhotoFromCamera() }}>
          <Text style={styles.panelButtonTitle}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.panelButton} onPress={() => { choosePhotoFromLibrary() }}>
          <Text style={styles.panelButtonTitle}>Choose From Library</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.panelButton}
          onPress={() => bs.current.snapTo(2)}>
          <Text style={styles.panelButtonTitle}>Cancel</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.panelHeader}>
          <View style={styles.panelHandle} />
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container]} >
      <BottomSheet
        ref={bs}
        callbackNode={fall}
        snapPoints={[450, 300, 0]}
        renderContent={renderContent}
        renderHeader={renderHeader}
        initialSnap={2}
        enabledGestureInteraction={true}
      />
      <Animated.View style={[{
        opacity: Animated.add(0.4, Animated.multiply(fall, 1.0)),
      }]}>
        <Card>
          <View>
            {data && data.images.length > 0 ? <Image style={styles.img} source={{ uri: data.images[0].downloadURL }} />
              : <Image style={styles.img} source={require('../../assets/blank-profile-picture.png')} />}
            <Text style={[styles.center, styles.bold]} >{data && data.username}</Text>
            <CardSection>
              <Text style={[styles.bold]} >{data && data.email}</Text>
            </CardSection>
          </View>
        </Card>
        <View style={styles.imgRow}>
          {data && data.images.length > 0 ? data.images.map((image, key) => {
            return (
              <TouchableOpacity key={{ key }} onPress={() => { removePhoto(image.id) }} >
                <Image style={styles.img} source={{ uri: image.downloadURL }} />
              </TouchableOpacity>
            );
          }) : null}
          <TouchableOpacity style={[styles.img, styles.center]} onPress={() => {
            // addImage() 
            bs.current.snapTo(0)

          }}>
            <Feather name="plus" size={75} style={styles.color} />
          </TouchableOpacity>
        </View>
      </Animated.View>

    </View >
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
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#05375a',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#05375a',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
})



const mapStateToProps = (state) => {
  return {
    authenticate: state.auth
  }
}

export default connect(mapStateToProps, { uploadPhoto, removePhoto, loadUser })(Profile)