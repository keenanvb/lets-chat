import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const SCREEN_WIDTH = Dimensions.get('window').width
// import LinearGradient from 'react-native-linear-gradient';

const Slides = ({ data, onComplete }) => {
    const renderLastSlide = (index) => {
        if (index === data.length - 1) {
            return (
                <View style={button}>
                    <TouchableOpacity style={[signIn, signUp]} onPress={() => {
                        onComplete()
                    }}>
                        <Text style={[textSignIn, { color: '#4dc2f8' }]}></Text>
                        <Ionicons name='ios-arrow-forward' size={20} color='white' />
                    </TouchableOpacity>
                </View>
            )
        }
    }


    const { button, signIn, textSignIn, signUp } = styles

    const renderSlides = () => {
        return data.map((item, index) => {
            return (
                <View key={item.text} style={[styles.slideStyle, { backgroundColor: item.colour }]}>
                    <Text style={styles.slideText} >{item.text}</Text>
                    {renderLastSlide(index)}
                </View>
            );
        });
    }

    return (
        <ScrollView
            horizontal
            style={{ flex: 1 }}
            pagingEnabled
        >
            {renderSlides()}
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    slideStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH
    },
    slideText: {
        fontSize: 30,
        color: 'white'
    },
    button: {
        bottom: 10,
        right: 10,
        position: 'absolute',
        alignItems: 'center',
    },
    signIn: {
        // width: '100%',
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
});

export default Slides;
