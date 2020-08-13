import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width
// import LinearGradient from 'react-native-linear-gradient';

const Slides = ({ data, onComplete }) => {
    // const renderLastSlide = (index) => {
    //     if (index === data.length - 1) {
    //         return (
    //             <LinearGradient colors={['#5db8fe', '#39cff2']} style={styles.signIn} >
    //                 <Text onPress={() => {
    //                     onComplete()
    //                 }} style={styles.textSignIn}>Sign in</Text>
    //             </LinearGradient>
    //         )
    //     }
    // }



    const renderSlides = () => {
        return data.map((item, index) => {
            return (
                <View key={item.text} style={[styles.slideStyle, { backgroundColor: item.colour }]}>
                    <Text style={styles.slideText} >{item.text}</Text>
                    {/* {renderLastSlide(index)} */}
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
    buttonStyle: {
        backgroundColor: '#0288D1',
        marginTop: 15
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
});

export default Slides;
