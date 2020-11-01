import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

const Card = ({ children }) => {
	const { container } = styles;

	return <View style={container}>{children}</View>;
};

const styles = StyleSheet.create({
	container: {
		borderWidth: 0.2,
		borderRadius: 2,
		borderColor: '#ddd',
		borderBottomWidth: 0,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 1,
		marginLeft: 5,
		marginRight: 5,
		marginTop: 10,
	},
});

export default Card;
