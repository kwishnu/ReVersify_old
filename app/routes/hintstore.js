import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Alert, BackAndroid, Platform, AsyncStorage, NetInfo } from 'react-native';
import Meteor from 'react-native-meteor';
import Button from '../components/Button';
import configs from '../config/configs';
import { normalize, normalizeFont }  from '../config/pixelRatio';
import moment from 'moment';
const styles = require('../styles/styles');
const {width, height} = require('Dimensions').get('window');
const KEY_ratedTheApp = 'ratedApp';
let year = moment().year();

module.exports = class HintStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'hints',
        };
        this.goSomewhere = this.goSomewhere.bind(this);
    }
    componentDidMount(){
        BackAndroid.addEventListener('hardwareBackPress', this.goSomewhere);
    }
    componentWillUnmount () {
        BackAndroid.removeEventListener('hardwareBackPress', this.goSomewhere);
    }
    goSomewhere() {
        try {
            this.props.navigator.pop({
                id: this.props.destination,
                passProps: {
                    destination: this.props.destination,
                    homeData: this.props.homeData,
                    daily_solvedArray: this.props.daily_solvedArray,
                    title: this.props.title,
                    dataSource: this.props.dataSource,
                    dataElement: this.props.dataElement,
                    bgColor: this.props.bgColor
                }
            });
        }
        catch(err) {
            window.alert(err.message);
        }
        return true;
    }
    startPurchase(hintPackage){
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected && Meteor.status().status == 'connected'){
//rv.hint.package.100, 500, 1000
//rv.hint.package.0 == unlimited
//            InAppBilling.open()
//            .then(() => InAppBilling.purchase(itemID))
//            .then((details) => {
                try {
                    this.props.navigator.pop({});
//                    this.props.navigator.replace({
//                        id: 'home',
//                        passProps: {
//                            destination: this.props.fromWhere,
//                            homeData: this.props.homeData,
//                        }
//                    });
                } catch(err)  {
                    window.alert(err.message)
                    return true;
                }
//                console.log("You purchased: ", details)
//                return InAppBilling.close()
//            }).catch((err) => {
//                console.log(err);
//                return InAppBilling.close()
//            });
            }else{
                Alert.alert('Not Connected', `Sorry, we can't reach our servers right now. Please try again later!`);
            }
        });
    }

    render() {
        return (
            <View style={hints_styles.container}>
                <View style={ hints_styles.header }>
                    <Button style={hints_styles.button} onPress={ () => this.goSomewhere() }>
                        <Image source={ require('../images/arrowback.png') } style={ { width: normalize(height*0.07), height: normalize(height*0.07) } } />
                    </Button>
                    <Text style={styles.header_text} >Hint Packages</Text>
                    <Button style={hints_styles.button}>
                        <Image source={ require('../images/noimage.png') } style={ { width: normalize(height*0.07), height: normalize(height*0.07) } } />
                    </Button>
                </View>
                <View style={ hints_styles.store_container }>
                    <View style={ hints_styles.purchase_row }>
                        <View style={ hints_styles.purchase_text_container }>
                            <Text style={ hints_styles.text }>100 reVersify Hints{'\n'}$0.99</Text>
                        </View>
                        <View style={ hints_styles.purchase_button_container } onStartShouldSetResponder={ ()=> {this.startPurchase('rv.hint.package.100')}}>
                            <View style={hints_styles.buy_button} >
                                <Text style={hints_styles.buy_text}>Purchase</Text>
                            </View>
                        </View>
                    </View>
                    <View style={ hints_styles.purchase_row }>
                        <View style={ hints_styles.purchase_text_container }>
                            <Text style={ hints_styles.text }>500 reVersify Hints{'\n'}$1.99</Text>
                        </View>
                        <View style={ hints_styles.purchase_button_container } onStartShouldSetResponder={ ()=> {this.startPurchase('rv.hint.package.500')}}>
                            <View style={hints_styles.buy_button} >
                                <Text style={hints_styles.buy_text}>Purchase</Text>
                            </View>
                        </View>
                    </View>
                    <View style={ hints_styles.purchase_row }>
                        <View style={ hints_styles.purchase_text_container }>
                            <Text style={ hints_styles.text }>1000 reVersify Hints{'\n'}$2.99</Text>
                        </View>
                        <View style={ hints_styles.purchase_button_container } onStartShouldSetResponder={ ()=> {this.startPurchase('rv.hint.package.1000')}}>
                            <View style={hints_styles.buy_button} >
                                <Text style={hints_styles.buy_text}>Purchase</Text>
                            </View>
                        </View>
                    </View>
                    <View style={ hints_styles.purchase_row }>
                        <View style={ hints_styles.purchase_text_container }>
                            <Text style={ hints_styles.text }>Unlimited Hints{'\n'}$3.99</Text>
                        </View>
                        <View style={ hints_styles.purchase_button_container } onStartShouldSetResponder={ ()=> {this.startPurchase('rv.hint.package.0')}}>
                            <View style={hints_styles.buy_button} >
                                <Text style={hints_styles.buy_text}>Purchase</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}



const hints_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#cfe7c2',
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 6,
        width: width,
        backgroundColor: '#2B0B30',
        marginBottom: 20
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: normalize(height*0.077),
        height: normalize(height*0.077)
    },
    store_container: {
        flex: 15,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    purchase_row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width*.95,
        height: height*.16,
        padding: 4,
        margin: 4

    },
    purchase_button_container: {
        flex: 2,
        height: height*.16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        margin: 4
    },
    purchase_text_container: {
        flex: 3,
        height: height*.16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'black',
        borderRadius: 3,
        backgroundColor: '#ffffff',
        padding: 4,
        margin: 4

    },
    buy_button: {
        height: height/15,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#058805',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#f9f003',
    },
    buy_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.094),
        color: '#ffffff',
        fontWeight: 'bold',
    },
    text: {
        color: '#333333',
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.09),
        textAlign: 'center',
        lineHeight: height*.05

    }
});
