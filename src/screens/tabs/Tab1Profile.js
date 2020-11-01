import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, Alert, Image, StyleSheet, Modal,
  TouchableOpacity, TextInput, Dimensions, BackHandler, TouchableHighlight, Switch, SafeAreaView
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LottieView from 'lottie-react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated'
import { uploadPhoto, removePhoto, loadUser, isActive, getCurrentProfile } from '../../actions/index'
import { connect } from 'react-redux';
import { auth, db } from '../../config/firebase';
import FloatingActionButton from '../../components/FloatingActionButton'
import * as Animatable from 'react-native-animatable';
import Input from '../../components/Input'
import LinearGradient from 'react-native-linear-gradient';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ProfileTab = ({ authenticate: { user, uid }, profile: { profile, loading }, getCurrentProfile, removePhoto, uploadPhoto, isActive, navigation }) => {
  const [data, setData] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [isProfileImage, setProfileImage] = useState(false)

  const [showFloatingButton, setShowFloatingButton] = useState(true) //finsih

  const [formData, setFormData] = useState({
    company: '',
    location: '',
    bio: '',
    job: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    instagram: ''
  });
  console.log('profile', profile)
  let unsubscribe = useRef(null);
  useEffect(() => {
    getCurrentProfile()
    unsubscribe.current = db.collection('users').doc(uid).onSnapshot(snap => {
      const snapData = snap.data();
      setData(snapData);
    });

    setFormData({
      // company: data || data.company ? data.company : '',
      job: loading || !profile.job ? '' : profile.job,
      bio: loading || !profile.bio ? '' : profile.bio,
      company: loading || !profile.company ? '' : profile.company,
      // website: loading || !profile.website ? '' : profile.website,
      // twitter: loading || !profile.social ? '' : profile.social.twitter,
      // facebook: loading || !profile.social ? '' : profile.social.facebook,
      // linkedin: loading || !profile.social ? '' : profile.social.linkedin,
      // youtube: loading || !profile.social ? '' : profile.social.youtube,
      // instagram: loading || !profile.social ? '' : profile.social.instagram
    })

    // BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      // BackHandler.removeEventListener('hardwareBackPress', handleBackButton); // does not unmount
      // unsubscribe();
      unsubscribe.current();
    }
  }, [loading, getCurrentProfile]);

  const isFocused = useIsFocused();

  // if (!isFocused) {
  //   unsubscribe.current(); // does not unmount work around useIsFocused()
  //   BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  // }

  console.log(`tab 1 ${isFocused}`);

  console.log('formData', formData)
  // const handleBackButton = () => {
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
  //   BackHandler.exitApp();
  //   return true;
  // }

  // const [] = useState({
  //   company: '',
  //   location: '',
  //   bio: '',
  //   twitter: '',
  //   facebook: '',
  //   linkedin: '',
  //   youtube: '',
  //   instagram: ''
  // });
  const { bio, job, company } = formData

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7
    }).then(image => {
      bs.current.snapTo(1);
      uploadPhoto(image, isProfileImage);
      setProfileImage(false);
      setShowFloatingButton(true)
    });
  }

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7
    }).then(image => {
      bs.current.snapTo(1);
      uploadPhoto(image, isProfileImage);
      setProfileImage(false);
      setShowFloatingButton(true)
    });
  }

  // const onChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value })
  // }

  const onChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const profileModal = () => {
    return (
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
            <TouchableHighlight onPress={() => {
              setShowModal(!showModal);
              setShowFloatingButton(true)

            }} style={[{ position: 'absolute', top: 4, right: 4 }]}>
              <Ionicons name='ios-close-outline' size={30} color='black' />
            </TouchableHighlight>
            {/* <TouchableHighlight>
              <Text style={styles.modalText}>Profile</Text>
            </TouchableHighlight> */}
            <View>
              {data ?
                <View style={[styles.signIn]}>
                  <Input label={'Bio'} name='bio' placeholder={'About you'} value={bio} onChangeText={(value) => {
                    onChange('bio', value)
                  }} />
                </View> : null
              }

              <View style={[styles.signIn]}>
                <Input label={'Job title'} name={'job'} placeholder={'Add job title'} value={job} onChangeText={(value) => {
                  onChange('job', value)
                }} />
              </View>
              <View style={[styles.signIn]}>
                <Input label={'Company'} name={'company'} placeholder={'Add company'} value={company} onChangeText={(value) => {
                  onChange('company', value)
                }} />
              </View>
              {data ?
                <View style={styles.ActiveContainer}>
                  <Text style={[styles.text, { marginLeft: 20, fontSize: 18 }]}>Show age</Text>
                  <Switch style={[{ marginRight: 20 }]} value={data.show} onValueChange={(value) => { isActive(value) }} />
                </View> : null
              }
              <TouchableOpacity >
                <LinearGradient colors={['#05375a', '#05375a']} style={[styles.signIn]}>
                  <Text style={[styles.textSignIn]}>Save</Text>
                  <Ionicons name='ios-arrow-forward' size={20} color='white' />
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </View>

        </View>

      </Modal >)
  }

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
          onPress={() => {
            bs.current.snapTo(1)
            setProfileImage(false);
            setShowFloatingButton(true)
          }}>
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
      {data == null ?
        <LottieView source={require('../loader.json')} autoPlay loop /> :
        <>
          <BottomSheet
            ref={bs}
            callbackNode={fall}
            snapPoints={[320, 0]}
            renderContent={renderContent}
            renderHeader={renderHeader}
            initialSnap={1}
            enabledGestureInteraction={true}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Animated.View style={[{
              opacity: Animated.add(0.4, Animated.multiply(fall, 1.0)),
            }]}>
              <Animatable.View
                animation="fadeIn"
              >
                <View style={{ marginTop: 8, alignSelf: "center" }}>
                  <View style={styles.profileImage}>
                    {data && data.photo.downloadURL !== undefined ?
                      <Image source={{ uri: data.photo.downloadURL }} style={styles.image} resizeMode="cover"></Image> :
                      <Image source={require("../../assets/blank-profile-picture.png")} style={styles.image} resizeMode="center"></Image>
                    }
                  </View>
                  <View style={data && data.show ? styles.active : styles.notActive} />
                  <TouchableOpacity style={styles.add} onPress={() => {
                    setShowFloatingButton(false)
                    setProfileImage(true)
                    bs.current.snapTo(0);
                  }}>
                    <Ionicons name="ios-add" size={48} color="#DFD8C8" style={{ marginTop: 2, marginLeft: 4 }}></Ionicons>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
              <View style={styles.infoContainer}>
                <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>{data && data.fullName}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowFloatingButton(false)
                    setShowModal(!showModal)
                  }
                  }>
                  <Text style={[styles.text, { color: "#AEB5BC", fontSize: 14 }]}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
              {data ?
                <View style={styles.ActiveContainer}>
                  <Text style={[styles.text, { marginLeft: 20, fontSize: 18 }]}>Active</Text>
                  <Switch style={[{ marginRight: 20 }]} value={data.show} onValueChange={(value) => { isActive(value) }} />
                </View> : null
              }
              <View style={{ marginTop: 32 }}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                  {data && data.images.length > 0 ? data.images.map((image, key) => {
                    return (
                      <View style={styles.mediaImageContainer}>
                        <Image source={{ uri: image.downloadURL }} style={styles.image} resizeMode="cover"></Image>
                        <View style={styles.remove}>
                          <TouchableOpacity key={{ key }} onPress={() => { removePhoto(image.id) }} >
                            <Entypo name="cross" size={20} color="#DFD8C8" style={{ marginTop: 2, marginLeft: 2 }}></Entypo>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }) : [1, 2, 3].map((value, index) => {
                    return (
                      <TouchableOpacity style={styles.mediaImageContainer} onPress={() => {
                        bs.current.snapTo(0)
                      }}>
                        <Image source={require("../../assets/blank-profile-picture.png")} style={styles.image} resizeMode="cover"></Image>
                        <TouchableOpacity style={styles.add2} onPress={() => {
                          setShowFloatingButton(false)
                          bs.current.snapTo(0)
                        }}>
                          <Ionicons name="ios-add" size={20} color="#DFD8C8" style={{ marginTop: 2, marginLeft: 2 }}></Ionicons>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    );
                  })}
                  {data && data.images.length > 0 && data.images.length <= 2 ? <View style={styles.mediaImageContainer}>
                    <Image source={require("../../assets/blank-profile-picture.png")} style={styles.image} resizeMode="cover"></Image>
                    <TouchableOpacity style={styles.add2} onPress={() => {
                      setShowFloatingButton(false)
                      bs.current.snapTo(0)
                    }}>
                      <Ionicons name="ios-add" size={20} color="#DFD8C8" style={{ marginTop: 2, marginLeft: 2 }}></Ionicons>
                    </TouchableOpacity>
                  </View> : null}
                </ScrollView>
                {data && data.images.length > 0 ?
                  <View style={styles.mediaCount}>
                    <Text style={[styles.text, { fontSize: 24, color: "#DFD8C8", fontWeight: "300" }]}>{data.images.length}/3</Text>
                    <Text style={[styles.text, { fontSize: 12, color: "#DFD8C8", textTransform: "uppercase" }]}>avail slots</Text>
                  </View> :
                  null
                }

              </View>
            </Animated.View>
          </ScrollView>
          {isFocused && showFloatingButton && (data && data.show) ?
            <FloatingActionButton navigation={navigation} /> : null
          }
        </>
      }
      {profileModal()}
    </View >
  )
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 100,
    overflow: "hidden"
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined
  },
  active: {
    backgroundColor: "#05375a",
    position: "absolute",
    bottom: 28,
    left: 10,
    padding: 4,
    height: 20,
    width: 20,
    borderRadius: 10
  },
  notActive: {
    backgroundColor: "#e74c3c",
    position: "absolute",
    bottom: 28,
    left: 10,
    padding: 4,
    height: 20,
    width: 20,
    borderRadius: 10
  },
  add: {
    backgroundColor: "#41444B",
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  add2: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  remove: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 16
  },
  ActiveContainer: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between'
  },
  mediaImageContainer: {
    width: 200,
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 10
  },
  mediaCount: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: "50%",
    marginTop: -100,
    marginLeft: 20,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    shadowColor: "rgba(0, 0, 0, 0.38)",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    shadowOpacity: 1
  },
  text: {
    fontFamily: "HelveticaNeue",
    color: "#52575D"
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
    // height: height / 1.5
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 8,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
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
})



const mapStateToProps = (state) => {
  return {
    authenticate: state.auth,
    profile: state.profile
  }
}

export default connect(mapStateToProps, { getCurrentProfile, uploadPhoto, removePhoto, loadUser, isActive })(ProfileTab)