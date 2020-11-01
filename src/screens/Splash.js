import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Text, View, StyleSheet, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slides from '../components/Slides';
import { auth } from '../config/firebase';
import { loadUser } from '../actions/index';
import AsyncStorage from '@react-native-community/async-storage';
import store from '../store';
const Splash = ({ authenticate, navigation }) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		auth.onAuthStateChanged(
			async (user) => {
				if (user) {
					await store.dispatch(loadUser(user.uid));
					navigation.navigate('Top Tabs');
				} else {
					console.log('no user logged in');
					await getIntroData();
				}
			},
			(error) => {
				console.log('error', error);
				setLoading(false);
			},
		);
	}, []);

	const { container, header, footer, logo, title, text, button, signIn, textSignIn } = styles;

	const slideData = [
		{ text: 'Lets Chat - Swipe', colour: '#05375a' },
		{ text: 'Chat', colour: '#e74c3c' },
		{ text: 'Meet up', colour: '#f1c40f', button: true },
	];

	const onSLidesComplete = () => {
		navigation.navigate('Login');
	};

	const handlePress = async () => {
		await AsyncStorage.setItem('intro', 'finished');
		navigation.navigate('Login');
	};

	const getIntroData = async () => {
		try {
			let res = await AsyncStorage.getItem('intro');
			if (res) {
				navigation.navigate('Login');
			} else {
				setLoading(false);
			}
		} catch (e) {
			console.log('e', e);
			console.log('e', e);
			// read error
		}

		console.log('Done.');
	};

	return (
		<View style={container}>
			<StatusBar barStyle="light-content" />
			{loading ? (
				<LottieView source={require('./loader.json')} autoPlay loop />
			) : (
				<>
					<Slides data={slideData} onComplete={onSLidesComplete} />
					<View style={header}>
						<Animatable.Image
							animation="bounceIn"
							duration={1500}
							source={require('../assets/map.png')}
							style={logo}
							resizeMode={'stretch'}
						/>
					</View>
					<Animatable.View animation="fadeInUpBig" style={footer}>
						<Text style={title}>Stay connected with us</Text>
						<Text style={text}>Sign in with account</Text>
						<View style={button}>
							<TouchableOpacity
								onPress={async () => {
									await AsyncStorage.setItem('intro', 'finished');
									navigation.navigate('Login');
									// handlePress();
								}}>
								<LinearGradient colors={['#05375a', '#05375a']} style={signIn}>
									<Text style={textSignIn}>Get started</Text>
									<Ionicons name="ios-arrow-forward" size={20} color="white" />
								</LinearGradient>
							</TouchableOpacity>
						</View>
					</Animatable.View>
				</>
			)}
		</View>
	);
};

const { height } = Dimensions.get('screen');
const height_logo = height * 0.7 * 0.4;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#05375a',
	},
	header: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	footer: {
		flex: 1,
		backgroundColor: 'white',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingVertical: 50,
		paddingHorizontal: 30,
	},
	logo: {
		width: height_logo,
		height: height_logo,
	},
	title: {
		color: '#05375a',
		fontWeight: 'bold',
		fontSize: 30,
	},
	text: {
		color: 'gray',
		marginTop: 5,
	},
	button: {
		alignItems: 'flex-end',
		marginTop: 30,
	},
	signIn: {
		width: 150,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 50,
		flexDirection: 'row',
	},
	textSignIn: {
		color: 'white',
		fontWeight: 'bold',
		margin: 8,
	},
});

const mapStateToProps = (state) => {
	return {
		authenticate: state.auth,
	};
};

export default connect(mapStateToProps, {})(Splash);
