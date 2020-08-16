import axios from 'axios'
import { setAlert } from './index'
import { auth, db } from '../config/firebase'
import firebase from 'firebase'
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOG_OUT } from './types';
// import setAuthToken from '../utils/setAuthToken'

//Load user
// export const loadUser = (uid) => {
//     return async (dispatch) => {
//         // if (localStorage.token) {
//         //     setAuthToken(localStorage.token)
//         // }

//         try {
//             dispatch({
//                 type: USER_LOADED,
//                 payload: res.data
//             })
//         } catch (err) {
//             dispatch({
//                 type: AUTH_ERROR
//             })
//         }

//     }
// }

//same as load user
export const loadUser = (uid) => {
    return async (dispatch, getState) => {
        try {
            const user = await db.collection('users').doc(uid).get()
            dispatch({ type: USER_LOADED, payload: user.data() })
        } catch (e) {
            alert(e)
        }
    }
}

//Register user
export const registerWithEmailAndPassword = ({ fullName, email, password }, navigation) => {
    return async (dispatch) => {
        try {
            let response = await auth.createUserWithEmailAndPassword(email, password);

            if (response.user.uid) {
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
                    geocode: '',
                    swipes: {
                        [response.user.uid]: false
                    },
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }

                await db.collection('users').doc(response.user.uid).set(user);

                dispatch({
                    type: REGISTER_SUCCESS,
                    payload: response.user.uid
                });

                //load user
                dispatch(loadUser(response.user.uid));


                navigation.navigate('Top Tabs')
            }

        } catch (err) {
            console.log('err', err);
            // dispatch(setAlert(err.msg, 'danger'))
            dispatch({
                type: REGISTER_FAIL
            });
        }
    }
}

//Login user
export const loginWithEmailAndPassword = ({ email, password }, navigation) => {
    return async (dispatch) => {
        try {
            let response = await auth.signInWithEmailAndPassword(email, password);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: response.user.uid
            });

            //load user
            dispatch(loadUser(response.user.uid));

            navigation.navigate('Top Tabs');
        } catch (err) {
            console.log('err', err);
            dispatch(setAlert('Oops something went wrong', 'danger'));

            dispatch({
                type: LOGIN_FAIL
            });
        }
    }
}

export const signOut = (navigation) => {
    return async (dispatch) => {
        try {
            await auth.signOut();

            navigation.navigate('Login');

            dispatch({
                type: LOG_OUT
            })
        } catch (err) {
            console.log('logout err', err);
        }

    }
}

export const resetPassword = (email, navigation) => {
    return async (dispatch) => {
        try {
            await auth.sendPasswordResetEmail(email);
            navigation.navigate('Login');

        } catch (err) {
            console.log('ForgotPassword err', err);
        }
    }
}