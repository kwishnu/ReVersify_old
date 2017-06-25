import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, ListView, BackAndroid, AsyncStorage, NetInfo } from 'react-native';
import Meteor from 'react-native-meteor';
import Button from '../components/Button';
import configs from '../config/configs';
import { normalize, normalizeFont }  from '../config/pixelRatio';
//var InAppBilling = require("react-native-billing");
const styles = require('../styles/styles');
const { width, height } = require('Dimensions').get('window');
const CELL_WIDTH = width;
const CELL_HEIGHT = CELL_WIDTH * .5;
const CELL_PADDING = Math.floor(CELL_WIDTH * .08);
const TILE_WIDTH = (CELL_WIDTH - CELL_PADDING * 2);
const TILE_HEIGHT = CELL_HEIGHT - CELL_PADDING * 2;
const BORDER_RADIUS = CELL_PADDING * .3;
const KEY_expandInfo = 'expandInfoKey';
invertColor=(hex, bw)=> {
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
    // invert color components
    r = (255 - r).toString(16);
    r = (r.length == 1)?(r + '0'):r;
    g = (255 - g).toString(16);
    g = (g.length == 1)?(g + '0'):g;
    b = (255 - b).toString(16);
    b = (b.length == 1)?(b + '0'):b;

    // pad each with zeros and return
    return  "#" + r + g + b;
//     padZero(r) + padZero(g) + padZero(b);
}


module.exports = class Store extends Component {
    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })
        this.state = {
            id: 'store',
            dataSource: this.props.availableList,
            expand: this.props.expand,
            infoString: ''
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount(){
        AsyncStorage.getItem(KEY_expandInfo).then((strExpand) => {
            if(strExpand){
                let expandArr = strExpand.split('.');
                let tf = false;
                switch(this.props.dataIndex){
                    case 5:
                        tf = (expandArr[0] == '1')?true:false;
                        this.setState({expand: tf, infoString: `All Verse Collections contain 100 Verse Puzzles and are priced $0.99USD. A portion of the proceeds raised by the app will be donated to the WEB project of World Outreach Ministries.`});
                        break;
                    case 6: case 7:
                        tf = (expandArr[1] == '1')?true:false;
                        this.setState({expand: tf, infoString: `All Bible Books are priced $0.99USD and may be accessed by Chapter and Verse. A portion of the proceeds raised by the app will be donated to the WEB project of World Outreach Ministries.`});
                        break;
                }
            }
        });
        BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
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
    toggleInfoBox(bool){
        this.setState({expand: !bool});
        AsyncStorage.getItem(KEY_expandInfo).then((strExpand) => {
            let expArr = strExpand.split('.');
            let ind = 0;
            switch(this.props.dataIndex){
                case 5:
                    ind = 0;
                    break;
                case 6: case 7:
                    ind = 1;
                    break;
            }
            if(expArr[ind] == '1'){
                expArr[ind] = '0';
                let reglue = expArr.join('.');
                try {
                    AsyncStorage.setItem(KEY_expandInfo, reglue);//
                } catch (error) {
                    window.alert('AsyncStorage error: ' + error.message);
                }
            }

        });
    }

    render() {
        const rows = this.dataSource.cloneWithRows(this.props.availableList);
        if(this.state.expand){
            return (
                <View style={store_styles.container}>
                    <View style={ store_styles.header }>
                        <Button style={store_styles.button} onPress={ () => this.handleHardwareBackButton() }>
                            <Image source={ require('../images/arrowback.png') } style={ { width: normalize(height*.07), height: normalize(height*.07) } } />
                        </Button>
                        <Text style={styles.header_text} >{this.props.title}
                        </Text>
                        <Button style={store_styles.button}>
                            <Image source={ require('../images/noimage.png') } style={ { width: normalize(height*.07), height: normalize(height*.07) } } />
                        </Button>
                    </View>
                    <View style={store_styles.listview_container}>
                        <View style={[ store_styles.infoBox, {flex: 5} ]}>
                            <View style={ store_styles.text_container }>
                                <Text style={store_styles.info_text} >{this.state.infoString}</Text>
                            </View>
                            <View style={ store_styles.button_container }>
                                <Button style={ store_styles.gotit_button } onPress={ () => this.toggleInfoBox(this.state.expand) }>
                                        <Text style={[store_styles.button_text, {color: 'red'}]}> X   </Text>
                                        <Text style={[store_styles.button_text, {color: '#ffffff'}]} > Got it!</Text>
                                </Button>
                            </View>
                        </View>
                        <View style={{flex: 8}}>
                            <ListView  showsVerticalScrollIndicator ={false}
                                    contentContainerStyle={ store_styles.listview }
                                    dataSource={rows}
                                    renderRow={(data) => <Row props= {data} navigator= {this.props.navigator} /> }
                            />
                        </View>
                    </View>
                </View>
            );
        }else{
            return (
                <View style={store_styles.container}>
                    <View style={ store_styles.header }>
                        <Button style={store_styles.button} onPress={ () => this.handleHardwareBackButton() }>
                            <Image source={ require('../images/arrowback.png') } style={ { width: normalize(height*0.07), height: normalize(height*0.07) } } />
                        </Button>
                        <Text style={styles.header_text} >{this.props.title}</Text>
                        <Button style={store_styles.button} onPress={ () => this.toggleInfoBox() }>
                            <Image source={ require('../images/infoquestion.png') } style={ { width: normalize(height*0.07), height: normalize(height*0.07) } } />
                        </Button>
                    </View>
                    <View style={store_styles.listview_container}>
                        <View style={{flex: 12}}>
                            <ListView  showsVerticalScrollIndicator ={false}
                                    contentContainerStyle={ store_styles.listview }
                                    dataSource={rows}
                                    renderRow={(data) => <Row props= {data} navigator= {this.props.navigator} /> }
                            />
                        </View>
                    </View>
                </View>
            );
        }
    }
};

const Row = ({props, navigator}) => (
    <View style={ store_styles.purchase_row }>
        <View style={[store_styles.purchase_text_container, {backgroundColor: props.color}]}>
            <Text style={[store_styles.launcher_text, {color: this.invertColor(props.color, true)}]}>{props.name}</Text>
        </View>
        <View style={ store_styles.purchase_button_container } onStartShouldSetResponder={ ()=> {this.startPurchase(props.name, props.product_id, navigator)}}>
            <View style={store_styles.buy_button} >
                <Text style={store_styles.buy_text}>Purchase</Text>
            </View>
        </View>
    </View>
);

startPurchase = (item_name, itemID, nav) => {
    NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected && Meteor.status().status == 'connected'){
//            InAppBilling.open()
//            .then(() => InAppBilling.purchase(itemID))
//            .then((details) => {
                nav.pop({});
//                nav.replace({
//                    id: 'splash',
//                    passProps: {
//                        motive: 'purchase',
//                        packName: item_name,
//                        productID: itemID
//                    }
//                });
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
              //{`${props.name}`}
};


const store_styles = StyleSheet.create({
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
        width: window.width,
        backgroundColor: '#2B0B30',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: normalize(height*0.077),
        height: normalize(height*0.077)
    },
    gotit_button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#666666',
        width: height*.18,
        height: height*.06,
    },
    button_text: {
        fontSize: configs.LETTER_SIZE * .6,
        fontWeight: 'bold',
    },
    listview_container: {
        flex: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: height * .02,
        paddingRight: height * .02,
    },
    infoBox: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 6,
        width: width * .9,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#333333',
        marginTop: 16
    },
    text_container: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.7,
        backgroundColor: 'transparent',
    },
    button_container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: width * 0.75,
        backgroundColor: 'transparent',
    },
    listview: {
        marginTop: height * .02,
        paddingBottom: height * .04,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row_view: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_small: {
        fontSize: normalizeFont(configs.LETTER_SIZE * .07),
        marginLeft: height * .02,
        marginRight: height * .02
    },
    launcher_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * .1),
    },
    info_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * .085),
        color: '#333333'
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
    }
});