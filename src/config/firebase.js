import firebase from 'firebase';
require('firebase/firestore');
require('firebase/auth');
// require('firebase/database');
require('firebase/functions');
import * as geofirestore from 'geofirestore';

const firebaseConfig = {};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Create a Firestore reference
// const firestore = firebase.firestore();

// firebase.analytics();
export const db = firebaseApp.firestore();
// firebase.firestore.setLogLevel('debug');
firebase.firestore().settings({ experimentalForceLongPolling: true });
// export const database = firebaseApp.database();
export const auth = firebaseApp.auth();
export const functions = firebaseApp.functions();

// Create a GeoFirestore reference
export const GeoFirestore = geofirestore.initializeApp(db);
