import React, {Component} from 'react';
import { View, Image, StyleSheet, NetInfo, AsyncStorage, ActivityIndicator, StatusBar } from 'react-native';
import Meteor from 'react-native-meteor';
import moment from 'moment';
//import PushNotification from 'react-native-push-notification';
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
const KEY_Puzzles = 'puzzlesKey';
const KEY_SeenStart = 'seenStartKey';
const KEY_Notifs = 'notifsKey';
const KEY_NotifTime = 'notifTimeKey';
const KEY_Score = 'scoreKey';
const KEY_NextBonus = 'bonusKey';
const {width, height} = require('Dimensions').get('window');
import { normalize }  from '../config/pixelRatio';
//'ws://52.52.199.138:80/websocket'; <= bbg3...publication AllData, collections data, data1, data2, details, puzzles, text, users; PuzzApp
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
        this.gotoScene('home', initialData)
	}
    getData(dataArray, sNum){//retrieve server data here, sNum is offset number for daily puzzles;
        return new Promise(
            function (resolve, reject) {
                const handle = Meteor.subscribe('AllData', {
                    onReady: function () {
                        const d_puzzles = Meteor.collection('dataD').find();//dataD => daily puzzles and puzzleData object
                        var pd = [];
                        var puzzStringArray = [];
                        d_puzzles.forEach(function (row) {
                            if(parseInt(row.pnum, 10) == 0){//get puzzleData object here
                                pd = row.data;
                            }
                            if((parseInt(row.pnum, 10) >= sNum) && (parseInt(row.pnum, 10) < (sNum + 31))){//daily puzzles here
                                puzzStringArray.unshift(row.puzz);
                            }
                        });
                        pd.length = 24;//truncate extra elements, which shouldn't be necessary but is...
                        pd[16].puzzles[0] = puzzStringArray[0];//load today's puzzle
                        puzzStringArray.shift();
                        for(var jj=0; jj<puzzStringArray.length; jj++){
                            pd[18].puzzles[jj] = puzzStringArray[jj];//load last 30 days
                            if(jj < 3){pd[17].puzzles[jj] = puzzStringArray[jj];}//load last 3 days
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
    getPuzzlePack(name, ID, puzzleData){//retrieve from server set(s) of puzzles...combo pack if name is string array, single if string, bonus if number
        return new Promise(
            function (resolve, reject) {
                if (Array.isArray(name)){//combo pack
                    var title = [];
                    var index = [];
                    var num_puzzles = [];
                    var solved = [[],[],[]];
                    var product_id = '';
                    var bg_color = [];
                    var puzzles = [[],[],[]];
                    var combinedName = name[0] + ' ' + name[1] + ' ' + name[2];
                    for (var k = 0; k < 3; k++){
                        for (var b = 0; b < puzzleData.length; b++){
                            var obj = puzzleData[b];
                            for (var el in obj) {
                                if (el == 'data'){
                                    for(var j=0; j<obj[el].length; j++){
                                        if(puzzleData[b].data[j].name == name[k]){
                                            title[k] = puzzleData[b].data[j].name;
                                            index[k] = (puzzleData.length + k).toString();
                                            num_puzzles[k] = puzzleData[b].data[j].num_puzzles;
                                            bg_color[k] = puzzleData[b].data[j].color;
                                            continue;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    for (var sol=0; sol<3; sol++){
                        var arr = new Array(parseInt(num_puzzles[sol])).fill(0);
                        solved[sol] = arr;
                    }

                    const subs = Meteor.subscribe('AllData', {
                        onReady: function () {
                                const d_puzzles = Meteor.collection('dataC').find({pack: combinedName});
                                var puzzleCount = 0;
                                var whichOfThe3 = 0;
                                for (var key in d_puzzles) {
                                    var obj = d_puzzles[key];
                                    for (var prop in obj) {
                                        if(prop=='puzz'){
                                            puzzles[whichOfThe3].push(obj[prop]);
                                            puzzleCount++;
                                        }
                                        if (puzzleCount == num_puzzles[whichOfThe3]){
                                            whichOfThe3++;
                                            puzzleCount = 0;
                                        }
                                    }
                                }
                                for (var push = 0; push < 3; push++){
                                    puzzleData.push({
                                        title: title[push],
                                        index: index[push],
                                        type: 'mypack',
                                        show: 'true',
                                        num_puzzles: num_puzzles[push],
                                        num_solved: '0',
                                        solved: solved[push],
                                        product_id: ID,
                                        bg_color: bg_color[push],
                                        puzzles: puzzles[push]
                                    });
                                }
                                resolve(puzzleData);
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
                    var num_puzzles = '';
                    var solved = [];
                    var bg_color = '';
                    var puzzles = [];
                    if(typeof name == 'string'){//regular pack
                        strName = name;
                        for (var k = 0; k < puzzleData.length; k++){
                        var obj = puzzleData[k];
                            for (var el in obj) {
                                if (el == 'data'){
                                    for(var j=0; j<obj[el].length; j++){
                                        if(puzzleData[k].data[j].name == name){
                                            title = puzzleData[k].data[j].name;
                                            num_puzzles = puzzleData[k].data[j].num_puzzles;
                                            bg_color = puzzleData[k].data[j].color;
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
                                num_puzzles = bonuses[bb][2];
                                bg_color = bonuses[bb][3];
                                continue;
                            }
                        }
                    }
                    var arr = new Array(parseInt(num_puzzles)).fill(0);
                    solved = arr;

                    const subs = Meteor.subscribe('AllData', {
                        onReady: function () {
                            const d_puzzles = Meteor.collection('dataP').find({pack: strName});
                            for (var key in d_puzzles) {
                                var obj = d_puzzles[key];
                                for (var prop in obj) {
                                    if(prop=='puzz'){
                                        puzzles.push(obj[prop]);
                                    }
                                }
                            }
                            puzzleData.push({
                                title: title,
                                index: puzzleData.length.toString(),
                                type: 'mypack',
                                show: 'true',
                                num_puzzles: num_puzzles,
                                num_solved: '0',
                                solved: solved,
                                product_id: ID,
                                bg_color: bg_color,
                                puzzles: puzzles
                            });
                            resolve(puzzleData);
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
    setNotifications(){
        var time = this.state.notif_time;
        if (time == '0'){return}
        //var date = new Date(Date.now() + (parseInt(time, 10) * 1000));
        var tomorrowAM = new Date(Date.now() + (moment(tonightMidnight).add(parseInt(time, 10), 'hours').valueOf()) - nowISO);

//        PushNotification.localNotificationSchedule({
//            message: 'A new Daily Puzzle is in!',
//            vibrate: true,
//            soundName: 'plink.mp3',
//            //repeatType: 'day',//can be 'time', if so use following:
//            repeatTime: 86400000,//daily
//            date: tomorrowAM,
//            id: '777',
//        });
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