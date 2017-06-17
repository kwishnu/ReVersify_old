import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, BackAndroid, Linking } from 'react-native';
import Button from '../components/Button';
import configs from '../config/configs';
import { normalize, normalizeFont }  from '../config/pixelRatio';
const styles = require('../styles/styles');
const {width, height} = require('Dimensions').get('window');

module.exports = class Social extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'social',
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount(){
        BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
    }
    componentWillUnmount () {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
    }
    handleHardwareBackButton() {
        try {
            this.props.navigator.pop({
                passProps: {
                    puzzleData: this.props.puzzleData,
                }
            });
        }
        catch(err) {
            window.alert(err.message);
        }
        return true;
    }
    linkToUrl(which){
        if (this.props.which == 'FB'){
            Linking.canOpenURL(configs.FB_URL_APP)
            .then(supported => {
                if (supported) {
                    Linking.openURL(configs.FB_URL_APP);
                } else {
                    Linking.canOpenURL(configs.FB_URL_BROWSER)
                    .then(isSupported => {
                        if (isSupported) {
                            Linking.openURL(configs.FB_URL_BROWSER);
                        } else {
                            console.log('Don\'t know how to open URL: ' + configs.FB_URL_BROWSER);
                        }
                    });
                }
            });
        }else{
            Linking.canOpenURL(configs.TWITTER_URL_APP)
            .then(supported => {
                if (supported) {
                    Linking.openURL(configs.TWITTER_URL_APP);
                } else {
                    Linking.canOpenURL(configs.TWITTER_URL_BROWSER)
                    .then(isSupported => {
                        if (isSupported) {
                            Linking.openURL(configs.TWITTER_URL_BROWSER);
                        } else {
                            console.log('Don\'t know how to open URL: ' + configs.TWITTER_URL_BROWSER);
                        }
                    });
                }
            });
        }
    }

    render() {
        const imageSource = (this.props.which == 'FB')?require('../images/fblogo.png') : require('../images/twitterlogo.png');
        const text1 = (this.props.which == 'FB')?'\'Like\' us on Facebook so you can follow ':'Follow us on Twitter to keep up on ';
        const text2 = 'ReVersify News: learn of new ReVersify verse collections and other games we release!';
        const text = text1 + text2;
        return (
                <View style={[social_styles.container, {borderColor: this.props.color}]}>
                    <View style={ [social_styles.header, {backgroundColor: this.props.color}] }>
                        <Button style={{left: height*.02}} onPress={ () => this.handleHardwareBackButton() }>
                            <Image source={ require('../images/arrowback.png') } style={ { width: normalize(height*.07), height: normalize(height*.07) } } />
                        </Button>
                        <Text style={styles.header_text} >{this.props.title}
                        </Text>
                        <Button style={{right: height*.02}}>
                            <Image source={ require('../images/noimage.png') } style={ { width: normalize(height*.07), height: normalize(height*.07) } } />
                        </Button>
                    </View>
                    <View style={ social_styles.image_container }>
                        <Image source={ imageSource } style={ { width: height*.3, height: height*.3 } } />
                    </View>
                    <View style={ social_styles.body_container }>
                        <Text style={social_styles.body_text}>{text}</Text>
                    </View>
                    <View style={ social_styles.button_container }>
                        <Button style={[social_styles.button, {backgroundColor: this.props.color}]} onPress={()=>{this.linkToUrl()}}>
                            <Text style={social_styles.button_text}>OK</Text>
                        </Button>
                    </View>
                </View>
        );
    }
};


const social_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderWidth: 5,
    },
    header: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: window.width,
    },
    image_container: {
        flex: 24,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    body_container: {
        flex: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 30,
    },
    button_container: {
        flex: 8,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    button_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * .12),
        color: '#ffffff'
    },
    body_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * .085),
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        lineHeight: configs.LINE_HEIGHT,
    },
    button: {
        height: height * 0.08,
        width: height * 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 2,
    }
});

