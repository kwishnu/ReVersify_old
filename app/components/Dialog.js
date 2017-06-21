import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import configs from '../config/configs';
import {normalize, normalizeFont} from '../config/pixelRatio';
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
    handlePress4(e) {
        if (this.props.onPress) {
            this.props.onPress(4);
        }
    }
    render() {
        if(this.props.showFull){
            return (
                <View style={styles.overlay} onStartShouldSetResponder={ this.handlePress0.bind(this)} >
                    <View style= {[styles.container, {height: height/3.2}]}>
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
                        <TouchableOpacity
                            onPress={ this.handlePress4.bind(this) }
                            style={ styles.menuItem } >
                            <Text style={ styles.text }>{ this.props.item4 }</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }else{
            return (
                <View style={styles.overlay} onStartShouldSetResponder={ this.handlePress0.bind(this)} >
                    <View style= {[styles.container, {height: height/12}]}>
                        <TouchableOpacity
                            onPress={ this.handlePress4.bind(this) }
                            style={ styles.menuItem } >
                            <Text style={ styles.text }>{ this.props.item4 }</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }
}


const styles = StyleSheet.create({
    overlay:{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    outerContainer: {
        width: width,
        height: height,
        backgroundColor: 'transparent',
    },
    container: {
        width: height/3,
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
        width: height/3.5,
        backgroundColor: '#111',
    },
    text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.08),
        color: '#ffffff',
    },
});
export default DropdownMenu;