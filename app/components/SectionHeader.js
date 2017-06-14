//section header for Contents:

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import configs from '../config/configs';
var {width, height} = require('Dimensions').get('window');

const styles = StyleSheet.create({
  container: {
    width: width,
    padding: height/90,
    paddingLeft: height/30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#222222',
    borderBottomWidth: 2,
    borderBottomColor: '#111111'
  },
  text: {
    fontSize: configs.LETTER_SIZE * 0.7,
    color: '#ffffff',
  },
});

const SectionHeader = (props) => (
  <View style={styles.container}>
    <Text style={styles.text}>{props.sectionTitle}</Text>
  </View>
);

export default SectionHeader;