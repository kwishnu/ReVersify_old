import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, BackAndroid, AsyncStorage, PanResponder, Animated, ActivityIndicator, Alert, Platform, Linking, AppState } from 'react-native';
import moment from 'moment';
import Button from '../components/Button';
import Tile from '../components/tile';
import DropdownMenu from '../components/DropdownMenu';
import configs from '../config/configs';
import { normalize, normalizeFont }  from '../config/pixelRatio';
const styles = require('../styles/styles');
const {width, height} = require('Dimensions').get('window');


class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'game',
            title: this.props.title,
            shouldShowDropdown: false,
            isLoading: true,
            bgColor: this.props.bgColor,
            frag0: '', frag1: '', frag2: '', frag3: '', frag4: '', frag5: '', frag6: '', frag7: '', frag8: '', frag9: '', frag10: '',
            frag11: '', frag12: '', frag13: '', frag14: '', frag15: '', frag16: '', frag17: '', frag18: '',frag19: '', frag20: '',
            opacity0: 1, opacity1: 1, opacity2: 1, opacity3: 1, opacity4: 1, opacity5: 1, opacity6: 1, opacity7: 1, opacity8: 1, opacity9: 1, opacity10: 1,
            opacity11: 1, opacity12: 1, opacity13: 1, opacity14: 1, opacity15: 1, opacity16: 1, opacity17: 1, opacity18: 1, opacity19: 1, opacity20: 1,
            pan0: new Animated.ValueXY(), pan1: new Animated.ValueXY(),
            five_rows: this.props.five_rows,
            seven_rows: this.props.seven_rows,
            dropZoneValues: [],
        }
//        this.panResponder = PanResponder.create({
//            onStartShouldSetPanResponder: () => true,
//            onPanResponderMove: Animated.event([null,{
//                dx : this.state.pan0.x,
//                dy : this.state.pan0.y,
//                dx : this.state.pan1.x,
//                dy : this.state.pan1.y,
//            }]),
//            onPanResponderRelease        : (e, gesture) => {
//                Animated.spring(
//                    this.state.pan0,
//                    this.state.pan1,
//                    {toValue:{x:0,y:0}}
//                ).start();
//            }
//        });
//



        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        AppState.addEventListener('change', this.handleAppStateChange);
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
    setDropZoneValues(layout) {
        this.setState({
          dropZoneValues: this.state.dropZoneValues.concat(layout),
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
    getColor() {
        let r = this.randomRGB()
        let g = this.randomRGB()
        let b = this.randomRGB()
        return 'rgb(' + r + ', ' + g + ', ' + b + ')'
    }
    randomRGB () {
        let c = Math.floor(Math.random()*100);
    console.log(c);
    return c + 40;//160 + c;
    }


  render() {
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
                    <View style={game_styles.tablet_container}>
                        <View style={game_styles.tablet}>



                        </View>
                    </View>
                    <View style={game_styles.game}>
                        <View>
                                <View style={game_styles.tile_row} >

        <Tile
            text='abc'
          dropZoneValues={this.state.dropZoneValues}
          setDropZoneValues={this.setDropZoneValues.bind(this)}
        />
        <Tile
            text='def'
          dropZoneValues={this.state.dropZoneValues}
          setDropZoneValues={this.setDropZoneValues.bind(this)}
        />
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity2}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag2}</Text>
                                      </Animated.View>
                                </View>
                                <View style={game_styles.tile_row} >
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity3}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag3}</Text>
                                      </Animated.View>
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity4}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag4}</Text>
                                      </Animated.View>
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity5}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag5}</Text>
                                      </Animated.View>
                                </View>
                                <View style={game_styles.tile_row} >
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity6}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag6}</Text>
                                      </Animated.View>
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity7}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag7}</Text>
                                      </Animated.View>
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity8}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag8}</Text>
                                      </Animated.View>
                                </View>
                        </View>

                            { this.state.five_rows &&
                            <View>
                                <View style={game_styles.tile_row} >
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity9}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag9}</Text>
                                      </Animated.View>
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity10}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag10}</Text>
                                      </Animated.View>
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity11}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag11}</Text>
                                      </Animated.View>
                                </View>
                                <View style={game_styles.tile_row} >
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity12}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag12}</Text>
                                      </Animated.View>
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity13}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag13}</Text>
                                      </Animated.View>
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity14}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag14}</Text>
                                      </Animated.View>
                                  </View>
                              </View>
                            }
                            { this.state.seven_rows &&
                            <View>
                                <View style={game_styles.tile_row} >
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity15}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag15}</Text>
                                      </Animated.View>
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity16}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag16}</Text>
                                      </Animated.View>
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity17}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag17}</Text>
                                      </Animated.View>
                                  </View>
                                <View style={game_styles.tile_row} >
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity18}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag18}</Text>
                                      </Animated.View>
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity19}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag19}</Text>
                                      </Animated.View>
                                      <Animated.View style={[game_styles.tile, {opacity: this.state.opacity20}]}>
                                        <Text style={styles.puzzle_text_large}>{this.state.frag20}</Text>
                                      </Animated.View>
                                </View>
                            </View>
                            }
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
    tablet_container: {
        flex: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        width: width,
    },
    tablet: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        width: width,
    },
    game: {
        flex: 9,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: width,
    },
    tile_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
  tile: {
    margin: 8,
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