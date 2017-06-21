import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Picker, BackAndroid, AsyncStorage, ActivityIndicator } from 'react-native';
import {Switch} from '../components/Switch';
import Button from '../components/Button';
//import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import configs from '../config/configs';
import { normalize, normalizeFont }  from '../config/pixelRatio';
const styles = require('../styles/styles');
const {width, height} = require('Dimensions').get('window');
const KEY_Sound = 'soundKey';
const KEY_Color = 'colorKey';
const KEY_Notifs = 'notifsKey';
const KEY_NotifTime = 'notifTimeKey';
const KEY_UseNumLetters = 'numLetters';
const KEY_show_score = 'showScoreKey';
var nowISO = moment().valueOf();
var tonightMidnight = moment().endOf('day').valueOf();

module.exports = class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'settings',
            isLoading: true,
            sounds_state: true,
            sounds_text: 'Game sounds on',
            color_state: true,
            use_colors: 'Use Verse Collection colors',
            notifs_state: true,
            notif_time: '7',
            notif_text: 'Yes, at',
            nl_state: true,
            nl_text: 'Show Answer letter-count',
            score_state: true,
            score_text: 'Show Score on Contents',
            pickerColor: '#ffffff'
        };
       this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount(){
        BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        AsyncStorage.getItem(KEY_Sound).then((sounds) => {
            if (sounds !== null) {
                var textToUse = (sounds == 'true')?'Game sounds on':'Game sounds off';
                var stateToUse = (sounds == 'true')?true:false;
                this.setState({
                    sounds_text: textToUse,
                    sounds_state: stateToUse
                });
            }else{
                try {
                    AsyncStorage.setItem(KEY_Sound, 'true');//
                } catch (error) {
                    window.alert('AsyncStorage error: ' + error.message);
                }
            }
            return AsyncStorage.getItem(KEY_Color);
        }).then((colors) => {
            if (colors !== null) {
                var stateToUse = (colors == 'true')?true:false;
                var strToUse = (colors == 'true')?'Use Puzzle Pack colors':'Using default colors';
                this.setState({
                    color_state: stateToUse,
                    use_colors: strToUse
                });
            }else{
                try {
                    AsyncStorage.setItem(KEY_Color, 'true');//
                } catch (error) {
                    window.alert('AsyncStorage error: ' + error.message);
                }
            }
            return AsyncStorage.getItem(KEY_Notifs);
        }).then((notifs) => {
            if (notifs !== null && notifs !== '0') {
                this.setState({
                    notifs_state: true,
                    notif_time: notifs,
                    notif_text: 'Yes, at',
                    pickerColor: '#ffffff'
                });
            }else{
                this.setState({
                    notifs_state: false,
                    notif_time: '7',
                    notif_text: 'No',
                    pickerColor: '#666666'
                });
            }
            return AsyncStorage.getItem(KEY_UseNumLetters);
        }).then((letters) => {
            if (letters !== null) {
                var stateToUse = (letters == 'true')?true:false;
                var strToUse = (letters == 'true')?'Show Answer letter-count':'Hiding Answer letter-count';
                this.setState({
                    nl_state: stateToUse,
                    nl_text: strToUse
                });
            }else{
                try {
                    AsyncStorage.setItem(KEY_UseNumLetters, 'true');//
                } catch (error) {
                    window.alert('AsyncStorage error: ' + error.message);
                }
            }
            return AsyncStorage.getItem(KEY_show_score);
        }).then((showScore) => {
            if (showScore !== null) {
                var stateToUse = (showScore == '1')?true:false;
                var strToUse = (showScore == '1')?'Show Score on Contents':'Hiding Score on Contents';
                this.setState({
                    score_state: stateToUse,
                    score_text: strToUse
                });
            }else{
                try {
                    AsyncStorage.setItem(KEY_show_score, '1');//
                } catch (error) {
                    window.alert('AsyncStorage error: ' + error.message);
                }
            }
            return true;
        }).then((done) => {
            if(done){
                this.setState({isLoading: false});
            }
        });
    }
    componentWillUnmount () {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
    }
    handleHardwareBackButton() {
        try {
            this.props.navigator.pop({
                id: 'home',
                passProps: {
                    homeData: this.props.homeData,
                }
            });
        }
        catch(err) {
            window.alert(err.message);
        }
        return true;
    }
    border(color) {
        return {
            borderColor: color,
            borderWidth: 2,
        };
    }
    toggleGameSounds(state){
        var textToUse = (state)?'Sounds on':'Sounds off';
        this.setState({sounds_text: textToUse});
        try {
            AsyncStorage.setItem(KEY_Sound, state.toString());
        } catch (error) {
            window.alert('AsyncStorage error: ' + error.message);
        }
    }
    toggleColor(state){
        var strToUse = (state)?'Use Verse Collection colors':'Using default colors';
        this.setState({use_colors: strToUse});
        try {
            AsyncStorage.setItem(KEY_Color, state.toString());
        } catch (error) {
            window.alert('AsyncStorage error: ' + error.message);
        }
    }
    toggleLetters(state){
        var strToUse = (state)?'Show Answer letter-count':'Hiding Answer letter-count';
        this.setState({nl_text: strToUse});
        try {
            AsyncStorage.setItem(KEY_UseNumLetters, state.toString());
        } catch (error) {
            window.alert('AsyncStorage error: ' + error.message);
        }
    }
    toggleScore(state){
        var strToUse = (state)?'Show Score on Contents':'Hiding score on Contents';
        var opacityValue = (state)?'1':'0';
        this.setState({score_text: strToUse});
        try {
            AsyncStorage.setItem(KEY_show_score, opacityValue);
        } catch (error) {
            window.alert('AsyncStorage error: ' + error.message);
        }
    }
    toggleUseNotifs(state){
//        PushNotification.cancelLocalNotifications({id: '777'});
        var yesOrNo = '';
        var strNotifs = '';
        var textColor = '';
        if(state){
            yesOrNo = 'Yes, at';
            textColor = '#ffffff';
            strNotifs = this.state.notif_time;
            this.startNotifications(strNotifs);
        }else{
            yesOrNo = 'No';
            textColor = '#666666';
            strNotifs = '0';
        }
        this.setState({ notifs_state: state, notif_text: yesOrNo, pickerColor: textColor });
        try {
            AsyncStorage.setItem(KEY_Notifs, strNotifs);
        } catch (error) {
            window.alert('AsyncStorage error: ' + error.message);
        }
    }
    setNotifTime(key: value){
//        PushNotification.cancelLocalNotifications({id: '777'});
        this.startNotifications(key.selectedValue);
        this.setState({ notif_time: key.selectedValue });
        try {
            AsyncStorage.setItem(KEY_Notifs, key.selectedValue);
        } catch (error) {
            window.alert('AsyncStorage error: ' + error.message);
        }
    }
    startNotifications(time) {
        var tomorrowAM = new Date(Date.now() + (moment(tonightMidnight).add(parseInt(time, 10), 'hours').valueOf()) - nowISO);
//        PushNotification.localNotificationSchedule({
//            message: "A new Daily Verse is in!",
//            vibrate: true,
//            soundName: 'plink.mp3',
//            //repeatType: 'day',//can be 'time', if so use following:
//            repeatTime: 86400000,//daily
//            date: tomorrowAM,
//            id: '777',
//        });
    }

    render() {
        if(this.state.isLoading == true){
            return(
                <View style={settings_styles.loading}>
                    <ActivityIndicator animating={true} size={'large'}/>
                </View>
            )
        }else{
            return (
                <View style={settings_styles.container}>
                    <View style={ settings_styles.header }>
                        <Button style={settings_styles.button} onPress={ () => this.handleHardwareBackButton() }>
                            <Image source={ require('../images/arrowback.png') } style={ { width: normalize(height*0.07), height: normalize(height*0.07) } } />
                        </Button>
                        <Text style={styles.header_text} >Settings
                        </Text>
                        <Button style={{right: height*.02}}>
                            <Image source={ require('../images/noimage.png') } style={ { width: normalize(height*0.07), height: normalize(height*0.07) } } />
                        </Button>
                    </View>
                    <View style={ settings_styles.settings_container }>
                        <View>
                            <View style={settings_styles.parameter_container}>
                                <View style={[settings_styles.text_container, {alignItems: 'flex-end'}]}>
                                    <Text style={settings_styles.text}>{this.state.sounds_text}</Text>
                                </View>
                                <View style={settings_styles.switch_container}>
                                    <Switch value={this.state.sounds_state} onValueChange={(state)=>{this.toggleGameSounds(state)}}/>
                                </View>
                            </View>
                            <View style={settings_styles.parameter_container}>
                                <View style={settings_styles.divider}>
                                </View>
                            </View>
                            <View style={[settings_styles.parameter_container, {marginTop: height*0.04}]}>
                                <View style={[settings_styles.text_container, {alignItems: 'flex-end'}]}>
                                    <Text style={settings_styles.text}>{this.state.use_colors}</Text>
                                </View>
                                <View style={settings_styles.switch_container}>
                                    <Switch value={this.state.color_state} onValueChange={(state)=>{this.toggleColor(state)}}/>
                                </View>
                            </View>
                            <View style={settings_styles.parameter_container}>
                                <View style={settings_styles.divider}>
                                </View>
                            </View>
                            <View style={[settings_styles.parameter_container, {marginTop: height*0.04}]}>
                                <View style={settings_styles.text_container}>
                                    <Text style={[settings_styles.text, {paddingLeft: 15}]}>Receive new Verse notifications...</Text>
                                </View>
                            </View>
                            <View style={[settings_styles.parameter_container, {marginTop: 8}]}>
                                <View style={[settings_styles.text_container, {alignItems: 'flex-end'}]}>
                                    <Text style={settings_styles.text}>{this.state.notif_text}</Text>
                                </View>
                                <View style={settings_styles.switch_container}>
                                    <Switch value={this.state.notifs_state} onValueChange={(state)=>{this.toggleUseNotifs(state)}}/>
                                </View>
                            </View>
                            <View style={settings_styles.parameter_container}>
                                <View style={settings_styles.text_container}>
                                </View>
                                <View style={settings_styles.switch_container}>
                                    <Picker
                                        enabled={this.state.notifs_state}
                                        style={[settings_styles.picker, {color: this.state.pickerColor}]}
                                        selectedValue={this.state.notif_time}
                                        onValueChange={(selectedValue ) => this.setNotifTime({ selectedValue  })}
                                    >
                                        <Picker.Item label='5:00 am' value={'5'} />
                                        <Picker.Item label='6:00 am' value={'6'} />
                                        <Picker.Item label='7:00 am' value={'7'} />
                                        <Picker.Item label='8:00 am' value={'8'} />
                                        <Picker.Item label='9:00 am' value={'9'} />
                                    </Picker>
                                </View>
                            </View>
                            <View style={settings_styles.parameter_container}>
                                <View style={settings_styles.divider}>
                                </View>
                            </View>
                            <View style={[settings_styles.parameter_container, {marginTop: height*0.04}]}>
                                <View style={[settings_styles.text_container, {alignItems: 'flex-end'}]}>
                                    <Text style={settings_styles.text}>{this.state.nl_text}</Text>
                                </View>
                                <View style={settings_styles.switch_container}>
                                    <Switch value={this.state.nl_state} onValueChange={(state)=>{this.toggleLetters(state)}}/>
                                </View>
                            </View>
                            <View style={settings_styles.parameter_container}>
                                <View style={settings_styles.divider}>
                                </View>
                            </View>
                            <View style={[settings_styles.parameter_container, {marginTop: height*0.04}]}>
                                <View style={[settings_styles.text_container, {alignItems: 'flex-end'}]}>
                                    <Text style={settings_styles.text}>{this.state.score_text}</Text>
                                </View>
                                <View style={settings_styles.switch_container}>
                                    <Switch value={this.state.score_state} onValueChange={(state)=>{this.toggleScore(state)}}/>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
    }
};


const settings_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2B0B30',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2B0B30'
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 6,
        width: width,
        backgroundColor: '#000000',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: normalize(height*0.077),
        height: normalize(height*0.077)
    },
    settings_container: {
        flex: 15,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    parameter_container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
    },
    text_container: {
        flex: 3,
        justifyContent: 'center',
        padding: 6,
    },
    switch_container: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 6,
    },
    text: {
        color: '#ffffff',
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.5/6)
    },
    picker: {
        width: normalize(height/5.5)
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        width: width * 0.9,
        backgroundColor: '#333333',
        marginTop: 20,
    }
});

