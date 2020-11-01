import { AUTH_ERROR, LOGIN_FAIL, LOGIN_SUCCESS, LOG_OUT, REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED } from './types';
import { GeoFirestore, auth, db } from '../config/firebase';
import { PERMISSIONS, request } from 'react-native-permissions';

import Geolocation from '@react-native-community/geolocation';
import { Platform } from 'react-native';
import firebase from 'firebase';
import { setAlert } from './index';

//same as load user
export const loadUser = (uid) => {
	return async (dispatch, getState) => {
		try {
			const user = await db.collection('users').doc(uid).get();
			dispatch({ type: USER_LOADED, payload: user.data() });
		} catch (e) {
			alert(e);
		}
	};
};

//Register user
export const registerWithEmailAndPassword = ({ fullName, email, password }, navigation) => {
	return async (dispatch) => {
		try {
			let response = await auth.createUserWithEmailAndPassword(email, password);
			let location = await requestLocationPermissions();
			if (response.user.uid && location) {
				const user = {
					uid: response.user.uid,
					email,
					fullName: fullName,
					photo: '',
					bio: '',
					token: null,
					images: [],
					show: false,
					report: [],
					ageRange: {
						min: 21,
						max: 55,
					},
					latlng: location,
					coordinates: new firebase.firestore.GeoPoint(40.7589, -73.9851),
					distance: 4,
					swipes: {
						[response.user.uid]: false,
					},
					createdAt: firebase.firestore.FieldValue.serverTimestamp(),
					updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
				};

				await GeoFirestore.collection('users').doc(response.user.uid).set(user);

				dispatch({
					type: REGISTER_SUCCESS,
					payload: response.user.uid,
				});

				//load user
				dispatch(loadUser(response.user.uid));

				navigation.navigate('Top Tabs');
			}
		} catch (err) {
			console.log('err', err);
			// dispatch(setAlert(err.msg, 'danger'))
			dispatch({
				type: REGISTER_FAIL,
			});
		}
	};
};

//Login user
export const loginWithEmailAndPassword = ({ email, password }, navigation) => {
	return async (dispatch) => {
		try {
			let response = await auth.signInWithEmailAndPassword(email, password);
			dispatch({
				type: LOGIN_SUCCESS,
				payload: response.user.uid,
			});

			//load user
			dispatch(loadUser(response.user.uid));

			navigation.navigate('Top Tabs');
		} catch (err) {
			console.log('err', err);
			dispatch(setAlert('Oops something went wrong', 'danger'));

			dispatch({
				type: LOGIN_FAIL,
			});
		}
	};
};

export const signOut = (navigation) => {
	return async (dispatch) => {
		try {
			await auth.signOut();

			navigation.navigate('Login');

			dispatch({
				type: LOG_OUT,
			});
		} catch (err) {
			console.log('logout err', err);
		}
	};
};

export const resetPassword = (email, navigation) => {
	return async (dispatch) => {
		try {
			await auth.sendPasswordResetEmail(email);
			navigation.navigate('Login');
		} catch (err) {
			console.log('ForgotPassword err', err);
		}
	};
};

const locateCurrentPosition = () => {
	return new Promise((resolve, reject) => {
		Geolocation.getCurrentPosition((position) => {
			const {
				coords: { latitude, longitude },
			} = position;
			if (position) {
				resolve({
					latitude,
					longitude,
				});
			} else {
				reject(null);
			}
		});
	});
};

const requestLocationPermissions = async () => {
	if (Platform.OS === 'ios') {
		let response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
		if (response === 'granted') {
			return await locateCurrentPosition();
		}
	}

	if (Platform.OS === 'android') {
		let response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
		if (response === 'granted') {
			return await locateCurrentPosition();
		}
	}
};
