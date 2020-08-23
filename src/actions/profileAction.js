import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase';
import { db } from '../config/firebase';

export const uploadPhoto = (image, isProfile) => {
    return async (dispatch, getState) => {
        try {

            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.onload = () => resolve(xhr.response)
                xhr.responseType = 'blob'
                xhr.open('GET', image.path, true)
                xhr.send(null)
            });
            const id = uuidv4();
            const uploadTask = await firebase.storage().ref().child(id).put(blob)
            const downloadURL = await uploadTask.ref.getDownloadURL();
            const setImage = {
                downloadURL,
                id
            };

            const user = getState().auth.uid

            if (isProfile) {
                // await firebase.storage().ref().child(image).delete();

                await db.collection('users').doc(user).set(
                    { photo: setImage },
                    { merge: true }
                );
            } else {
                await db.collection('users').doc(user).update({
                    images: firebase.firestore.FieldValue.arrayUnion(setImage)
                });
            }
            // return downloadURL
        } catch (e) {
            console.error(e)
        }
    }
}


export const removePhoto = (imageId, isProfile) => {
    return async (dispatch, getState) => {
        try {
            const user = getState().auth.uid;
            const profileRef = await db.collection('users').doc(user).get();
            const { images } = profileRef.data();
            const newImageArray = images.filter((image) => image.id !== imageId);

            await db.collection('users').doc(user).set(
                { images: newImageArray },
                { merge: true }
            );

            await firebase.storage().ref().child(imageId).delete();

        } catch (e) {
            console.error(e)
        }
    }
}

export const isActive = (active) => {
    return async (dispatch, getState) => {
        try {
            const user = getState().auth.uid;

            await db.collection('users').doc(user).set(
                { show: active },
                { merge: true }
            );

        } catch (e) {
            console.error(e)
        }
    }
}