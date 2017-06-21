import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import configs from '../config/configs';
import { normalizeFont }  from '../config/pixelRatio';
const { width, height } = require('Dimensions').get('window');

module.exports = StyleSheet.create({
    cell: {
        position: 'absolute',
        width: configs.CELL_WIDTH,
        height: configs.CELL_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    tile: {
        width: configs.TILE_WIDTH,
        height: configs.TILE_HEIGHT,
        borderRadius: configs.BORDER_RADIUS,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    verse_text_large: {
        color: '#000000',
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.11),
    },
    verse_text_white: {
        color: '#ffffff',
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.11),
    },
    answer_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.18),
        fontWeight: 'bold',
    },
    answer_column_text: {
        color: 'white',
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.08),
    },
    clue_text_bold: {
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.08),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    clue_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.07),
    },
    clue_text_small: {
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.06),
    },
    score_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.2),
        fontWeight: 'bold',
    },
    header_text: {
        color: '#9eacda',
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.1),
    },
    daily_launcher_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.07),
    },
    menu: {
        flex: 1,
        width: width,
        height: height,
        backgroundColor: 'blue',
        padding: 20,
    },
    copyright: {
        fontSize: 10,
        color: '#fff',
        marginBottom:10,
    },
});
