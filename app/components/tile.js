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
function reverse(s){
    return s.split("").reverse().join("");
}
class Tile extends Component {
  constructor(props) {
    super(props);
    this.flip = new Animated.Value(0);
    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1),
      text: this.props.text
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponder: () => setTimeout(() => {
        if (this.state.pan.y._value == 0){
            console.log('tap');
            this.flip.setValue(0);
            let str = reverse(this.state.text);
            this.setState({text: str});
            Animated.timing(this.flip,
                 {
                    toValue: 1,
                    duration: 300,
                  }
            ).start();
        }else{
            console.log('move');
        }
      }, 200),

      onPanResponderGrant: (e, gestureState) => {

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
        this.state.pan.flattenOffset();
        Animated.spring(
          this.state.scale,
          { toValue: 1, friction: 3 }
        ).start();

        let dropzone = this.inDropZone(gesture);

        if (dropzone) {
          console.log('In drop zone');
          Animated.spring(
            this.state.pan,
            {toValue:{
              x: gesture.x0,
              y: -1000,
            }}
          ).start();
        } else {
         Animated.spring(
           this.state.pan,
           {toValue:{x:0,y:0}}
         ).start();
        }
      },
    });
  }

  inDropZone(gesture) {
  console.log(gesture);
    var isDropZone = false;
      if (gesture.moveY < 200 && gesture.moveY != 0) {
        isDropZone = true;
      }
    return isDropZone;
  }

  setDropZoneValues(event) {
    this.props.setDropZoneValues(event.nativeEvent.layout);
    this.layout = event.nativeEvent.layout;
  }

  render() {
  const rotateY = this.flip.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })
   let { pan, scale } = this.state;
   let [translateX, translateY] = [pan.x, pan.y];
   let rotate = '0deg';
   let imageStyle = {transform: [{translateX}, {translateY}, {rotateY}, {scale}]};
    return (
        <Animated.View
          style={[imageStyle, tile_styles.draggable]}
          {...this._panResponder.panHandlers}>
            <Text>{this.state.text}</Text>
        </Animated.View>
    );
  }
}

const tile_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropzone: {
    zIndex: 0,
    margin: 5,
    width: 106,
    height: 106,
    borderColor: 'green',
    borderWidth: 3
  },
  draggable: {
    margin: 8,
    height: height/20,
    width: height/6,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#000000'
  },
  image: {
    width: 75,
    height: 75
  }
});

export default Tile;