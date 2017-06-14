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
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
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
            line1Text: 'n the beginning, God',
            line2Text: 'created heaven and earth.',
            line3Text: 'created heaven and earth.',
            line4Text: 'created heaven and earth.',
            line5Text: 'created heaven and earth.',
            line6Text: 'created heaven and earth.',
            line7Text: 'created heaven and earth.',
            line8Text: 'created heaven and earth.',
            nextFrag: '',
            onThisFragment: 0,
            fragmentOrder: [],
            wordArrayPosition: [0, 0, 0],
            verseKey: '',
            initialLetter: ''
        }
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        AppState.addEventListener('change', this.handleAppStateChange);
        this.populateArrays(this.props.homeData[16].puzzles[0]);



        this.setState({isLoading: false});
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


    populateArrays(theVerse){
        let verseKeyString = cleanup(theVerse);
        let initial = verseKeyString.substr(0, 1);
        verseKeyString = verseKeyString.substring(1);
        let verseArray = theVerse.split(' ');
        let fragments = [];
        let lettersArr = verseKeyString.split('');
        let remainingStr = verseKeyString;
        let haveNotFinished = true;
        let rndLength = 0;

        while (haveNotFinished){
            let fragAssemble = '';
            if (remainingStr.length > 15){
                            console.log(remainingStr);

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
                if (fragments.length % 3 == 0){
                    haveNotFinished = false;
                }else{
                    fragments.length = 0;
                    remainingStr = verseKeyString;
                }
            }
        }
    let showRowBools = [false, false, false, false, false, false];
    switch(fragments.length){
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
    this.setState({fragmentOrder: fragments,
                    nextFrag: fragments[0]
                })
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


    this.setState({ frag0: fragmentsBackup[0], frag1: fragmentsBackup[1], frag2: fragmentsBackup[2], frag3: fragmentsBackup[3], frag4: fragmentsBackup[4], frag5: fragmentsBackup[5], frag6: fragmentsBackup[6], frag7: fragmentsBackup[7], frag8: fragmentsBackup[8], frag9: fragmentsBackup[9], frag10: fragmentsBackup[10], frag11: fragmentsBackup[11], frag12: fragmentsBackup[12],
                    frag13: fragmentsBackup[13], frag14: fragmentsBackup[14], frag15: fragmentsBackup[15], frag16: fragmentsBackup[16], frag17: fragmentsBackup[17], frag18: fragmentsBackup[18],frag19: fragmentsBackup[19], frag20: fragmentsBackup[20], frag21: fragmentsBackup[21], frag22: fragmentsBackup[22], frag23: fragmentsBackup[23],
                    rows3: showRowBools[0], rows4: showRowBools[1], rows5: showRowBools[2], rows6: showRowBools[3], rows7: showRowBools[4], rows8: showRowBools[5],
                    })


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
        let increment = this.state.onThisFragment;
        increment += 1;
        let nextStr = this.state.fragmentOrder[increment]
    console.log(JSON.stringify(this.state.fragmentOrder));
        this.setState({nextFrag: nextStr,
                        onThisFragment: increment
                    })

    console.log(text + ' ' + nextStr + ' ' + increment);

    }
    flipPanel(){
        this.flip.setValue(0);
        let chapterVerse = '';
        let pBgC ='';
        let pBC = '';
        let bool = false;
        if(!this.state.showingVerse){
            chapterVerse = 'Genesis 1, Verse 1';
            pBgC = '#333333';
            pBC = '#000000';
            bool = true;
            this.setState({panelText: chapterVerse,
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
            chapterVerse = '';
            pBgC = this.props.bgColor;
            pBC = invertColor(this.props.bgColor, true);
            Animated.timing(this.flip, { toValue: 0.5, duration: 100, })
            .start(() => this.setState({panelText: chapterVerse,
                                       panelBgColor: pBgC,
                                       panelBorderColor: pBC,
                                       showingVerse: bool
                                       }))
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
                    <View style={ game_styles.header }>
                        <Button style={{left: height*.02}} onPress={ () => this.closeGame() }>
                            <Image source={ require('../images/arrow_back.png') } style={ { width: normalize(height*0.07), height: normalize(height*0.07) } } />
                        </Button>
                        <Text style={styles.header_text} >{ this.state.title }</Text>
                        <Button style={{right: height*.02}}>
                            <Image source={ require('../images/no_image.png') } style={ { width: normalize(height*0.07), height: normalize(height*0.07) } } />
                        </Button>
                    </View>
                    <View style={game_styles.tablet}>
                            <Image style={{ width: normalize(height/2.5), height: normalize(height/4) }} source={require('../images/bible_graphic.png')} />
                            <Image style={game_styles.letter} source={require('../images/letters/i.png')} />
                            <View style={game_styles.verse_container}>
                                <View style={game_styles.first_line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line1Text }</Text>
                                </View>
                                <View style={game_styles.first_line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line2Text }</Text>
                                </View>
                                <View style={game_styles.first_line}>
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
                                <View style={game_styles.line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line8Text }</Text>
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
                                <Tile text={ this.state.frag0 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                <Tile text={ this.state.frag1 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                <Tile text={ this.state.frag2 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                            </View>
                            <View style={game_styles.tile_row} >
                                <Tile text={ this.state.frag3 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                <Tile text={ this.state.frag4 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                <Tile text={ this.state.frag5 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                            </View>
                        { this.state.rows3 &&
                            <View style={game_styles.tile_row} >
                                <Tile text={ this.state.frag6 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                <Tile text={ this.state.frag7 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                <Tile text={ this.state.frag8 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                            </View>
                        }
                        { this.state.rows4 &&
                                <View style={game_styles.tile_row} >
                                    <Tile text={ this.state.frag9 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile text={ this.state.frag10 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile text={ this.state.frag11 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                </View>
                        }
                        { this.state.rows5 &&
                                <View style={game_styles.tile_row} >
                                    <Tile text={ this.state.frag12 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile text={ this.state.frag13 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile text={ this.state.frag14 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                </View>
                        }
                        { this.state.rows6 &&
                                <View style={game_styles.tile_row} >
                                    <Tile text={ this.state.frag15 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile text={ this.state.frag16 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile text={ this.state.frag17 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                </View>
                        }
                        { this.state.rows7 &&
                                <View style={game_styles.tile_row} >
                                    <Tile text={ this.state.frag18 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile text={ this.state.frag19 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile text={ this.state.frag20 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                </View>
                        }
                        { this.state.rows8 &&
                                <View style={game_styles.tile_row} >
                                    <Tile text={ this.state.frag21 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile text={ this.state.frag22 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                    <Tile text={ this.state.frag23 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }}/>
                                </View>
                        }
                    </View>

                    <View style={game_styles.footer}>
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
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 6,
        width: width,
        backgroundColor: '#000000',
        borderBottomWidth: 10,
        borderBottomColor: '#222222'
    },
    tablet: {
        flex: 5,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        width: width,
    },
    letter: {
        position: 'absolute',
        left: normalize(height/10),
        top: normalize(height/20),
        width: normalize(height/12),
        height: normalize(height/12),

    },
    verse_container: {
        flex: 1,
        position: 'absolute',
        left: normalize(height/9.5),
        top: normalize(height/16),
        width: normalize(height/3),
        height: normalize(height/5),

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
        fontSize: 16,
        color: '#000000',
        fontFamily: 'notoserif'
    },
    verse_panel_container: {
        flex: 1,
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
        flex: 8,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: width,
    },
    footer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        borderTopWidth: 2,
        borderColor: '#000000'
    },
    tile_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
  tile: {
    height: height/20,
    width: height/6,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#000000'
  }
});

module.exports = Game;