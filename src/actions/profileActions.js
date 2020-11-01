import { GET_PROFILE, UPDATE_DISTANCE, UPDATE_LOCATION, UPDATE_RANGE } from './types';
import { GeoFirestore, db } from '../config/firebase';

import firebase from 'firebase';
import { v4 as uuidv4 } from 'uuid';

export const getCurrentProfile = () => {
	return async (dispatch, getState) => {
		try {
			const uid = getState().auth.uid;
			if (uid == null) {
				throw new Error('no uid');
			}
			const user = await db.collection('users').doc(uid).get();
			dispatch({ type: GET_PROFILE, payload: user.data() });
		} catch (e) {
			const uid = getState().auth.uid;
			alert(e);
		}
	};
};

export const uploadPhoto = (image, isProfile) => {
	return async (dispatch, getState) => {
		try {
			const blob = await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.onload = () => resolve(xhr.response);
				xhr.responseType = 'blob';
				xhr.open('GET', image.path, true);
				xhr.send(null);
			});
			const id = uuidv4();
			const uploadTask = await firebase.storage().ref().child(id).put(blob);
			const downloadURL = await uploadTask.ref.getDownloadURL();
			const setImage = {
				downloadURL,
				id,
			};

			const user = getState().auth.uid;

			if (isProfile) {
				// await firebase.storage().ref().child(image).delete();

				await db.collection('users').doc(user).set({ photo: setImage }, { merge: true });
			} else {
				await db
					.collection('users')
					.doc(user)
					.update({
						images: firebase.firestore.FieldValue.arrayUnion(setImage),
					});
			}
			// return downloadURL
		} catch (e) {
			console.error(e);
		}
	};
};

export const removePhoto = (imageId, isProfile) => {
	return async (dispatch, getState) => {
		try {
			const user = getState().auth.uid;
			const profileRef = await db.collection('users').doc(user).get();
			const { images } = profileRef.data();
			const newImageArray = images.filter((image) => image.id !== imageId);

			await db.collection('users').doc(user).set({ images: newImageArray }, { merge: true });

			await firebase.storage().ref().child(imageId).delete();
		} catch (e) {
			console.error(e);
		}
	};
};

export const isActive = (active) => {
	return async (dispatch, getState) => {
		try {
			const user = getState().auth.uid;

			await db.collection('users').doc(user).set({ show: active }, { merge: true });
		} catch (e) {
			console.error(e);
		}
	};
};

export const updateLocation = (location) => {
	return async (dispatch, getState) => {
		try {
			const user = getState().auth.uid;
			const profile = getState().auth.user;

			let setDestination = location.destination === '' ? 'Im here' : location.destination;

			await GeoFirestore.collection('users')
				.doc(user)
				.set(
					{
						destination: setDestination,
						coordinates: new firebase.firestore.GeoPoint(location.latitude, location.longitude),
						latlng: {
							latitude: location.latitude,
							longitude: location.longitude,
						},
					},
					{ merge: true },
				);

			dispatch({
				type: UPDATE_LOCATION,
				payload: {
					destination: setDestination,
					latlng: {
						latitude: location.latitude,
						longitude: location.longitude,
					},
				},
			});
		} catch (e) {
			console.error(e);
		}
	};
};

export const updateDistance = (distance) => {
	return async (dispatch, getState) => {
		try {
			const user = getState().auth.uid;

			let setDistance = distance[0];

			await db.collection('users').doc(user).set(
				{
					distance: setDistance,
				},
				{ merge: true },
			);

			dispatch({
				type: UPDATE_DISTANCE,
				payload: {
					distance: setDistance,
				},
			});
		} catch (e) {
			console.error(e);
		}
	};
};

export const updateAgeRange = (age) => {
	return async (dispatch, getState) => {
		try {
			const user = getState().auth.uid;

			await db
				.collection('users')
				.doc(user)
				.set(
					{
						ageRange: {
							min: age[0],
							max: age[1],
						},
					},
					{ merge: true },
				);

			dispatch({
				type: UPDATE_RANGE,
				payload: {
					ageRange: {
						min: age[0],
						max: age[1],
					},
				},
			});
		} catch (e) {
			console.error(e);
		}
	};
};
