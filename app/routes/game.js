import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, BackAndroid, AsyncStorage, Animated, ActivityIndicator, Alert, Platform, Linking, AppState } from 'react-native';
import moment from 'moment';
import Button from '../components/Button';
import Tile from '../components/tile';
import DropdownMenu from '../components/DropdownMenu';
import configs from '../config/configs';
import { normalize, normalizeFont }  from '../config/pixelRatio';
const deepCopy = require('../config/deepCopy.js');
const styles = require('../styles/styles');
const {width, height} = require('Dimensions').get('window');

cleanup = (sentence) => {
   return sentence.toLowerCase().replace(/[^a-zA-Z]+/g, "");
}
randomBetween = (min,max) => {
    return Math.floor(Math.random()*(max-min+1)+min);
}
reverse = (s) => {
    return s.split("").reverse().join("");
}
shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
shadeColor = (color, percent) => {
    percent = percent/100;
    let f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

invertColor = (hex, bw) => {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.flip = new Animated.Value(0);
        this.grow = new Animated.Value(0);
        this.state = {
            id: 'game',
            title: this.props.title,
            shouldShowDropdown: false,
            isLoading: true,
            pan: new Animated.ValueXY(0),
            scale: new Animated.Value(1),
            bgColor: this.props.bgColor,
            panelBgColor: this.props.bgColor,
            panelBorderColor: invertColor(this.props.bgColor, true),
            showingVerse: false,
            pan0: new Animated.ValueXY(), pan1: new Animated.ValueXY(),
            rows3: true,
            rows4: true,
            rows5: true,
            rows6: true,
            rows7: true,
            rows8: true,
            frag0: '', frag1: '', frag2: '', frag3: '', frag4: '', frag5: '', frag6: '', frag7: '', frag8: '', frag9: '', frag10: '', frag11: '', frag12: '',
            frag13: '', frag14: '', frag15: '', frag16: '', frag17: '', frag18: '',frag19: '', frag20: '', frag21: '', frag22: '', frag23: '',
            panelText: '',
            line0Text: '',
            line1Text: '',
            line2Text: '',
            line3Text: '',
            line4Text: '',
            line5Text: '',
            line6Text: '',
            line7Text: '',
            nextFrag: '',
            onThisFragment: 0,
            fragmentOrder: [],
            wordsArray: [[], [], [], [], [], [], [], []],
            wordArrayPosition: [0, 0, 0],
            verseKey: '',
            chapterVerse: '',
            initialLetter: '',
            addSpace: false
        }
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        AppState.addEventListener('change', this.handleAppStateChange);
        let verseStr = this.props.homeData[16].puzzles[0];
        let initial = verseStr.substr(0, 1);
        verseStr = verseStr.substring(1);
        this.populateArrays(verseStr).then((values) => {
            if(values){
                this.setState({ fragmentOrder: values.fragmentOrder, nextFrag: values.nextFrag, chapterVerse: 'Genesis 1:1-2',
                                frag0: values.frag0, frag1: values.frag1, frag2: values.frag2, frag3: values.frag3, frag4: values.frag4, frag5: values.frag5, frag6: values.frag6, frag7: values.frag7, frag8: values.frag8, frag9: values.frag9, frag10: values.frag10, frag11: values.frag11, frag12: values.frag12,
                                frag13: values.frag13, frag14: values.frag14, frag15: values.frag15, frag16: values.frag16, frag17: values.frag17, frag18: values.frag18, frag19: values.frag19, frag20: values.frag20, frag21: values.frag21, frag22: values.frag22, frag23: values.frag23

                })
                this.assignWordsToRows(verseStr, initial);
            }
            return this.getRowBools(values.length);
        }).then((bools) => {
            if(bools){
                this.setState({
                    rows3: bools[0], rows4: bools[1], rows5: bools[2], rows6: bools[3], rows7: bools[4], rows8: bools[5]
                })
            }
        }).then(() => { setTimeout(() => {this.setState({ isLoading: false })}, 500)})
    }
    componentWillUnmount () {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
        AppState.removeEventListener('change', this.handleAppStateChange);
    }
    handleHardwareBackButton() {
        if(this.state.shouldShowDropdown){
            this.setState({ shouldShowDropdown: false });
        }else{
            this.closeGame(this.props.fromWhere);
        }
        return true;
    }
    handleAppStateChange=(appState)=>{
        if(appState == 'active'){
//            var timeNow = moment().valueOf();
//            AsyncStorage.getItem(KEY_Time).then((storedTime) => {
//                var sT = JSON.parse(storedTime);
//                var diff = (timeNow - sT)/1000;
//                if(diff>7200){
//                    try {
//                        AsyncStorage.setItem(KEY_Time, JSON.stringify(timeNow));
//                    } catch (error) {
//                        window.alert('AsyncStorage error: ' + error.message);
//                    }
//                    this.props.navigator.replace({
//                        id: 'splash',
//                        passProps: {motive: 'initialize'}
//                    });
//                }else{
//                    try {
//                        AsyncStorage.setItem(KEY_Time, JSON.stringify(timeNow));
//                    } catch (error) {
//                        window.alert('AsyncStorage error: ' + error.message);
//                    }
//                }
//            });
        }
    }
    assignWordsToRows(verse, letter){
        let layout = [[], [], [], [], [], [], [], []];
        let verseArray = verse.split(' ');
        let whichRow = 0;
        let letterTotal = 0;
        let lineLength = 0;
        for (let word=0; word<verseArray.length; word++){
            letterTotal += (verseArray[word].length + 1);
            lineLength = (whichRow < 3)?23:32;
            if (letterTotal > lineLength){
                layout[whichRow + 1].push(verseArray[word]);
                letterTotal = verseArray[word].length + 1;
                whichRow += 1;
            }else{
                layout[whichRow].push(verseArray[word]);
            }
        }
        this.setState({wordsArray: layout});
    }
    getRowBools(length){
        return new Promise(
            function (resolve, reject) {
                let showRowBools = [false, false, false, false, false, false];
                switch(length){
                    case 9:
                        showRowBools[0] = true;
                        break;
                    case 12:
                        showRowBools[0] = true;
                        showRowBools[1] = true;
                        break;
                    case 15:
                        showRowBools[0] = true;
                        showRowBools[1] = true;
                        showRowBools[2] = true;
                        break;
                    case 18:
                        showRowBools[0] = true;
                        showRowBools[1] = true;
                        showRowBools[2] = true;
                        showRowBools[3] = true;
                        break;
                    case 21:
                        showRowBools[0] = true;
                        showRowBools[1] = true;
                        showRowBools[2] = true;
                        showRowBools[3] = true;
                        showRowBools[4] = true;
                        break;
                    case 24:
                        showRowBools[0] = true;
                        showRowBools[1] = true;
                        showRowBools[2] = true;
                        showRowBools[3] = true;
                        showRowBools[4] = true;
                        showRowBools[5] = true;
                        break;
                }
                if(showRowBools){
                    resolve(showRowBools);
                }else{
                    reject(false);
                }
        });
    }
    populateArrays(theVerse){
        return new Promise(
            function (resolve, reject) {
                let verseKeyString = cleanup(theVerse);
                let fragments = [];
                let remainingStr = verseKeyString;
                let haveFinished = false;
                let rndLength = 0;

                while (!haveFinished){
                    let fragAssemble = '';
                    if (remainingStr.length > 15){
                        rndLength = randomBetween(4, 8);
                        for (let i=0; i<rndLength; i++){
                            fragAssemble += remainingStr.substr(i, 1);
                        }
                        remainingStr = remainingStr.substring(rndLength);
                        fragments.push(fragAssemble);
                    }else{
                        let twoNumbers = [];
                        switch(remainingStr.length){
                            case 8:
                                twoNumbers = [4, 4];
                                break;
                            case 9:
                                twoNumbers = [4, 5];
                                break;
                            case 10:
                                twoNumbers = [4, 6];
                                break;
                            case 11:
                                twoNumbers = [5, 6];
                                break;
                            case 12:
                                twoNumbers = [5, 7];
                                break;
                            case 13:
                                twoNumbers = [6, 7];
                                break;
                            case 14:
                                twoNumbers = [7, 7];
                                break;
                            case 15:
                                twoNumbers = [7, 8];
                                break;
                        }
                        for (let ii=0; ii<2; ii++){
                            for (let iii=0; iii<twoNumbers[ii]; iii++){
                                fragAssemble += remainingStr.substr(iii, 1);
                            }
                            remainingStr = remainingStr.substring(twoNumbers[0]);
                            fragments.push(fragAssemble);
                            fragAssemble = '';
                        }
                        if (fragments.length % 3 == 0 && fragments.length < 25){
                            haveFinished = true;
                        }else{
                            fragments.length = 0;
                            remainingStr = verseKeyString;
                        }
                    }
                }
//                let showRowBools = [false, false, false, false, false, false];
//                switch(fragments.length){
//                    case 9:
//                        showRowBools[0] = true;
//                        break;
//                    case 12:
//                        showRowBools[0] = true;
//                        showRowBools[1] = true;
//                        break;
//                    case 15:
//                        showRowBools[0] = true;
//                        showRowBools[1] = true;
//                        showRowBools[2] = true;
//                        break;
//                    case 18:
//                        showRowBools[0] = true;
//                        showRowBools[1] = true;
//                        showRowBools[2] = true;
//                        showRowBools[3] = true;
//                        break;
//                    case 21:
//                        showRowBools[0] = true;
//                        showRowBools[1] = true;
//                        showRowBools[2] = true;
//                        showRowBools[3] = true;
//                        showRowBools[4] = true;
//                        break;
//                    case 24:
//                        showRowBools[0] = true;
//                        showRowBools[1] = true;
//                        showRowBools[2] = true;
//                        showRowBools[3] = true;
//                        showRowBools[4] = true;
//                        showRowBools[5] = true;
//                        break;
//                }
                let fragmentsBackup = owl.deepCopy(fragments);
                for (let j=0; j<fragmentsBackup.length; j++){
                    let rnd = randomBetween(1, 3);
                    if (rnd == 1){
                        fragmentsBackup[j] = reverse(fragmentsBackup[j]);
                    }
                }
                fragmentsBackup = shuffleArray(fragmentsBackup);
                let difference = 24 - fragmentsBackup.length;
                for (let jj=0; jj<difference; jj++){
                    fragmentsBackup.push('');
                }
                let returnObject={ length: fragments.length, frag0: fragmentsBackup[0], frag1: fragmentsBackup[1], frag2: fragmentsBackup[2], frag3: fragmentsBackup[3], frag4: fragmentsBackup[4], frag5: fragmentsBackup[5], frag6: fragmentsBackup[6], frag7: fragmentsBackup[7], frag8: fragmentsBackup[8], frag9: fragmentsBackup[9], frag10: fragmentsBackup[10], frag11: fragmentsBackup[11], frag12: fragmentsBackup[12],
                                   frag13: fragmentsBackup[13], frag14: fragmentsBackup[14], frag15: fragmentsBackup[15], frag16: fragmentsBackup[16], frag17: fragmentsBackup[17], frag18: fragmentsBackup[18],frag19: fragmentsBackup[19], frag20: fragmentsBackup[20], frag21: fragmentsBackup[21], frag22: fragmentsBackup[22], frag23: fragmentsBackup[23],
                                   fragmentOrder: fragments, nextFrag: fragments[0]
                                 }
                if (haveFinished){
                    resolve(returnObject);
                }else{
                    reject(false);
                }
        });
    }
    closeGame(){
        this.props.navigator.replace({
            id: this.props.fromWhere,
            passProps: {
                homeData: this.props.homeData
            }
       });
    }
    onDrop(text) {
        let line0String = this.state.line0Text;
        let line1String = this.state.line1Text;
        let line2String = this.state.line2Text;
        let line3String = this.state.line3Text;
        let line4String = this.state.line4Text;
        let line5String = this.state.line5Text;
        let line6String = this.state.line6Text;
        let line7String = this.state.line7Text;
        let onLine = this.state.wordArrayPosition[0];
        let onWord = this.state.wordArrayPosition[1];
        let onLetter = this.state.wordArrayPosition[2];
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let fragArray = text.split('');
        let addSpace = this.state.addSpace;
        for (let fragLoop=0; fragLoop<fragArray.length; fragLoop++){
            let loopAgain = true;
            do {
                let theVerseLetter = this.state.wordsArray[onLine][onWord].substr(onLetter, 1);
                let theVerseLetterTLC = theVerseLetter.toLowerCase();
                if (theVerseLetterTLC == fragArray[fragLoop] || letters.indexOf(theVerseLetterTLC) < 0 || theVerseLetter.length == 0){
                    switch (onLine){
                        case 0:
                            line0String = (addSpace)?line0String + ' ' + theVerseLetter:line0String + theVerseLetter;
                            break;
                        case 1:
                            line1String = (addSpace)?line1String + ' ' + theVerseLetter:line1String + theVerseLetter;
                            break;
                        case 2:
                            line2String = (addSpace)?line2String + ' ' + theVerseLetter:line2String + theVerseLetter;
                            break;
                        case 3:
                            line3String = (addSpace)?line3String + ' ' + theVerseLetter:line3String + theVerseLetter;
                            break;
                        case 4:
                            line4String = (addSpace)?line4String + ' ' + theVerseLetter:line4String + theVerseLetter;
                            break;
                        case 5:
                            line5String = (addSpace)?line5String + ' ' + theVerseLetter:line5String + theVerseLetter;
                            break;
                        case 6:
                            line6String = (addSpace)?line6String + ' ' + theVerseLetter:line6String + theVerseLetter;
                            break;
                        case 7:
                            line7String = (addSpace)?line7String + ' ' + theVerseLetter:line7String + theVerseLetter;
                            break;
                    }
                    addSpace = false;
                }
                if (onLetter + 1 >= this.state.wordsArray[onLine][onWord].length){//finished a word
                    addSpace = true;
                    if (onWord + 1 == this.state.wordsArray[onLine].length){//at the end of a line
                        addSpace = false;
                        if (onLine == 7 || this.state.wordsArray[onLine + 1].length == 0){//finished
                            this.flipPanel();
                            break;
                        }
                        onWord = 0;
                        onLetter = 0;
                        onLine += 1;
                    }else{//staying on this line
                        onWord += 1;
                        onLetter = 0;
                    }
                }else{//still within a word
                    onLetter += 1;
                }
                let nextCharacter = this.state.wordsArray[onLine][onWord].substr(onLetter, 1);
                nextCharacter = nextCharacter.toLowerCase();
                loopAgain = (letters.indexOf(nextCharacter) < 0)?true:false;
            }while(loopAgain);
        }
        let increment = this.state.onThisFragment;
        increment += 1;
        let nextStr = this.state.fragmentOrder[increment]
        this.setState({nextFrag: nextStr,
                        onThisFragment: increment, addSpace: addSpace,
                        wordArrayPosition: [onLine, onWord, onLetter], line0Text: line0String,
                        line1Text: line1String, line2Text: line2String, line3Text: line3String,
                        line4Text: line4String, line5Text: line5String, line6Text: line6String, line7Text: line7String
                      })
    }
    headerFooterBorder(color) {
        var darkerColor = shadeColor(color, -30);
        return {borderColor: darkerColor};
    }
    headerFooterColor(color) {
        var darkerColor = shadeColor(color, -70);
        return {backgroundColor: darkerColor};
    }
    giveHint(){
        this.a.shakeText(this.state.nextFrag);
        this.b.shakeText(this.state.nextFrag);
        this.c.shakeText(this.state.nextFrag);
        this.d.shakeText(this.state.nextFrag);
        this.e.shakeText(this.state.nextFrag);
        this.f.shakeText(this.state.nextFrag);
        this.g.shakeText(this.state.nextFrag);
        this.h.shakeText(this.state.nextFrag);
        this.i.shakeText(this.state.nextFrag);
        this.j.shakeText(this.state.nextFrag);
        this.k.shakeText(this.state.nextFrag);
        this.l.shakeText(this.state.nextFrag);
        this.m.shakeText(this.state.nextFrag);
        this.n.shakeText(this.state.nextFrag);
        this.o.shakeText(this.state.nextFrag);
        this.p.shakeText(this.state.nextFrag);
        this.q.shakeText(this.state.nextFrag);
        this.r.shakeText(this.state.nextFrag);
        this.s.shakeText(this.state.nextFrag);
        this.t.shakeText(this.state.nextFrag);
        this.u.shakeText(this.state.nextFrag);
        this.v.shakeText(this.state.nextFrag);
        this.w.shakeText(this.state.nextFrag);
        this.x.shakeText(this.state.nextFrag);
    }
    flipPanel(){
        this.flip.setValue(0);
        let chapterVerseStr = '';
        let pBgC ='';
        let pBC = '';
        let bool = false;
        if(!this.state.showingVerse){
            chapterVerseStr = this.state.chapterVerse;
            pBgC = '#333333';
            pBC = '#000000';
            bool = true;
            this.setState({panelText: chapterVerseStr,
                                       panelBgColor: pBgC,
                                       panelBorderColor: pBC,
                                       showingVerse: bool
                           })
            Animated.timing(this.flip,
                 {
                    toValue: 1,
                    duration: 1000,
                  }
            ).start();
        }else{
            chapterVerseStr = '';
            pBgC = this.props.bgColor;
            pBC = invertColor(this.props.bgColor, true);
            this.setState({panelText: chapterVerseStr,
                           panelBgColor: pBgC,
                           panelBorderColor: pBC,
                           showingVerse: bool
                           })
        }
    }


  render() {
        const rotateY = this.flip.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
        let imageStyle = {transform: [{rotateY}]};
        if(this.state.isLoading == true){
            return(
                <View style={[game_styles.loading, {backgroundColor: this.state.bgColor}]}>
                    <ActivityIndicator animating={true} size={'large'}/>
                </View>
            );
        }else{
            return(
                <View style={[game_styles.container, {backgroundColor: this.state.bgColor}]}>
                    <View style={ [game_styles.header, this.headerFooterBorder(this.state.bgColor), this.headerFooterColor(this.state.bgColor)] }>
                        <Button style={{left: height*.02}} onPress={ () => this.closeGame() }>
                            <Image source={ require('../images/close.png') } style={ { width: normalize(height*0.07), height: normalize(height*0.07) } } />
                        </Button>
                        <Text style={styles.header_text} >{ this.state.title }</Text>
                        <Button style={{right: height*.02}}>
                            <Image source={ require('../images/noimage.png') } style={ { width: normalize(height*0.07), height: normalize(height*0.07) } } />
                        </Button>
                    </View>
                    <View style={game_styles.tablet}>
                            <Image style={{ width: normalize(height/2.5), height: normalize(height/4) }} source={require('../images/biblegraphic.png')} />
                            <Image style={game_styles.letter} source={require('../images/letters/i.png')} />
                            <View style={game_styles.verse_container}>
                                <View style={game_styles.first_line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line0Text }</Text>
                                </View>
                                <View style={game_styles.first_line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line1Text }</Text>
                                </View>
                                <View style={game_styles.first_line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line2Text }</Text>
                                </View>
                                <View style={game_styles.line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line3Text }</Text>
                                </View>
                                <View style={game_styles.line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line4Text }</Text>
                                </View>
                                <View style={game_styles.line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line5Text }</Text>
                                </View>
                                <View style={game_styles.line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line6Text }</Text>
                                </View>
                                <View style={game_styles.line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line7Text }</Text>
                                </View>
                                <View style={game_styles.line}></View>
                            </View>
                    </View>
                    <View style={game_styles.verse_panel_container} onStartShouldSetResponder={ ()=> {this.flipPanel()}}>
                        <Animated.View style={[imageStyle, game_styles.verse_panel, {backgroundColor: this.state.panelBgColor, borderColor: this.state.panelBorderColor}]}>
                                    <Text style={game_styles.panel_text} >{this.state.panelText}</Text>
                        </Animated.View>
                    </View>
                    <View style={game_styles.game}>
                            <View style={game_styles.tile_row} >
                                <Tile ref={(a) => { this.a = a; }} text={ this.state.frag0 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                <Tile ref={(b) => { this.b = b; }} text={ this.state.frag1 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                <Tile ref={(c) => { this.c = c; }} text={ this.state.frag2 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                            </View>
                            <View style={game_styles.tile_row} >
                                <Tile ref={(d) => { this.d = d; }} text={ this.state.frag3 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                <Tile ref={(e) => { this.e = e; }} text={ this.state.frag4 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                <Tile ref={(f) => { this.f = f; }} text={ this.state.frag5 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                            </View>
                        { this.state.rows3 &&
                            <View style={game_styles.tile_row} >
                                <Tile ref={(g) => { this.g = g; }} text={ this.state.frag6 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                <Tile ref={(h) => { this.h = h; }} text={ this.state.frag7 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                <Tile ref={(i) => { this.i = i; }} text={ this.state.frag8 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                            </View>
                        }
                        { this.state.rows4 &&
                                <View style={game_styles.tile_row} >
                                    <Tile ref={(j) => { this.j = j; }} text={ this.state.frag9 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile ref={(k) => { this.k = k; }} text={ this.state.frag10 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile ref={(l) => { this.l = l; }} text={ this.state.frag11 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                </View>
                        }
                        { this.state.rows5 &&
                                <View style={game_styles.tile_row} >
                                    <Tile ref={(m) => { this.m = m; }} text={ this.state.frag12 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile ref={(n) => { this.n = n; }} text={ this.state.frag13 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile ref={(o) => { this.o = o; }} text={ this.state.frag14 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                </View>
                        }
                        { this.state.rows6 &&
                                <View style={game_styles.tile_row} >
                                    <Tile ref={(p) => { this.p = p; }} text={ this.state.frag15 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile ref={(q) => { this.q = q; }} text={ this.state.frag16 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile ref={(r) => { this.r = r; }} text={ this.state.frag17 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                </View>
                        }
                        { this.state.rows7 &&
                                <View style={game_styles.tile_row} >
                                    <Tile ref={(s) => { this.s = s; }} text={ this.state.frag18 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile ref={(t) => { this.t = t; }} text={ this.state.frag19 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile ref={(u) => { this.u = u; }} text={ this.state.frag20 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                </View>
                        }
                        { this.state.rows8 &&
                                <View style={game_styles.tile_row} >
                                    <Tile ref={(v) => { this.v = v; }} text={ this.state.frag21 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile ref={(w) => { this.w = w; }} text={ this.state.frag22 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile ref={(x) => { this.x = x; }} text={ this.state.frag23 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                </View>
                        }
                    </View>
                    <View style={[game_styles.footer, this.headerFooterBorder(this.state.bgColor), this.headerFooterColor(this.state.bgColor)]}>
                        <View style={game_styles.hint_button} onStartShouldSetResponder={() => { this.giveHint() }}>
                            <Text style={game_styles.hint_text}>hint</Text>
                        </View>
                    </View>
                    <View style={game_styles.after_buttons}>
                        <Animated.Image       />
                        <Animated.Image       />
                        <Animated.Image       />
                    </View>

                </View>
            );
        }
    }
}



const game_styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 6,
        width: width,
        borderBottomWidth: 6,
    },
    tablet: {
        marginTop: 6,
        flex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        width: width,
    },
    letter: {
        position: 'absolute',
        left: normalize(height/11.5),
        top: normalize(height/23.5),
        width: normalize(height/12),
        height: normalize(height/12),
    },
    verse_container: {
        flex: 1,
        position: 'absolute',
        left: normalize(height/10.8),
        top: normalize(height/19),
        width: normalize(height*.4),
        height: normalize(height/4.8),
    },
    panel_icon: {
        position: 'absolute',
        right: normalize(height/70),
        top: normalize(height/200),
        width: normalize(height*0.05),
        height: normalize(height*0.05),
    },
    first_line: {
        flex: 1,
        paddingLeft: normalize(height/13),
    },
    line: {
        flex: 1,
    },
    verse_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.094),
        color: '#000000',
        fontFamily: 'Book Antiqua',
    },
    verse_panel_container: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
    },
    verse_panel: {
        alignItems: 'center',
        justifyContent: 'center',
        width: height/3.5,
        height: height/20,
        borderWidth: StyleSheet.hairlineWidth,
    },
    panel_text: {
        fontSize: 14,
        color: '#ffffff'
    },
    game: {
        flex: 16,
        marginTop: 6,
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
    },
    footer: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        borderTopWidth: 6,
    },
    hint_button: {
        height: height/23,
        width: height/9,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#486bdd',
        borderRadius: 15,
    },
    hint_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.094),
        color: '#ffffff',
        fontWeight: 'bold',
    },
    tile_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    after_buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: height/2,
        height: height/4
    }
});

module.exports = Game;