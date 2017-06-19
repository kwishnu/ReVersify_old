import React, {Component} from 'react';
import { View, Image, StyleSheet, NetInfo, AsyncStorage, ActivityIndicator, StatusBar } from 'react-native';
import Meteor from 'react-native-meteor';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
//var InAppBilling = require('react-native-billing');
var initialData = require('../config/data');
var seenStart = false;
var ready = false;
var nowISO = 0;
var tonightMidnight = 0;
const bonuses = [['500', 'Welcome +500', '3', '#620887'], ['1500', 'Achiever +1500', '5', '#f4ce57'], ['2500', 'Talented +2500', '10', '#f2404c'], ['5000', 'Skilled +5000', '10', '#0817a2'], ['7500', 'Seasoned +7500', '10', '#6e097d'], ['10000', 'Expert +10,000', '10', '#f5eaf6'], ['100000000000', 'TooMuch', '1', '#000000']];
const KEY_Premium = 'premiumOrNot';
const KEY_Verses = 'versesKey';
const KEY_SeenStart = 'seenStartKey';
const KEY_Notifs = 'notifsKey';
const KEY_NotifTime = 'notifTimeKey';
const KEY_Score = 'scoreKey';
const KEY_NextBonus = 'bonusKey';
const {width, height} = require('Dimensions').get('window');
import { normalize }  from '../config/pixelRatio';
//'ws://52.52.199.138:80/websocket'; <= bbg3...publication AllData, collections data, data1, data2, details, verses, text, users; PuzzApp
//'ws://52.52.205.96:80/websocket'; <= Publications...publication AllData, collections dataA...dataZ; MeteorApp
//'ws://10.0.0.207:3000/websocket'; <= localhost
var METEOR_URL = 'ws://52.52.205.96:80/websocket';
var ATLAS_URL = 'mongodb://kwish:Sadiedog11!@fmcluster-shard-00-00-zurft.mongodb.net:27017,fmcluster-shard-00-01-zurft.mongodb.net:27017,fmcluster-shard-00-02-zurft.mongodb.net:27017/admin?ssl=true&replicaSet=FMCluster-shard-0&authSource=admin';

class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'splash screen',
            seenStart: 'false',
            notif_time: '',
            hasPremium: 'false',
            connectionBool: true,
//            isLoading: true,
            getPurchased: false,
            nextBonus: '0',
            totalScore: '0',
            pData: []
        };
    }
    componentDidMount() {
        StatusBar.setHidden(true);
        AsyncStorage.getItem(KEY_Notifs).then((notifHour) => {//notification hour, zero if no notifications (from Settings)
                if (notifHour !== null) {
                    this.setNotifications(notifHour);
                }else{
                    this.setState({notif_time: '7'});
                    try {
                        AsyncStorage.setItem(KEY_Notifs, '7');
                    } catch (error) {
                        window.alert('AsyncStorage error: ' + error.message);
                    }
                }
//                return AsyncStorage.getItem(KEY_SeenStart);
            })
        this.gotoScene('home', initialData)
	}
    getData(dataArray, sNum){//retrieve server data here, sNum is offset number for daily verses;
        return new Promise(
            function (resolve, reject) {
                const handle = Meteor.subscribe('AllData', {
                    onReady: function () {
                        const d_verses = Meteor.collection('dataD').find();//dataD => daily verses and homeData object
                        var pd = [];
                        var puzzStringArray = [];
                        d_verses.forEach(function (row) {
                            if(parseInt(row.pnum, 10) == 0){//get homeData object here
                                pd = row.data;
                            }
                            if((parseInt(row.pnum, 10) >= sNum) && (parseInt(row.pnum, 10) < (sNum + 31))){//daily verses here
                                puzzStringArray.unshift(row.puzz);
                            }
                        });
                        pd.length = 24;//truncate extra elements, which shouldn't be necessary but is...
                        pd[16].verses[0] = puzzStringArray[0];//load today's verse
                        puzzStringArray.shift();
                        for(var jj=0; jj<puzzStringArray.length; jj++){
                            pd[18].verses[jj] = puzzStringArray[jj];//load last 30 days
                            if(jj < 3){pd[17].verses[jj] = puzzStringArray[jj];}//load last 3 days
                        }
                        for (let addExtra=24; addExtra<dataArray.length; addExtra++){//add any extra packs onto data array
                            pd.push(dataArray[addExtra]);
                        }
                        resolve(pd);
                    },
                    onStop: function () {
                        window.alert('Sorry, can\'t connect to our server right now');
                        reject(error.reason);
                    }
                });
        });
    }
    getCollection(name, ID, homeData){//retrieve from server set(s) of verses...combo pack if name is string array, single if string, bonus if number
        return new Promise(
            function (resolve, reject) {
                if (Array.isArray(name)){//combo pack
                    var title = [];
                    var index = [];
                    var num_verses = [];
                    var solved = [[],[],[]];
                    var product_id = '';
                    var bg_color = [];
                    var verses = [[],[],[]];
                    var combinedName = name[0] + ' ' + name[1] + ' ' + name[2];
                    for (var k = 0; k < 3; k++){
                        for (var b = 0; b < homeData.length; b++){
                            var obj = homeData[b];
                            for (var el in obj) {
                                if (el == 'data'){
                                    for(var j=0; j<obj[el].length; j++){
                                        if(homeData[b].data[j].name == name[k]){
                                            title[k] = homeData[b].data[j].name;
                                            index[k] = (homeData.length + k).toString();
                                            num_verses[k] = homeData[b].data[j].num_verses;
                                            bg_color[k] = homeData[b].data[j].color;
                                            continue;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    for (var sol=0; sol<3; sol++){
                        var arr = new Array(parseInt(num_verses[sol])).fill(0);
                        solved[sol] = arr;
                    }

                    const subs = Meteor.subscribe('AllData', {
                        onReady: function () {
                                const d_verses = Meteor.collection('dataC').find({pack: combinedName});
                                var verseCount = 0;
                                var whichOfThe3 = 0;
                                for (var key in d_verses) {
                                    var obj = d_verses[key];
                                    for (var prop in obj) {
                                        if(prop=='puzz'){
                                            verses[whichOfThe3].push(obj[prop]);
                                            verseCount++;
                                        }
                                        if (verseCount == num_verses[whichOfThe3]){
                                            whichOfThe3++;
                                            verseCount = 0;
                                        }
                                    }
                                }
                                for (var push = 0; push < 3; push++){
                                    homeData.push({
                                        title: title[push],
                                        index: index[push],
                                        type: 'mypack',
                                        show: 'true',
                                        num_verses: num_verses[push],
                                        num_solved: '0',
                                        solved: solved[push],
                                        product_id: ID,
                                        bg_color: bg_color[push],
                                        verses: verses[push]
                                    });
                                }
                                resolve(homeData);
                            },
                        onStop: function () {
                            window.alert('Sorry, can\'t connect to our server right now');
                            reject(error.reason);
                        }
                    });
                }else{
                    var strName = '';
                    var title = '';
                    var index = '';
                    var num_verses = '';
                    var solved = [];
                    var bg_color = '';
                    var verses = [];
                    if(typeof name == 'string'){//regular pack
                        strName = name;
                        for (var k = 0; k < homeData.length; k++){
                        var obj = homeData[k];
                            for (var el in obj) {
                                if (el == 'data'){
                                    for(var j=0; j<obj[el].length; j++){
                                        if(homeData[k].data[j].name == name){
                                            title = homeData[k].data[j].name;
                                            num_verses = homeData[k].data[j].num_verses;
                                            bg_color = homeData[k].data[j].color;
                                            continue;
                                        }
                                    }
                                }
                            }
                        }
                    }else{//bonus pack for score level
                        strName = name.toString();
                        for(var bb=0; bb<bonuses.length; bb++){
                            if (bonuses[bb][0] == strName){
                                title = bonuses[bb][1];
                                num_verses = bonuses[bb][2];
                                bg_color = bonuses[bb][3];
                                continue;
                            }
                        }
                    }
                    var arr = new Array(parseInt(num_verses)).fill(0);
                    solved = arr;

                    const subs = Meteor.subscribe('AllData', {
                        onReady: function () {
                            const d_verses = Meteor.collection('dataP').find({pack: strName});
                            for (var key in d_verses) {
                                var obj = d_verses[key];
                                for (var prop in obj) {
                                    if(prop=='puzz'){
                                        verses.push(obj[prop]);
                                    }
                                }
                            }
                            homeData.push({
                                title: title,
                                index: homeData.length.toString(),
                                type: 'mypack',
                                show: 'true',
                                num_verses: num_verses,
                                num_solved: '0',
                                solved: solved,
                                product_id: ID,
                                bg_color: bg_color,
                                verses: verses
                            });
                            resolve(homeData);
                        },
                        onStop: function () {
                            window.alert('Sorry, can\'t connect to our server right now');
                            reject(error.reason);
                        }
                    });
                }
        });
    }
    gotoScene(whichScene, homeData){
        var myPackArray = [];
        var str = '';
        for (var key in homeData){
            if (homeData[key].type == 'mypack'){
                myPackArray.push(homeData[key].title);
            }
        }
        var levels = [3,4,5,6];//Easy, Moderate, Hard, Theme
        for(var i=0; i<4; i++){
            var titleIndex = -1;
            var rnd = Array.from(new Array(homeData[levels[i]].data.length), (x,i) => i);
            rnd = shuffleArray(rnd);
            for (var r=0; r<homeData[levels[i]].data.length; r++){
                if (myPackArray.indexOf(homeData[levels[i]].data[rnd[r]].name) < 0){
                    titleIndex = rnd[r];
                    break;
                }
            }
            if (titleIndex !== -1){
                homeData[20 + i].title = '*' + homeData[levels[i]].data[titleIndex].name;
                homeData[20 + i].product_id = homeData[levels[i]].data[titleIndex].product_id;
                homeData[20 + i].num_verses = homeData[levels[i]].data[titleIndex].num_verses;
                homeData[20 + i].bg_color = homeData[levels[i]].data[titleIndex].color;
            }else{
                homeData[20 + i].show = 'false';
            }
        }
        this.props.navigator.replace({
            id: whichScene,
            passProps: {
                homeData: homeData,
                isPremium: this.state.hasPremium,
                seenIntro: this.state.seenStart,
                introIndex: 0,
                connectionBool: true,//connected,
                destination: 'home'
                },
       });
    }
    setNotifications(time){
//        var time = this.state.notif_time;
        if (time == '0'){return}
        var date = new Date(Date.now() + (10 * 1000));
        var tomorrowAM = new Date(Date.now() + (moment(tonightMidnight).add(parseInt(time, 10), 'hours').valueOf()) - nowISO);

        PushNotification.localNotificationSchedule({
            message: 'Your Daily Verse is here...',
            vibrate: true,
            soundName: 'plink.mp3',
            //repeatType: 'day',//can be 'time', if so use following:
            repeatTime: 86400000,//daily
            date: tomorrowAM,
            id: '777',
        });
    }


    render() {
		return(
			<View style={ splash_styles.container }>
				<Image style={{ width: normalize(height/4), height: normalize(height/12) }} source={require('../images/logo.png')} />
				<ActivityIndicator style={splash_styles.spinner} animating={true} size={'large'}/>
			</View>
		)
    }
}

const splash_styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    spinner: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    }
});

module.exports = SplashScreen;