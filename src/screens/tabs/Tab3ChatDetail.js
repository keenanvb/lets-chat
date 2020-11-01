import React, { useEffect, useState, useRef } from 'react';
import { View, Text, BackHandler, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { db } from '../../config/firebase';
import Card from '../../components/Card';
import CardSection from '../../components/CardSection';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { createChatId } from '../../utils/utils';

export const Tab3ChatDetail = ({ authenticate, index, user, navigation }) => {
	const [data, setData] = useState(null);

	useEffect(() => {
		let chatId = createChatId(authenticate.uid, user.id);

		db.collection('chats')
			.doc(chatId)
			.onSnapshot((snap) => {
				const snapData = snap.data();
				console.log('snapData', snapData.notifications);
				if (snapData.notifications) {
					setData(snapData.notifications);
				}
			});
	}, []);

	console.log('data', data);
	return (
		<>
			<Card key={index}>
				<TouchableOpacity
					onPress={() => {
						navigation.navigate('Chat', { name: user.fullName, id: user.id });
					}}>
					<CardSection>
						<Image style={styles.img} source={require('../../assets/blank-profile-picture.png')} />
						<Text style={[styles.bold, styles.center]}>{user.fullName}</Text>
						{data && data[authenticate.uid] ? (
							<View
								style={[
									{
										flexDirection: 'row',
										alignItems: 'center',
										width: 20,
										position: 'absolute',
										right: 10,
										bottom: 10,
										backgroundColor: '#AEB5BC',
										borderRadius: 50,
									},
								]}>
								<Text
									style={[
										styles.text,
										{ width: '100%', textAlign: 'center', fontWeight: '200', fontSize: 20 },
									]}>
									{data && data[authenticate.uid]}{' '}
								</Text>
							</View>
						) : null}

						<View style={styles.iconContent}>
							{/* <Image style={styles.icon} source={require('../../assets/blank-profile-picture.png')} /> */}
							<Ionicons style={styles.icon} name="ios-arrow-forward" size={20} color="black" />
						</View>
					</CardSection>
				</TouchableOpacity>
			</Card>
		</>
	);
};

var styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	img: {
		width: 80,
		height: 80,
		borderRadius: 40,
		margin: 10,
		backgroundColor: '#fff',
	},
	text: {
		fontFamily: 'HelveticaNeue',
		color: '#52575D',
	},
	center: {
		fontSize: 22,
		alignSelf: 'center',
		marginLeft: 10,
	},
	// icon: {
	//   fontSize: 22,
	//   alignSelf: 'flex-start',
	//   marginLeft: 10
	// },
	bold: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	iconContent: {
		marginTop: 20,
		width: 60,
		height: 60,
		// backgroundColor: '#40E0D0',
		marginLeft: 'auto',
		alignItems: 'center',
	},
	icon: {
		marginTop: 20,
		//   width: 50,
		//   height: 50,
	},
	swipeInfoContainer: {
		alignSelf: 'center',
		alignItems: 'center',
		marginTop: 16,
	},
});

const mapStateToProps = (state) => {
	return {
		authenticate: state.auth,
	};
};

export default connect(mapStateToProps, {})(Tab3ChatDetail);
