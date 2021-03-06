import React from 'react';

import { StyleSheet, Text, TextInput, View } from 'react-native';

const Input = ({ label, name, value, onChangeText, placeholder, secureTextEntry, multiline, children }) => {
	const { inputStyle, labelStyle, containerStyle } = styles;

	return (
		<View style={containerStyle}>
			<Text style={labelStyle}>{label}</Text>
			<TextInput
				placeholder={placeholder}
				secureTextEntry={secureTextEntry}
				autoCorrect={false}
				style={inputStyle}
				name={name}
				// multiline={multiline || false}
				value={value}
				onChangeText={onChangeText}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	inputStyle: {
		height: 40,
		width: 50,
		color: '#000',
		paddingRight: 5,
		paddingLeft: 5,
		fontSize: 18,
		lineHeight: 20,
		flex: 2,
	},
	labelStyle: {
		fontSize: 18,
		paddingLeft: 20,
		flex: 1,
		fontFamily: 'HelveticaNeue',
		color: '#52575D',
	},
	containerStyle: {
		height: 40,
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
});

export default Input;
