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
var seedData = require('../config/data');
var nowISO = 0;
var tonightMidnight = 0;
const bonuses = [['10', 'Welcome +10', '5', '#620887'], ['50', 'Dedicated +50', '10', '#f4ce57'], ['100', 'Talented +100', '10', '#f2404c'], ['250', 'Skilled +250', '10', '#0817a2'], ['500', 'Seasoned +500', '20', '#6e097d'], ['1000', 'Expert +1000', '25', '#f5eaf6'], ['100000000000', 'TooMuch', '1', '#000000']];
const KEY_Premium = 'premiumOrNot';
const KEY_Verses = 'versesKey';
const KEY_SeenStart = 'seenStartKey';
const KEY_Notifs = 'notifsKey';
const KEY_NotifTime = 'notifTimeKey';
const KEY_Solved = 'numSolvedKey';
const KEY_ratedTheApp = 'ratedApp';
const KEY_NextBonus = 'bonusKey';
const {width, height} = require('Dimensions').get('window');
import { normalize }  from '../config/pixelRatio';
//'ws://52.52.205.96:80/websocket'; <= Publications...publication AllData, collections dataA...dataZ; MeteorApp
//'ws://10.0.0.207:3000/websocket'; <= localhost
var METEOR_URL = 'ws://52.52.205.96:80/websocket';


class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'splash',
            seenStart: 'false',
            notif_time: '',
            hasPremium: 'false',
            connectionBool: true,
            getPurchased: false,
            nextBonus: '0',
            totalScore: '0',
            pData: []
        };
    }
    componentDidMount() {
        StatusBar.setHidden(true);
        Meteor.connect(METEOR_URL);
        var homeData = [];
        nowISO = moment().valueOf();//determine offset # of days for daily verses...
        tonightMidnight = moment().endOf('day').valueOf();
        var launchDay = moment('2017 05', 'YYYY-MM');//May 1, 2017
        var dayDiff = -launchDay.diff(nowISO, 'days');//# of days since 5/1/2017
        var startNum = dayDiff - 28;
        if(this.props.motive == 'initialize'){
            var ownedPacks = [];
            var getPurchasedBool = true;
            var premiumBool = 'false';

            AsyncStorage.getItem(KEY_Verses).then((verses) => {
                if (verses !== null) {//get current data:
                    homeData = JSON.parse(verses);
                }else{//store seed data, as this is the first time using the app:
                    homeData = seedData;
                    try {
                        AsyncStorage.setItem(KEY_Verses, JSON.stringify(seedData));
                    } catch (error) {
                        window.alert('AsyncStorage error: ' + error.message);
                    }
                }
                if (homeData.length > 22){//screen for bonus packs vs. purchased packs
                    for (let chk=22; chk<homeData.length; chk++){
                        if (homeData[chk].product_id.indexOf('bonus') < 0){
                            homeData[17].show = 'false';//purchased something, gets access to last 30 daily verses rather than last 3 days
                            homeData[18].show = 'true';
                            premiumBool = 'true';
                            getPurchasedBool = false;//a purchased pack is here, we don't need to retrieve them which would erase progress stats
                            continue;
                        }
                    }
                }
                this.setState({ hasPremium: premiumBool,
                                getPurchased: getPurchasedBool,
                                pData: homeData
                });



                return AsyncStorage.getItem(KEY_NextBonus);
            }).then((nb) => {//get next bonus level, compare to current number solved, download bonus pack accordingly...
                if (nb !== null){
                    this.setState({nextBonus: nb});
                }else{
                    this.setState({nextBonus: '10'});
                    try {
                        AsyncStorage.setItem(KEY_NextBonus, '10');
                    } catch (error) {
                        window.alert('AsyncStorage error: ' + error.message);
                    }
                }

                return AsyncStorage.getItem(KEY_Solved);
            }).then((ns) => {//number solved
                var solvNum = 0;
                var strNextBonus = this.state.nextBonus;
                var bonusScore = parseInt(strNextBonus);//send number so getPuzzlePack() knows this is a bonus pack
                if (ns !== null){
                    solvNum =  parseInt(ns, 10);
                }else{
                    try {
                        AsyncStorage.setItem(KEY_Solved, '0');
                    } catch (error) {
                        window.alert('AsyncStorage error: ' + error.message);
                    }
                }
                if (solvNum >= bonusScore){
                    const bID = 'bonus.' + strNextBonus;
                    for (let getNext=0; getNext<bonuses.length; getNext++){
                        if (bonuses[getNext][0] == strNextBonus){
                            const nextToSet = bonuses[getNext + 1][0];//ignoring index-out-of-bounds possibility as top bonus is set at 100,000,000,000...
                            try {
                                AsyncStorage.setItem(KEY_NextBonus, nextToSet);
                            } catch (error) {
                                window.alert('AsyncStorage error: ' + error.message);
                            }
                        }
                    }
                    return this.getPuzzlePack(bonusScore, bID, this.state.pData);
                }else{
                    return false;
                }
            }).then((pArray) => {
                if (pArray)this.setState({pData: pArray});
                return AsyncStorage.getItem(KEY_Notifs);            }).then((notifHour) => {//notification hour, zero if no notifications (from Settings)
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
                return AsyncStorage.getItem(KEY_SeenStart);
            }).then((seenIntro) => {
                if (seenIntro !== null) {//has already seen app intro
                    this.setState({seenStart: seenIntro});
                }else{    //hasn't seen app intro...
                    this.setState({seenStart: 'false'});
                    try {
                        AsyncStorage.setItem(KEY_SeenStart, 'true');
                    } catch (error) {
                        window.alert('AsyncStorage error: ' + error.message);
                    }
                }
                    return NetInfo.isConnected.fetch();
            }).then((isConnected) => {//if has internet connection, get daily verses and current app object
                if(Meteor.status().status == 'connected'){//isConnected && ...
                    return this.getData(this.state.pData, startNum);//load daily puzzles
                }else{//still let have access to 30 days already on device even if no internet connection
                    AsyncStorage.getItem(KEY_Premium).then((prem) => {
                        premiumBool = 'false';
                        if(prem == 'true'){
                            homeData[17].show = 'false';
                            homeData[18].show = 'true';
                            premiumBool = 'true';
                        }
                        this.setState({ connectionBool: false,
                                        hasPremium: premiumBool
                        })
                        return false;
                    });
                }
            }).then((verseArray) => {
                if(verseArray){
                    verseArray[16].num_solved = homeData[16].num_solved;//set 'In The Beginning...' to its current state
                    verseArray[16].type = homeData[16].type;
                    verseArray[16].show = homeData[16].show;
                    this.setState({ pData: verseArray });
                    return true;
                }else{
                    return false;
                }
            }).then((isConnected) => {//retrieve purchased packs here
                var promises = [];
                if(isConnected && this.state.getPurchased && Meteor.status().status == 'connected'){
                    var packNames = [];
                    var packsOnDevice = [];
                    for (var k=0; k<this.state.pData.length; k++){
                        if (this.state.pData[k].type == 'mypack'){
                            if(this.state.pData[k].product_id != ''){
                                packsOnDevice.push(this.state.pData[k].product_id);
                            }
                        }
                    }
                    for (var goThroughOwned=0; goThroughOwned<ownedPacks.length; goThroughOwned++){
                        if (packsOnDevice.indexOf(ownedPacks[goThroughOwned]) < 0){
                            var idArray = ownedPacks[goThroughOwned].split('.');
                            if (idArray && idArray.length < 4){//e.g. android.test.purchased
                                continue;
                            }else if (idArray && idArray.length == 4){//single pack
                                var packTitle = '';
                                var packNameArray = idArray[2].split('_');
                                switch (packNameArray.length){
                                    case 1:
                                        packTitle = packNameArray[0].charAt(0).toUpperCase() + packNameArray[0].slice(1);
                                        break;
                                    case 2:
                                        packTitle = packNameArray[0].charAt(0).toUpperCase() + packNameArray[0].slice(1) + ' ' + packNameArray[1].charAt(0).toUpperCase() + packNameArray[1].slice(1);
                                        break;
                                    case 3://_and_ in product ID, ' & ' in title
                                        packTitle = packNameArray[0].charAt(0).toUpperCase() + packNameArray[0].slice(1) + ' & ' + packNameArray[2].charAt(0).toUpperCase() + packNameArray[2].slice(1);
                                        break;
                                    default:
                                }
                                promises.push(this.getCollection(packTitle, ownedPacks[goThroughOwned], this.state.pData));
                            }else if (idArray && idArray.length == 5){//combo pack
                                var packTitleArray = [];
                                for (var m=0; m<3; m++){
                                    var idTitle = idArray[m + 2];
                                    var packTitle = '';
                                    var packNameArray = idTitle.split('_');
                                    switch (packNameArray.length){
                                        case 1:
                                            packTitle = packNameArray[0].charAt(0).toUpperCase() + packNameArray[0].slice(1);
                                            break;
                                        case 2:
                                            packTitle = packNameArray[0].charAt(0).toUpperCase() + packNameArray[0].slice(1) + ' ' + packNameArray[1].charAt(0).toUpperCase() + packNameArray[1].slice(1);
                                            break;
                                        case 3://_and_ in product ID, ' & ' in title
                                            packTitle = packNameArray[0].charAt(0).toUpperCase() + packNameArray[0].slice(1) + ' & ' + packNameArray[2].charAt(0).toUpperCase() + packNameArray[2].slice(1);
                                            break;
                                        default:
                                    }
                                    packTitleArray.push(packTitle)
                                }
                                promises.push(this.getCollection(packTitleArray, ownedPacks[goThroughOwned], this.state.pData));
                            }else{
                                console.log('Unknown Product: ', ownedPacks[goThroughOwned]);
                            }
                        }
                    }
                }
                return Promise.all(promises);
            }).then(() => {
                var whereToGo = (this.state.seenStart == 'true')?'home':'intro';
                setTimeout(() => {this.gotoScene(whereToGo, this.state.pData)}, 500);//Hate to do this, but avoids warning of setting state on mounted component
            }).catch(function(error) {
                window.alert('splash 200: ' + error.message);
            });
        }else{//purchased verse pack...
            this.setState({hasPremium: 'true'});
            try {
                AsyncStorage.setItem(KEY_Premium, 'true');//
            } catch (error) {
                window.alert('AsyncStorage error: ' + error.message);
            }
            AsyncStorage.getItem(KEY_Verses).then((verses) => {
                homeData = JSON.parse(verses);
                homeData[17].show = 'false';
                homeData[18].show = 'true';
                return homeData;
            }).then((theData) => {
                return this.getCollection(this.props.packName, this.props.productID, theData);
            }).then((data) => {
                this.gotoScene('home', data);
            }).catch(function(error) {
                window.alert('282: ' + error.message);
            });
        }
	}
    getData(dataArray, sNum){//retrieve server data here, sNum is offset number for daily verses;
        return new Promise(
            function (resolve, reject) {
                const handle = Meteor.subscribe('AllData', {
                    onReady: function () {
                        const d_verses = Meteor.collection('dataV').find();//dataV => daily verses and homeData object
                        var vData = [];
                        var verseStringArray = [];
                        d_verses.forEach(function (row) {
                            if(parseInt(row.vnum, 10) == 0){//get homeData object here
                                vData = row.data;
                            }
                            if((parseInt(row.vnum, 10) >= sNum) && (parseInt(row.vnum, 10) < (sNum + 31))){//daily verses here
                                verseStringArray.unshift(row.vs);
                            }
                        });
                        vData.length = 22;//truncate extra elements, which shouldn't be necessary but is...
                        vData[13].verses[0] = verseStringArray[0];//load today's verse
                        verseStringArray.shift();
                        for(var jj=0; jj<verseStringArray.length; jj++){
                            vData[15].verses[jj] = verseStringArray[jj];//load last 30 days
                            if(jj < 3){vData[14].verses[jj] = verseStringArray[jj];}//load last 3 days
                        }
                        for (let addExtra=25; addExtra<dataArray.length; addExtra++){//add any extra packs onto data array
                            vData.push(dataArray[addExtra]);
                        }
//                        vData[17].solved = dataArray[17].solved;
                        vData[17].num_verses = dataArray[17].num_verses;
//                        vData[17].num_solved = dataArray[17].num_solved;
                        vData[17].show = dataArray[17].show;
                        vData[17].verses = dataArray[17].verses;
                        resolve(vData);
                    },
                    onStop: function () {
                        window.alert('Sorry, can\'t connect to our server right now');
                        reject(error.reason);
                    }
                });
        });
    }
    getCollection(name, ID, theData){//retrieve from server set(s) of verses...combo pack if name is string array, single if string, bonus if number
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
                        for (var b = 0; b < theData.length; b++){
                            var obj = theData[b];
                            for (var el in obj) {
                                if (el == 'data'){
                                    for(var j=0; j<obj[el].length; j++){
                                        if(theData[b].data[j].name == name[k]){
                                            title[k] = theData[b].data[j].name;
                                            index[k] = (theData.length + k).toString();
                                            num_verses[k] = theData[b].data[j].num_verses;
                                            bg_color[k] = theData[b].data[j].color;
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
                                    theData.push({
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
                                resolve(theData);
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
                        for (var k = 0; k < theData.length; k++){
                        var obj = theData[k];
                            for (var el in obj) {
                                if (el == 'data'){
                                    for(var j=0; j<obj[el].length; j++){
                                        if(theData[k].data[j].name == name){
                                            title = theData[k].data[j].name;
                                            num_verses = theData[k].data[j].num_verses;
                                            bg_color = theData[k].data[j].color;
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
                            theData.push({
                                title: title,
                                index: theData.length.toString(),
                                type: 'mypack',
                                show: 'true',
                                num_verses: num_verses,
                                num_solved: '0',
                                solved: arr,
                                product_id: ID,
                                bg_color: bg_color,
                                verses: verses
                            });
                            resolve(theData);
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
        var levels = [5, 5, 6, 7];
        for(var i=0; i<4; i++){
            var titleIndex = -1;
            var rnd = Array.from(new Array(homeData[levels[i]].data.length), (x,i) => i);
            rnd = shuffleArray(rnd);
            for (var r=0; r<rnd.length; r++){
                if (myPackArray.indexOf(homeData[levels[i]].data[rnd[r]].name) < 0){
                    titleIndex = rnd[r];
                    myPackArray.push(homeData[levels[i]].data[rnd[r]].name);
                    break;
                }
            }
            if (titleIndex > -1){
                homeData[18 + i].title = '*' + homeData[levels[i]].data[titleIndex].name;
                homeData[18 + i].product_id = homeData[levels[i]].data[titleIndex].product_id;
//                homeData[18 + i].num_verses = homeData[levels[i]].data[titleIndex].num_verses;
                homeData[18 + i].bg_color = homeData[levels[i]].data[titleIndex].color;
            }else{
                homeData[18 + i].show = 'false';
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
            message: 'Your Verse of the Day is here...',
            vibrate: true,
            largeIcon: "ic_notification",//default: "ic_launcher"
            smallIcon: "ic_notification",
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
				<Image style={ splash_styles.image } source={require('../images/logo.png')} />
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
    },
    image: {
        width: normalize(height*.35),
        height: normalize(height*.17),
        marginBottom: 20
    }
});

module.exports = SplashScreen;