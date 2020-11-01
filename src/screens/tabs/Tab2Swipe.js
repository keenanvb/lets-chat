import React, { useState, useRef, useEffect } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
	Modal,
	TouchableHighlight,
	TextInput,
	Platform,
	Image,
	ScrollView,
	Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import { updateLocation, getCurrentProfile, updateDistance, updateAgeRange } from '../../actions/index';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import Card from '../../components/Card';
import CardSection from '../../components/CardSection';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions';
import * as Animatable from 'react-native-animatable';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import LottieView from 'lottie-react-native';

const SwipeTab = ({
	authenticate: { user, uid },
	profile: { profile, loading },
	navigation,
	updateLocation,
	getCurrentProfile,
	updateDistance,
	updateAgeRange,
}) => {
	const mapRef = useRef(null);
	const isFocused = useIsFocused();

	const [showModal, setShowModal] = useState(false);
	const [showDistanceModal, setDistanceShowModal] = useState(false);
	const [showAgeRangeModal, setAgeRangeShowModal] = useState(false);
	const [showGenderModal, setGenderShowModal] = useState(false);

	const [location, setLocation] = useState({
		latitude: 0,
		longitude: 0,
	});

	const [predictions, setPredictions] = useState([]);
	const [destination, setDestination] = useState('');

	const [multiSliderValue, setMultiSliderValue] = useState([0, 100]);
	const [singleSliderValue, setSingleSliderValue] = useState([0]);

	const goToSwipe = () => {
		navigation.navigate('Swipe');
	};

	useEffect(() => {
		getCurrentProfile();
		// (async () => {
		//   if (Platform.OS === 'ios') {
		//     let response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
		//     if (response === 'granted') {
		//       locateCurrentPosition()
		//     }
		//   }

		//   if (Platform.OS === 'android') {
		//     let response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
		//     if (response === 'granted') {
		//       locateCurrentPosition()
		//     }
		//   }
		// })();
		setLocation({
			latitude: !loading && profile.latlng.latitude ? profile.latlng.latitude : 0,
			longitude: !loading && profile.latlng.longitude ? profile.latlng.longitude : 0,
		});
		setSingleSliderValue([!loading && profile.distance ? profile.distance : 0]);

		setMultiSliderValue([
			!loading && profile.ageRange ? profile.ageRange.min : 0,
			profile && profile.ageRange ? profile.ageRange.max : 55,
		]);
	}, [getCurrentProfile, loading]);

	console.log('location', location);

	const locateCurrentPosition = (findMe) => {
		Geolocation.getCurrentPosition((position) => {
			const {
				coords: { latitude, longitude },
			} = position;

			setLocation({ latitude: latitude, longitude: longitude });

			if (findMe) {
				setDestination('');
				mapRef.current.animateToRegion(
					{
						latitude: latitude,
						longitude: longitude,
						latitudeDelta: 0.1,
						longitudeDelta: 0.1,
					},
					300,
				);
			}
		});
	};

	let onRegionChange = (region) => {
		// setLocation({ latitude: region.latitude, longitude: region.longitude });
	};

	const multiSliderValuesChange = (values) => setMultiSliderValue(values);
	const singleSliderValuesChange = (values) => setSingleSliderValue(values);

	const callAPI = _.debounce(async () => {
		const { latitude, longitude } = setLocation;

		try {
			const api = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=GOOGLE_API_KEY&input=${destination}&location=${latitude},${longitude}&radius=20000`;
			let res = await axios.get(api);

			let data = res.data.predictions;
			setPredictions(data);
		} catch (err) {
			console.log('err', err);
		}
	}, 1000);

	const { longitude, latitude } = location;

	const onChangeDestination = async (text) => {
		setDestination(text);
		await callAPI();
	};

	const handleUpdateLocation = () => {
		setShowModal(!showModal);
		let obj = Object.assign(location, { destination });
		updateLocation(obj);
	};

	const predictionList = predictions.map((prediction) => {
		return (
			<TouchableHighlight
				onPress={async () => {
					let api = `https://maps.googleapis.com/maps/api/geocode/json?address=${prediction.description}&key=GOOGLE_API_KEY`;
					let res = await axios.get(api);
					const { formatted_address, geometry } = res.data.results[0];
					console.log('formatted_address', formatted_address);
					console.log('geometry', geometry);
					setDestination(formatted_address);
					setPredictions([]);
					Keyboard.dismiss();
					setLocation({
						latitude: geometry.location.lat,
						longitude: geometry.location.lng,
					});
					mapRef.current.animateToRegion(
						{
							latitude: geometry.location.lat,
							longitude: geometry.location.lng,
							latitudeDelta: 0.1,
							longitudeDelta: 0.1,
						},
						300,
					);
				}}
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
				}}>
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
								<Text>Yup im here now</Text>
							</Callout>
						</Marker>
					</MapView>
					<TextInput
						style={styles.destinationInput}
						onChangeText={(text) => onChangeDestination(text)}
						placeholder="Enter destination"
						value={destination}
					/>

					<View style={styles.button}>
						<TouchableOpacity
							style={{ marginBottom: 10 }}
							onPress={() => {
								handleUpdateLocation();
							}}>
							<LinearGradient colors={['#05375a', '#05375a']} style={styles.signIn}>
								<Text style={styles.textSignIn}>Update Location</Text>
							</LinearGradient>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ marginBottom: 10 }}
							onPress={() => {
								locateCurrentPosition(true);
								// setShowModal(!showModal)
								// setShowModal(!showModal)
								// setShowModal(!showModal)
							}}>
							<LinearGradient colors={['#05375a', '#05375a']} style={styles.signIn}>
								<Text style={styles.textSignIn}>Find me</Text>
							</LinearGradient>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								setShowModal(!showModal);
							}}>
							<LinearGradient colors={['#05375a', '#05375a']} style={styles.signIn}>
								<Text style={styles.textSignIn}>Cancel</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>
					{destination.length > 0 ? <View>{predictionList}</View> : null}
				</SafeAreaView>
			</Modal>
		);
	};

	const distanceModel = () => {
		return (
			<Modal
				animationType="fade"
				transparent={false}
				visible={showDistanceModal}
				onRequestClose={() => {
					// Alert.alert("Modal has been closed.");
				}}>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<TouchableHighlight
							onPress={() => {
								setDistanceShowModal(!showDistanceModal);
							}}
							style={[{ position: 'absolute', top: 4, right: 4 }]}>
							<Ionicons name="ios-close-outline" size={30} color="black" />
						</TouchableHighlight>
						<TouchableHighlight>
							<Text style={styles.modalText}>Maximum Distance {singleSliderValue}</Text>
						</TouchableHighlight>
						<MultiSlider
							isMarkersSeparated={false}
							markerStyle={{
								...Platform.select({
									ios: {
										height: 30,
										width: 30,
										shadowColor: '#000000',
										shadowOffset: {
											width: 0,
											height: 3,
										},
										shadowRadius: 1,
										shadowOpacity: 0.1,
									},
									android: {
										height: 30,
										width: 30,
										borderRadius: 50,
										backgroundColor: '#1792E8',
									},
								}),
							}}
							pressedMarkerStyle={{
								...Platform.select({
									android: {
										height: 30,
										width: 30,
										borderRadius: 20,
										backgroundColor: '#148ADC',
									},
								}),
							}}
							selectedStyle={{
								backgroundColor: '#1792E8',
							}}
							trackStyle={{
								backgroundColor: '#CECECE',
							}}
							touchDimensions={{
								height: 40,
								width: 40,
								borderRadius: 20,
								slipDisplacement: 40,
							}}
							values={singleSliderValue}
							sliderLength={280}
							onValuesChange={singleSliderValuesChange}
							min={2}
							max={100}
							allowOverlap={false}
							// minMarkerOverlapDistance={10}
						/>
						<View>
							<TouchableOpacity
								onPress={() => {
									updateDistance(singleSliderValue);
									setDistanceShowModal(!showDistanceModal);
								}}>
								<LinearGradient colors={['#05375a', '#05375a']} style={[styles.signIn]}>
									<Text style={[styles.textSignIn]}>Save</Text>
									<Ionicons name="ios-arrow-forward" size={20} color="white" />
								</LinearGradient>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		);
	};

	const showMeModel = () => {
		return (
			<Modal
				animationType="fade"
				transparent={false}
				visible={showGenderModal}
				onRequestClose={() => {
					// Alert.alert("Modal has been closed.");
				}}>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<TouchableHighlight
							onPress={() => {
								setGenderShowModal(!showGenderModal);
							}}
							style={[{ position: 'absolute', top: 4, right: 4 }]}>
							<Ionicons name="ios-close-outline" size={30} color="black" />
						</TouchableHighlight>
						<TouchableHighlight
							onPress={() => {
								setGenderShowModal(!showGenderModal);
							}}>
							<Text style={styles.modalText}>Show Me</Text>
						</TouchableHighlight>
						<MultiSlider
							isMarkersSeparated={true}

							// customMarkerLeft={(e) => {
							//      return (<CustomSliderMarkerLeft
							//       currentValue={e.currentValue}/>)
							// }}

							// customMarkerRight={(e) => {
							//      return (<CustomSliderMarkerRight
							//      currentValue={e.currentValue}/>)
							// }}
						/>
					</View>
				</View>
			</Modal>
		);
	};

	const showAgeModel = () => {
		return (
			<Modal
				animationType="fade"
				transparent={false}
				visible={showAgeRangeModal}
				onRequestClose={() => {
					// Alert.alert("Modal has been closed.");
				}}>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<TouchableHighlight
							onPress={() => {
								setAgeRangeShowModal(!showAgeRangeModal);
							}}
							style={[{ position: 'absolute', top: 4, right: 4 }]}>
							<Ionicons name="ios-close-outline" size={30} color="black" />
						</TouchableHighlight>
						<TouchableHighlight>
							<Text style={styles.modalText}>
								Age Range: {`${multiSliderValue[0]}-${multiSliderValue[1]}`}
							</Text>
						</TouchableHighlight>
						<MultiSlider
							isMarkersSeparated={true}
							markerStyle={{
								...Platform.select({
									ios: {
										height: 30,
										width: 30,
										shadowColor: '#000000',
										shadowOffset: {
											width: 0,
											height: 3,
										},
										shadowRadius: 1,
										shadowOpacity: 0.1,
									},
									android: {
										height: 30,
										width: 30,
										borderRadius: 50,
										backgroundColor: '#1792E8',
									},
								}),
							}}
							pressedMarkerStyle={{
								...Platform.select({
									android: {
										height: 30,
										width: 30,
										borderRadius: 20,
										backgroundColor: '#148ADC',
									},
								}),
							}}
							selectedStyle={{
								backgroundColor: '#1792E8',
							}}
							trackStyle={{
								backgroundColor: '#CECECE',
							}}
							touchDimensions={{
								height: 40,
								width: 40,
								borderRadius: 20,
								slipDisplacement: 40,
							}}
							values={[multiSliderValue[0], multiSliderValue[1]]}
							sliderLength={280}
							onValuesChange={multiSliderValuesChange}
							min={18}
							max={55}
							allowOverlap={false}
							minMarkerOverlapDistance={1}
						/>
						<View>
							<TouchableOpacity
								onPress={() => {
									updateAgeRange(multiSliderValue);
									setAgeRangeShowModal(!showAgeRangeModal);
								}}>
								<LinearGradient colors={['#05375a', '#05375a']} style={[styles.signIn]}>
									<Text style={[styles.textSignIn]}>Save</Text>
									<Ionicons name="ios-arrow-forward" size={20} color="white" />
								</LinearGradient>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		);
	};

	return (
		<View style={[styles.container]}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{/* <View style={styles.swipeInfoContainer}>
          <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>Swipe Settings</Text>
        </View> */}
				{/* <Card>
          <TouchableOpacity >
            <CardSection>
              <Text style={[styles.bold, styles.text, styles.center]}>Interested in</Text>
              <View style={styles.iconContent}>
                <Ionicons style={styles.icon} name='ios-arrow-forward' size={20} color='black' />
              </View>
            </CardSection>
          </TouchableOpacity>
        </Card> */}
				<Card>
					<TouchableOpacity onPress={() => setShowModal(!showModal)}>
						<CardSection>
							{/* <Text style={[styles.bold, styles.text, styles.center]}>Current location</Text> */}
							<Text style={[{ top: -14 }, styles.bold, styles.text, styles.center]}>
								Current location
							</Text>
							<Text
								style={[
									{
										position: 'absolute',
										color: '#AEB5BC',
										fontSize: 6,
										bottom: 2,
										left: 6,
										marginTop: 10,
									},
									styles.center,
								]}>
								{profile && profile.destination}
							</Text>
							<View style={styles.iconContent}>
								<Ionicons style={styles.icon} name="ios-arrow-forward" size={20} color="black" />
							</View>
						</CardSection>
					</TouchableOpacity>
				</Card>
				<Card>
					<TouchableOpacity
						onPress={() => {
							setDistanceShowModal(!showDistanceModal);
						}}>
						<CardSection>
							<Text style={[{ top: -14 }, styles.bold, styles.text, styles.center]}>
								Maximum distance
							</Text>
							<Text
								style={[
									{
										position: 'absolute',
										color: '#AEB5BC',
										fontSize: 6,
										bottom: 2,
										left: 6,
										marginTop: 10,
									},
									styles.center,
								]}>
								{profile && profile.distance} KM
							</Text>
							<View style={styles.iconContent}>
								<Ionicons style={styles.icon} name="ios-arrow-down" size={20} color="black" />
							</View>
						</CardSection>
					</TouchableOpacity>
				</Card>
				<Card>
					<TouchableOpacity
						onPress={() => {
							setGenderShowModal(!showGenderModal);
						}}>
						<CardSection>
							<Text style={[styles.bold, styles.text, styles.center]}>Show Me</Text>
							<View style={styles.iconContent}>
								<Ionicons style={styles.icon} name="ios-arrow-down" size={20} color="black" />
							</View>
						</CardSection>
					</TouchableOpacity>
				</Card>
				<Card>
					<TouchableOpacity
						onPress={() => {
							setAgeRangeShowModal(!showAgeRangeModal);
						}}>
						<CardSection>
							<Text style={[{ top: -14 }, styles.bold, styles.text, styles.center]}>Age range</Text>
							<Text
								style={[
									{
										position: 'absolute',
										color: '#AEB5BC',
										fontSize: 6,
										bottom: 2,
										left: 6,
										marginTop: 10,
									},
									styles.center,
								]}>
								{profile && profile.ageRange.min} - {profile && profile.ageRange.max}
							</Text>
							<View style={styles.iconContent}>
								<Ionicons style={styles.icon} name="ios-arrow-down" size={20} color="black" />
							</View>
						</CardSection>
					</TouchableOpacity>
				</Card>
				<Card>
					<TouchableOpacity onPress={() => goToSwipe()}>
						<CardSection>
							<Text style={[styles.bold, styles.text, styles.center]}>Swipe</Text>
							<View style={styles.iconContent}>
								<MaterialCommunityIcons
									style={styles.icon}
									name="gesture-swipe"
									size={20}
									color="black"
								/>
							</View>
						</CardSection>
					</TouchableOpacity>
				</Card>
				{modal()}
				{distanceModel()}
				{showMeModel()}
				{showAgeModel()}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	text: {
		fontFamily: 'HelveticaNeue',
		color: '#52575D',
	},
	signIn: {
		width: '100%',
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		flexDirection: 'row',
	},
	textSignIn: {
		color: 'white',
		fontWeight: 'bold',
		margin: 8,
		fontSize: 18,
	},
	signUp: {
		borderWidth: 1,
		borderColor: '#4dc2f8',
		marginTop: 15,
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
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
		marginLeft: 10,
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
		alignSelf: 'center',
		alignItems: 'center',
		marginTop: 16,
	},
	swipe: {
		position: 'absolute',
		bottom: 10,
	},
});

// export default SwipeTab;

const mapStateToProps = (state) => {
	return {
		authenticate: state.auth,
		profile: state.profile,
	};
};

export default connect(mapStateToProps, {
	getCurrentProfile,
	updateLocation,
	updateDistance,
	updateAgeRange,
})(SwipeTab);
