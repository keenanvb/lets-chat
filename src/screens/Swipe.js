import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Animated,
	PanResponder,
	TouchableOpacity,
	Dimensions,
	ActivityIndicator,
} from 'react-native';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { db, GeoFirestore } from '../config/firebase';
import { createChatId } from '../utils/utils';
import { getCurrentProfile } from '../actions/index';
import firebase from 'firebase';
import Card from '../components/Card';
import CardSection from '../components/CardSection';
// import { GeoCollectionReference, GeoFirestore, GeoQuery, GeoQuerySnapshot } from 'geofirestore';
function clamp(value, min, max) {
	return min < max ? (value < min ? min : value > max ? max : value) : value < max ? max : value > min ? min : value;
}

// let SWIPE_THRESHOLD = 120;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_HEIGHT2 = SCREEN_HEIGHT / 3;
const SWIPE_THRESHOLD = 0.5 * SCREEN_WIDTH;

const Swipe = ({ authenticate, profile: { profile, loading }, getCurrentProfile }) => {
	const [users, setUsers] = useState(null);
	const [yesLoading, setYesLoading] = useState(false);

	const [location, setLocation] = useState({
		latitude: 0,
		longitude: 0,
	});

	const { latitude, longitude } = location;

	useEffect(() => {
		getCurrentProfile();
		setLocation({
			latitude: !loading && profile ? profile.latlng.latitude : null,
			longitude: !loading && profile ? profile.latlng.longitude : null,
		});
		// // Create a GeoCollection reference
		const geocollection = GeoFirestore.collection('users');

		// Create a GeoQuery based on a location
		if (latitude && longitude) {
			const query = geocollection.near({
				center: new firebase.firestore.GeoPoint(latitude, longitude),
				radius: 100000,
			});
			// Get query (as Promise)
			query.get().then((value) => {
				let userList = [];
				// All GeoDocument returned by GeoQuery, like the GeoDocument added above
				value.forEach((doc) => {
					let data = doc.data();
					// if (data.uid !== authenticate.uid && data.swipes[authenticate.uid] === false || data.swipes[authenticate.uid] === undefined) {
					if (data.uid !== authenticate.uid) {
						userList.push(data);
					}
				});
				setUsers(userList);
				// setUsers(userList);
			});
		}
	}, [getCurrentProfile, loading, latitude, longitude]);

	const state = {
		animation: new Animated.ValueXY(),
		opacity: new Animated.Value(1),
		next: new Animated.Value(0.9),
	};

	let currentCard = null;

	const checkMatch = async () => {
		console.log('authenticate.uid', authenticate);
		console.log('checking match', currentCard.swipes[authenticate.uid]);
		try {
			if (authenticate.user.swipes[currentCard.uid] === true) {
				let me = {
					id: authenticate.uid,
					fullName: authenticate.user.fullName,
					notifications: 0,
					// photo: currentCard.photo,
					// createdAt: firebase.firestore.FieldValue.serverTimestamp(), //Time stamp not supported in arrays??
					// updateAt: firebase.firestore.FieldValue.serverTimestamp(),
				};

				let connection = {
					users: [me],
					// notifications: [],
				};

				let checkConnectionOther = await db.collection('connections').doc(currentCard.uid).get();
				if (checkConnectionOther && checkConnectionOther.exists) {
					await db
						.collection('connections')
						.doc(currentCard.uid)
						.update({
							users: firebase.firestore.FieldValue.arrayUnion(me),
						});
				} else {
					await db.collection('connections').doc(currentCard.uid).set(connection);
				}
				// await db.collection('connections').doc(currentCard.uid).set(connection);

				// await db.collection('connections').doc(currentCard.uid).update({
				//   users: firebase.firestore.FieldValue.arrayUnion(me)
				// });

				let otheUser = {
					id: currentCard.uid,
					fullName: currentCard.fullName,
					notifications: 0,
					// photo: currentCard.photo,
					// createdAt: firebase.firestore.FieldValue.serverTimestamp(),
					// updateAt: firebase.firestore.FieldValue.serverTimestamp(),
				};

				let connection2 = {
					users: [otheUser],
					// notifications: [],
				};
				// await db.collection('connections').doc(authenticate.uid).set(connection2);
				await db
					.collection('connections')
					.doc(authenticate.uid)
					.update({
						users: firebase.firestore.FieldValue.arrayUnion(otheUser),
					});

				let checkConnect = await db.collection('connections').doc(currentCard.uid).get();
				if (checkConnect && checkConnect.exists) {
					await db
						.collection('connections')
						.doc(authenticate.uid)
						.update({
							users: firebase.firestore.FieldValue.arrayUnion(otheUser),
						});
				} else {
					await db.collection('connections').doc(authenticate.uid).set(connection);
				}

				let chat = {
					notifications: [],
					messages: [],
				};

				await db.collection('chats').doc(createChatId(authenticate.uid, currentCard.uid)).set(chat);
			}
		} catch (e) {
			console.log('checkMatch error', e);
		}
	};

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
				await Animated.decay(state.animation, {
					velocity: {
						x: velocity,
						y: vy,
					},
					deceleration: 0.98,
					useNativeDriver: true,
				}).start(transitionNext);

				await handleFirebaseYes();
			} else if (dx < -SWIPE_THRESHOLD) {
				await handleFirebaseNo();
				Animated.decay(state.animation, {
					velocity: {
						x: velocity,
						y: vy,
					},
					deceleration: 0.98,
					useNativeDriver: true,
				}).start(transitionNext);
			} else {
				Animated.spring(state.animation, {
					toValue: {
						x: 0,
						y: 0,
					},
					friction: 4,
					useNativeDriver: true,
				}).start();
			}
		},
	});

	const transitionNext = () => {
		Animated.parallel([
			Animated.timing(state.opacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.spring(state.next, {
				toValue: 1,
				friction: 4,
				useNativeDriver: true,
			}),
		]).start(() => {
			setUsers(users.slice(1));
			state.next.setValue(0.9);
			state.opacity.setValue(1);
			state.animation.setValue({
				x: 0,
				y: 0,
			});
			setYesLoading(false);
		});
	};

	const handleNo = async () => {
		await handleFirebaseNo();
		Animated.timing(state.animation.x, {
			toValue: -SWIPE_THRESHOLD,
			useNativeDriver: true,
		}).start(transitionNext);
	};
	const handleYes = async () => {
		await handleFirebaseYes();
		Animated.timing(state.animation.x, {
			toValue: SWIPE_THRESHOLD,
			useNativeDriver: true,
		}).start(transitionNext);
	};

	const handleFirebaseYes = async () => {
		setYesLoading(true);
		await db
			.collection('users')
			.doc(currentCard.uid)
			.update({
				[`swipes.${authenticate.uid}`]: true,
			});
		console.log('handing yes');
		await checkMatch();
	};

	const handleFirebaseNo = async () => {
		// await db.collection('users').doc(currentCard.uid).update({
		//   [`swipes.${authenticate.uid}`]: false
		// });
		setYesLoading(true);
		console.log('thats a no');
	};

	const { animation } = state;

	const rotate = animation.x.interpolate({
		inputRange: [-200, 0, 200],
		outputRange: ['-30deg', '0deg', '30deg'],
		extrapolate: 'clamp',
	});

	const opacity = animation.x.interpolate({
		inputRange: [-200, 0, 200],
		outputRange: [0.5, 1, 0.5],
	});

	const yesOpacity = animation.x.interpolate({
		inputRange: [0, 150],
		outputRange: [0, 1],
	});
	const yesScale = animation.x.interpolate({
		inputRange: [0, 150],
		outputRange: [0.5, 1],
		extrapolate: 'clamp',
	});
	const animatedYupStyles = {
		transform: [
			{
				scale: yesScale,
			},
			{
				rotate: '-30deg',
			},
		],
		opacity: yesOpacity,
	};

	const noOpacity = animation.x.interpolate({
		inputRange: [-150, 0],
		outputRange: [1, 0],
	});
	const noScale = animation.x.interpolate({
		inputRange: [-150, 0],
		outputRange: [1, 0.5],
		extrapolate: 'clamp',
	});
	const animatedNopeStyles = {
		transform: [
			{
				scale: noScale,
			},
			{
				rotate: '30deg',
			},
		],
		opacity: noOpacity,
	};

	const animatedCardStyles = {
		transform: [
			{
				rotate,
			},
			...state.animation.getTranslateTransform(),
		],
		opacity: state.opacity,
	};

	const animatedImageStyles = {
		opacity,
	};

	if (users === null) {
		return <LottieView source={require('./loader.json')} autoPlay loop />;
	}

	return (
		<View style={styles.container}>
			{yesLoading ? (
				<LottieView source={require('./like.json')} autoPlay loop />
			) : (
				<>
					{users.length > 0 ? (
						<>
							<View style={styles.top}>
								{users
									.slice(0, 2)
									.reverse()
									.map(({ photo, id, email }, index, items) => {
										const isLastItem = index === items.length - 1;
										const isSecondToLast = index === items.length - 2;
										const panHandlers = isLastItem ? _panResponder.panHandlers : {};
										const cardStyle = isLastItem ? animatedCardStyles : undefined;
										const imageStyle = isLastItem ? animatedImageStyles : undefined;
										const nextStyle = isSecondToLast
											? {
													transform: [
														{
															scale: state.next,
														},
													],
											  }
											: undefined;

										if (items.length === 1) {
											currentCard = items[0];
										} else {
											currentCard = items[1];
										}

										// console.log('currentCard', currentCard);
										return (
											<Animated.View
												{...panHandlers}
												style={[styles.card, cardStyle, nextStyle]}
												key={`${index}-${id}`}>
												<Animated.Image
													source={{
														uri: photo.downloadURL,
													}}
													style={[styles.image, imageStyle]}
													resizeMode="cover"
												/>
												<View style={styles.lowerText}>
													<Text>{email}</Text>
												</View>

												{isLastItem && (
													<Animated.View style={[styles.nope, animatedNopeStyles]}>
														<Text style={styles.nopeText}>Nope!</Text>
													</Animated.View>
												)}

												{isLastItem && (
													<Animated.View style={[styles.yup, animatedYupStyles]}>
														<Text style={styles.yupText}>Yup!</Text>
													</Animated.View>
												)}
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
						</>
					) : (
						<>
							<LottieView source={require('./like.json')} autoPlay loop />
							<Animatable.View animation="fadeIn">
								<View style={styles.InfoContainer}>
									<Text
										style={[
											styles.text,
											{
												fontWeight: '200',
												fontSize: 36,
											},
										]}>
										No More Connections
									</Text>
								</View>
							</Animatable.View>
						</>
					)}
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	top: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonBar: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 10,
	},
	button: {
		marginHorizontal: 10,
		padding: 20,
		borderRadius: 30,
		alignItems: 'center',
		justifyContent: 'center',
		shadowOpacity: 0.3,
		shadowOffset: {
			x: 0,
			y: 0,
		},
		shadowRadius: 5,
	},
	yupButton: {
		shadowColor: 'green',
	},
	nopeButton: {
		shadowColor: 'red',
	},
	card: {
		width: 400,
		height: 500,
		paddingVertical: 50,
		position: 'absolute',
		borderRadius: 3,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowOffset: {
			x: 0,
			y: 0,
		},
		shadowRadius: 5,
		borderWidth: 1,
		borderColor: '#FFF',
	},
	lowerText: {
		flex: 1,
		backgroundColor: '#FFF',
		padding: 5,
	},
	image: {
		width: null,
		height: null,
		borderRadius: 2,
		flex: 3,
	},
	yup: {
		borderColor: 'green',
		borderWidth: 2,
		position: 'absolute',
		padding: 20,
		borderRadius: 5,
		top: 20,
		left: 20,
		backgroundColor: '#FFF',
	},
	yupText: {
		fontSize: 16,
		color: 'green',
	},
	nope: {
		borderColor: 'red',
		borderWidth: 2,
		position: 'absolute',
		padding: 20,
		borderRadius: 5,
		right: 20,
		top: 20,
		backgroundColor: '#FFF',
	},
	nopeText: {
		fontSize: 16,
		color: 'red',
	},
	InfoContainer: {
		alignSelf: 'center',
		alignItems: 'center',
		marginTop: 16,
	},
	text: {
		fontFamily: 'HelveticaNeue',
		color: '#52575D',
	},
});

const mapStateToProps = (state) => {
	return {
		authenticate: state.auth,
		profile: state.profile,
	};
};

export default connect(mapStateToProps, {
	getCurrentProfile,
})(Swipe);
