import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    PanResponder,
    Animated,
    Easing,
    Alert,
} from 'react-native';
import configs from '../config/configs';
import { normalize, normalizeFont }  from '../config/pixelRatio';
const styles = require('../styles/styles');
const {width, height} = require('Dimensions').get('window');
reverse = (s) => {
    return s.split("").reverse().join("");
}


class Tile extends Component {
  constructor(props) {
    super(props);
    this.flip = new Animated.Value(0);
    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1),
      text: this.props.text,
      zIndex: 0,
      opacity: 1,
      useSounds: this.props.sounds
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponder: (e, gesture) => setTimeout(() => {
        if (gesture.moveX == 0 && gesture.moveY == 0){
            this.flip.setValue(0);
            let str = reverse(this.state.text);
            this.setState({text: str});
            Animated.timing(this.flip,
                 {
                    toValue: 1,
                    duration: 300,
                  }
            ).start();
        }
      }, 400),
      onPanResponderGrant: (e, gestureState) => {
        this.setState({zIndex: 1});
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
        Animated.spring(
            this.state.scale,
            { toValue: 1.1, friction: 3 }
        ).start();
      },
      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),
      onPanResponderRelease: (e, gesture) => {
        this.setState({zIndex: 0});
        this.state.pan.flattenOffset();
        Animated.spring(
          this.state.scale,
          { toValue: 1, friction: 3 }
        ).start();
        let dropzone = this.inDropZone(gesture);
        if (dropzone && this.state.text == this.props.nextFrag) {
          this.props.onDrop(this.state.text);
            this.setState({opacity: 0});
//          Animated.spring(
//            this.state.scale,
//          { toValue: 0, friction: 5 }
//          ).start(() => {
//             Animated.timing(
//               this.state.pan,
//                   { toValue: {x: 500, y: -200},
//                   duration: 250}
//             ).start();
//            }
//          );
        } else if (dropzone && this.state.text !== this.props.nextFrag){
         Animated.spring(
           this.state.pan,
           {toValue:{x:0,y:0}}
         ).start();
        }
      },
    });
  }
    showNextTile(sent) {
        if (this.state.text == sent || reverse(this.state.text) == sent){
            this.setState({zIndex: 1});
            Animated.spring(
                this.state.scale,
                { toValue: 1.2, friction: 3, tension: 20 }
            ).start(()=>{

            Animated.spring(
                this.state.scale,
                { toValue: 1, friction: 3 }
            ).start()
        });
        }
    }
    inDropZone(gesture) {
        var isDropZone = false;
            if (gesture.moveY < height*.37 && gesture.moveY != 0) {
            isDropZone = true;
            }
        return isDropZone;
    }
//    setDropZoneValues(event) {
//        this.props.setDropZoneValues(event.nativeEvent.layout);
//        this.layout = event.nativeEvent.layout;
//    }

    render() {
        const rotateY = this.flip.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
        let { pan, scale } = this.state;
        let [translateX, translateY] = [pan.x, pan.y];
        let imageStyle = {transform: [{translateX}, {translateY}, {rotateY}, {scale}]};
        return (
            <View onStartShouldSetResponder={() => {console.log('uhh');}}>
                <Animated.View
                  style={[imageStyle, tile_styles.draggable, {zIndex: this.state.zIndex, opacity: this.state.opacity}]}
                  {...this._panResponder.panHandlers}>
                    <Text style={tile_styles.text}>{this.state.text}</Text>
                </Animated.View>
            </View>
        );
    }
}

const tile_styles = StyleSheet.create({
  draggable: {
    marginLeft: 3,
    marginRight: 3,
    marginBottom: 2,
    height: height/20,
    width: height/6,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000'
  },
  text: {
    fontSize: normalizeFont(configs.LETTER_SIZE*0.1),
    color: '#000000'
  }
});

export default Tile;