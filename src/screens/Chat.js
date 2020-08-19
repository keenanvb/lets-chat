import React, { useRef, useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity,
    ActivityIndicator, BackHandler, Alert
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { connect } from 'react-redux';
import { db } from '../config/firebase';
import { createChatId } from '../utils/utils';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat'
import firebase from 'firebase'
import Ionicons from 'react-native-vector-icons/Ionicons';
import CardSection from '../components/CardSection'

const Chat = ({ navigation, authenticate }) => {

    let unsubscribe2 = useRef(null);
    const [user, setUser] = useState(useRoute().params);
    const [fireMessages, setFireMessages] = useState([]);
    const [chatId, setChatId] = useState(createChatId(authenticate.uid, user.id));

    useEffect(() => {

        unsubscribe2.current = db.collection('chats').doc(chatId).onSnapshot(snap => {
            const snapData = snap.data();
            if (snapData.messages) {
                setFireMessages(snapData.messages.reverse());
            }

        });
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            unsubscribe2.current();
            console.log('Chat unmount');
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
    }, []);

    const handleBackButton = () => {
        Alert.alert(
            'Exit App',
            'Exiting the application?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => BackHandler.exitApp()
            },], {
            cancelable: false
        }
        )
        return true;
    }

    console.log('useRoute', useRoute());
    console.log('user', user);
    console.log('messages', fireMessages);
    console.log('chatId', chatId);
    // if (!isFocused) {
    //     // unsubscribe2.current();
    //     console.log('unsubscribe', unsubscribe2);
    // }
    const displayMessages = () => {
        if (fireMessages == undefined || fireMessages.length == 0) {
            return setFireMessages([
                {
                    _id: 1,
                    text: 'Lets chat - Connection loading',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'Chats loading',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
            ])
        }

        return fireMessages.map((message) => {
            return ({
                ...message,
                createdAt: new Date(message.createdAt.seconds * 1000)
            })
        })

        // return fireMessages;
    }

    const onSend = async (messages = []) => {
        console.log('messages', messages)
        // this.props.dispatch(sendNotification(this.props.navigation.state.params.user.id, messages[0].user.name, messages[0].text))
        // setFireMessages(GiftedChat.append(...fireMessages, messages)); //

        await db.collection('chats').doc(chatId).update({
            messages: firebase.firestore.FieldValue.arrayUnion(messages[0])
        });
    }

    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <Ionicons name='send' size={34} color='black' />
                </View>
            </Send>
        );
    }

    const renderLoading = (props) => {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#6646ee' />
            </View>
        );
    }

    const renderBubble = (props) => {
        return (
            // Step 3: return the component
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        // Here is the color change
                        backgroundColor: '#05375a'
                    },
                }}
                textStyle={{
                    right: {
                        color: '#fff'
                    }
                }}
            />
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity >
                <CardSection>
                    <View style={styles.iconContent}>
                        <Ionicons onPress={() => navigation.navigate('Connections')} style={styles.icon} name='ios-arrow-back' size={20} color='black' />
                    </View>
                    <Image style={styles.img} source={require('../assets/blank-profile-picture.png')} />
                    <Text style={[styles.bold, styles.center]}>{user && user.name}</Text>
                </CardSection>
            </TouchableOpacity>
            <GiftedChat
                renderUsernameOnMessage
                showUserAvatar
                // isAnimated
                messages={displayMessages()}
                onSend={messages => onSend(messages)}
                user={{
                    _id: authenticate.uid,
                    name: authenticate.user.fullName,
                    avatar: 'https://placeimg.com/140/140/any'
                }}
                alwaysShowSend
                renderSend={renderSend}
                renderLoading={renderLoading}
                renderBubble={renderBubble}
                placeholder={`Type a message to ${user.name}...`}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    img: {
        width: 60,
        height: 60,
        borderRadius: 40,
        margin: 4,
        backgroundColor: '#fff',
    },
    center: {
        fontSize: 22,
        alignSelf: 'center',
        marginLeft: 10
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
        width: 60,
        height: 60,
        // backgroundColor: '#40E0D0',
        // marginLeft: 'auto',
        alignItems: 'center'
    },
    icon: {
        marginTop: 20,
        //   width: 50,
        //   height: 50,
    },
    sendingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 10
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const mapStateToProps = (state) => {
    return {
        authenticate: state.auth
    }
}

export default connect(mapStateToProps, {})(Chat)