import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import configs from '../config/configs';
var {width, height} = require('Dimensions').get('window');


class DropdownMenu extends Component {
    handlePress0(e) {
        if (this.props.onPress) {
            this.props.onPress(0);
        }
    }
    handlePress1(e) {
        if (this.props.onPress) {
            this.props.onPress(1);
        }
    }
    handlePress2(e) {
        if (this.props.onPress) {
            this.props.onPress(2);
        }
    }
    handlePress3(e) {
        if (this.props.onPress) {
            this.props.onPress(3);
        }
    }
    render() {
        return (
        <View style={styles.overlay} onStartShouldSetResponder={ this.handlePress0.bind(this)} >
            <View style= {styles.container}>
                <TouchableOpacity
                    onPress={ this.handlePress1.bind(this) }
                    style={ styles.menuItem } >
                    <Text style={ styles.text }>{ this.props.item1 }</Text>
                </TouchableOpacity>
                <View style={styles.divider}>
                </View>
                <TouchableOpacity
                    onPress={ this.handlePress2.bind(this) }
                    style={ styles.menuItem } >
                    <Text style={ styles.text }>{ this.props.item2 }</Text>
                </TouchableOpacity>
                <View style={styles.divider}>
                </View>
                <TouchableOpacity
                    onPress={ this.handlePress3.bind(this) }
                    style={ styles.menuItem } >
                    <Text style={ styles.text }>{ this.props.item3 }</Text>
                </TouchableOpacity>
            </View>
        </View>
        );
    }
}


const styles = StyleSheet.create({
    overlay:{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    outerContainer: {
        width: width,
        height: height,
        backgroundColor: 'transparent'
    },
    container: {
        flex: 1,
        position: 'absolute',
        right: 20,
        top: 10,
        width: height/5,
        height: configs.LETTER_SIZE * 5,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333333',
        borderWidth: 1,
        borderColor: '#060606'
    },
    menuItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',


    },
    divider: {
        height: StyleSheet.hairlineWidth,
        width: height/4,
        backgroundColor: '#111',
    },
    text: {
        fontSize: configs.LETTER_SIZE * 0.55,
        color: '#ffffff',
    },
});
export default DropdownMenu;