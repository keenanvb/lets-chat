import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { Text, View, StyleSheet, StatusBar, Dimensions, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slides from '../components/Slides';
import { auth } from '../config/firebase';
import { loadUser } from '../actions/index';
import store from '../store';
const Splash = ({ authenticate, navigation }) => {

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                await store.dispatch(loadUser(user.uid));
                navigation.navigate('Top Tabs');
            } else {
                console.log('no user logged in')
            }
        }, (error) => {
            console.log('error', error);
        });

    }, []);

    const { container, header, footer, logo, title, text, button, signIn, textSignIn } = styles

    const slideData = [
        { text: 'Welcome to App', colour: '#05375a' },
        { text: 'Swipe', colour: '#e74c3c' },
        { text: 'Swpie', colour: '#f1c40f', button: true }
    ]

    const onSLidesComplete = () => {
        navigation.navigate('Login');
    }

    return (
        <View style={container}>
            <StatusBar barStyle="light-content" />
            <Slides data={slideData} onComplete={onSLidesComplete} />
            <View style={header}>
                <Animatable.Image
                    animation="bounceIn"
                    duration={1500}
                    source={require('../assets/map.png')}
                    style={logo}
                    resizeMode={"stretch"}
                />
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={footer}>
                <Text style={title}>Stay connected with us</Text>
                <Text style={text}>Sign in with account</Text>
                <View style={button}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Login') }}>
                        <LinearGradient colors={['#05375a', '#05375a']} style={signIn}>
                            <Text style={textSignIn}>Get started</Text>
                            <Ionicons name='ios-arrow-forward' size={20} color='white' />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    )
}

const { height } = Dimensions.get('screen');
const height_logo = height * 0.7 * 0.4

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#05375a',
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
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
        height: height_logo
    },
    title: {
        color: '#05375a',
        fontWeight: 'bold',
        fontSize: 30
    },
    text: {
        color: 'gray',
        marginTop: 5
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },
    signIn: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row'
    },
    textSignIn: {
        color: 'white',
        fontWeight: 'bold',
        margin: 10
    }
});

const mapStateToProps = (state) => {
    return {
        authenticate: state.auth
    }
}

export default connect(mapStateToProps, {})(Splash)