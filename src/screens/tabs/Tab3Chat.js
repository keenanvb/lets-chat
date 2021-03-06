import React, { useEffect, useState, useRef } from 'react';
import { View, Text, BackHandler, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { connect } from 'react-redux';
import { db } from '../../config/firebase';
import Card from '../../components/Card';
import CardSection from '../../components/CardSection';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tab3ChatDetail from './Tab3ChatDetail';
import { createChatId } from '../../utils/utils';

const ChatTab = ({ authenticate, navigation }) => {
	let unsubscribe2 = useRef(null);
	const [data, setData] = useState(null);
	const isFocused = useIsFocused();

	useEffect(() => {
		unsubscribe2.current = db
			.collection('connections')
			.doc(authenticate.uid)
			.onSnapshot((snap) => {
				const snapData = snap.data();
				setData(snapData);
			});

		return () => {
			// unsubscribe2.current();
			// unsubscribe2(); // does not unmount work around useIsFocused()
		};
	}, []);

	if (!isFocused) {
		// unsubscribe2.current();
		console.log('unsubscribe', unsubscribe2);
	}

	const getNotification = (user) => {
		let chatId = createChatId(authenticate.uid, user.id);

		db.collection('chats')
			.doc(chatId)
			.get((snap) => {
				const snapData = snap.data();
				console.log('snapData', snapData);
				if (snapData.messages) {
				}
			});
		return 'hello';
	};

	let renderUsers = () => {
		// return data.users.map((user, index) => {
		//   return (
		//     <Card key={index}>
		//       <TouchableOpacity onPress={() => navigation.navigate('Chat', { name: user.fullName, id: user.id })} >
		//         <CardSection>
		//           <Image style={styles.img} source={require('../../assets/blank-profile-picture.png')} />
		//           <Text style={[styles.bold, styles.center]}>{user.fullName}</Text>
		//           {/* <View>{getNotification(user.id)}</View> */}
		//           <View style={styles.iconContent}>
		//             {/* <Image style={styles.icon} source={require('../../assets/blank-profile-picture.png')} /> */}
		//             <Ionicons style={styles.icon} name='ios-arrow-forward' size={20} color='black' />
		//           </View>
		//         </CardSection>
		//       </TouchableOpacity>
		//     </Card>
		//   );
		// })
		return data.users.map((user) => <Tab3ChatDetail key={user.id} user={user} navigation={navigation} />);
	};

	return (
		<View style={styles.container}>
			{data === null || data === undefined ? (
				<View style={styles.swipeInfoContainer}>
					<Text style={[styles.text, { fontWeight: '200', fontSize: 36 }]}>No connections</Text>
				</View>
			) : (
				<ScrollView>{renderUsers()}</ScrollView>
			)}
		</View>
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

export default connect(mapStateToProps, {})(ChatTab);
