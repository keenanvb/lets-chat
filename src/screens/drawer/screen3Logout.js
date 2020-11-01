import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { signOut } from '../../actions/index';

const Logout = ({ signOut, navigation }) => {
	const { container, button, signIn, textSignIn, signUp } = styles;

	const handleSignOut = () => {
		signOut(navigation);
	};

	return (
		<View style={container}>
			<View style={button}>
				<TouchableOpacity
					style={[signIn, signUp]}
					onPress={() => {
						handleSignOut();
					}}>
					<Text style={[textSignIn, { color: '#4dc2f8' }]}>Logout</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	textInput: {
		flex: 1,
		paddingLeft: 10,
		color: '#05375a',
	},
	button: {
		alignItems: 'center',
		marginTop: 50,
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
		marginTop: 5,
	},
});

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
	};
};

export default connect(mapStateToProps, { signOut })(Logout);
