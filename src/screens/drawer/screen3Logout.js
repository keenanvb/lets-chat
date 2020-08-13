import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { signOut } from '../../actions/index'
// import { styles } from '../../styles/styles.js'

const Logout = ({ signOut, navigation }) => {

  const { container, header, footer,
    header_text, footer_text, action,
    textInput, textForgotPassword, button, signIn, textSignIn, signUp } = styles


  const handleSignOut = () => {
    signOut(navigation)
  }

  return (
    <View style={styles.center}>
      <TouchableOpacity style={[signIn, signUp]} onPress={() => {
        handleSignOut()
      }}>
        <Text style={[textSignIn, { color: '#4dc2f8' }]}>Logout</Text>
      </TouchableOpacity>
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
    margin: 20,
    fontSize: 18
  },
  signUp: {
    borderWidth: 1,
    borderColor: '#4dc2f8',
    marginTop: 5
  },
  disclaimer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10
  },
  highlightDisclaimerText: {
    color: 'gray'
  },
  highlightDisclaimerTextBold: {
    fontWeight: 'bold'
  }
});

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps, { signOut })(Logout)