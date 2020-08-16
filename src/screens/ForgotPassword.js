import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux';
import { resetPassword } from '../actions/index'
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import Notifications from './Notifications';

const ForgotPassword = ({ navigation, resetPassword }) => {

    const [formData, setFormData] = useState({
        email: 'admin@gmail.com',
        formErrors: {
            email: false
        }
    });

    const onFormDataChange = (name, text) => {
        const { formErrors } = formData
        switch (name) {
            case "email":
                formErrors.email = emailRegex.test(text)
                    ? true
                    : false;
                break;
            default:
                break;
        }
        setFormData({ ...formData, [name]: text })
    }

    const emailRegex = RegExp(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );


    const { container, header, footer,
        header_text, footer_text, action,
        textInput, textForgotPassword, button, signIn, textSignIn, signUp } = styles

    const { email, formErrors } = formData;


    const handlePasswordReset = () => {
        navigation.navigate('Login');
        resetPassword(email, navigation)
    }

    return (
        <View style={container}>
            <View style={header}>
                <Text style={header_text}>Forgot password</Text>
            </View>
            <Notifications />
            <Animatable.View
                animation='fadeInUpBig'
                style={footer}>
                <KeyboardAvoidingView behavior="padding">
                    <Text style={footer_text}> Email</Text>
                    <View style={action}>
                        <Feather name="user" size={20} color='black' />
                        <TextInput
                            placeholder="Email"
                            style={textInput}
                            keyboardType='email-address'
                            value={email}
                            onChangeText={(email) => {
                                onFormDataChange('email', email)
                            }}
                        />
                        {formErrors.email ?
                            <Feather name="check-circle" size={20} color='green' /> :
                            <Feather name="circle" size={20} color='grey' />
                        }
                    </View>
                    <TouchableOpacity style={[signIn, signUp]} onPress={() => {
                        handlePasswordReset()
                    }}>
                        <Text style={[textSignIn, { color: '#4dc2f8' }]}>Reset Password</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Animatable.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#05375a',
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    header_text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30
    },
    footer_text: {
        color: '#05375a',
        fontSize: 18,
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
        alignItems: 'center'
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
        color: '#05375a',
    },
    textForgotPassword: {
        color: '#009bd1',
        marginTop: 15
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row'
    },
    textSignIn: {
        color: 'white',
        fontWeight: 'bold',
        margin: 8,
        fontSize: 18
    },
    signUp: {
        borderWidth: 1,
        borderColor: '#4dc2f8',
        marginTop: 15
    }
});

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, { resetPassword })(ForgotPassword)