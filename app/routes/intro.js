import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  Dimensions,
  AsyncStorage,
  Animated,
  Easing,
  BackAndroid
} from 'react-native';
const KEY_MyHints = 'myHintsKey';
const KEY_Premium = 'premiumOrNot';
const KEY_InfinteHints = 'infHintKey';
const KEY_PlayFirst = 'playFirstKey';
const KEY_ShowVerse = 'showVerseKey';
const KEY_ratedTheApp = 'ratedApp';
const KEY_expandInfo = 'expandInfoKey';
const KEY_Solved = 'numSolvedKey';
const KEY_show_score = 'showScoreKey';
const {width, height} = require('Dimensions').get('window');

class Intro extends Component {
    constructor(props) {
        super(props);
        this.offsetX = new Animated.Value(0);
        this.spinValue = new Animated.Value(0)
        this.state = {
            id: 'intro'
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
//        this.animate_hand_delay();
//        this.spin();
        BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        if (this.props.seenIntro != 'true'){
            var initArray = [
                [KEY_MyHints, '-1'],
                [KEY_Premium, 'false'],
                [KEY_InfinteHints, 'false'],
                [KEY_PlayFirst, 'false'],
                [KEY_ShowVerse, 'false'],
                [KEY_ratedTheApp, 'false'],
                [KEY_expandInfo, '1.1.1'],
                [KEY_Solved, '0'],
                [KEY_show_score, '1']
            ];
            try {
                AsyncStorage.multiSet(initArray);
            } catch (error) {
                window.alert('AsyncStorage error: ' + error.message);
            }
        }
    }
    componentWillUnmount () {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
    }
    handleHardwareBackButton=() => {
        this.goSomewhere();
    }
    goSomewhere(){
        let goToHere = this.props.destination;
        if (goToHere == 'home'){
            this.props.navigator.replace({
                id: goToHere,
                passProps: {
                    homeData: this.props.homeData,
                    connectionBool: this.props.connectionBool
                },
           });
        }else{
            this.props.navigator.pop({
                id: goToHere,
                passProps: {
                    homeData: this.props.homeData,
                },
           });
        }
    }
    onSkipBtnHandle = () => {
        this.goSomewhere();
    }
    doneBtnHandle = () => {
        this.goSomewhere();
    }
    spin () {
        this.spinValue.setValue(0);
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 23000,
                easing: Easing.linear
            }
        ).start(() => this.spin())
    }
    animate_hand_delay(){
        this.offsetX.setValue(0);
        Animated.sequence([
            Animated.delay(3000),
            Animated.timing(
            this.offsetX,
                {
                    toValue: 1,
                    duration: 1000,
                }
            )
        ]).start(() => this.animate_hand())
    }
    animate_hand(){
        this.offsetX.setValue(0);
        Animated.timing(
        this.offsetX,
        {
          toValue: 1,
          duration: 1000,
        }
        ).start(() => this.animate_hand())
    }
    render() {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
        const rotate = this.offsetX.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['0deg', '10deg', '0deg']
        })
        const oscillate = this.offsetX.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [40, 0, 40]
        })
        return (
            <View defaultIndex= {this.props.introIndex} onDoneBtnClick={this.doneBtnHandle} onSkipBtnClick={this.onSkipBtnHandle}>

                <View style={[styles.slide,{ backgroundColor: '#000000' }]}>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
  slide: {
    flex: 1,
    height: height,
    width: width,
    justifyContent: 'center',
  },
  hand: {
    position: 'absolute',
    top: height * .6,
    height: 30,
    width: 40
  },
});

module.exports = Intro;