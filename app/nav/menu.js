import React, { Component } from 'react';
import { ListView, StyleSheet, Text, View, TouchableHighlight, Image } from 'react-native';
import MenuSectionHeader  from '../components/MenuSectionHeader';
import configs from '../config/configs';
import { normalize, normalizeFont }  from '../config/pixelRatio';
const {width, height} = require('Dimensions').get('window');
const styles = require('../styles/styles');

module.exports = class Menu extends Component {
    constructor(props) {
        super(props);
        const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
        const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];
        const ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
          getSectionData,
          getRowData,
        });
        const { dataBlob, sectionIds, rowIds } = this.formatData(this.props.data);
        this.state = {
            dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
        };
    }
    formatData(data) {
        const headings = 'reVersify*Verses & Hints*Social Media*About reVersify'.split('*');
        const keys = 'home*donate*social*about'.split('*');
        const dataBlob = {};
        const sectionIds = [];
        const rowIds = [];
        for (let sectionId = 0; sectionId < headings.length; sectionId++) {
            const currentHead = headings[sectionId];
            const currentKey = keys[sectionId];
            const packs = data.filter((theData) => theData.type == currentKey);
            if (packs.length > 0) {
                sectionIds.push(sectionId);
                dataBlob[sectionId] = { sectionTitle: currentHead };
                rowIds.push([]);
                for (let i = 0; i < packs.length; i++) {
                    const rowId = `${sectionId}:${i}`;
                    rowIds[rowIds.length - 1].push(rowId);
                    dataBlob[rowId] = packs[i];
                }
            }
        }
        return { dataBlob, sectionIds, rowIds };
    }
    static propTypes = {
        onItemSelected: React.PropTypes.func.isRequired,
    }

    render() {
        return (<View style=  {menu_styles.container} >
                     <ListView  showsVerticalScrollIndicator ={false}
                                contentContainerStyle={ menu_styles.listview }
                                dataSource={this.state.dataSource}
                                renderRow={(rowData) =>
                                    <View>
                                        <TouchableHighlight onPress={() => this.props.onItemSelected(rowData)}
                                                            underlayColor={'#222222'}
                                                            style={[menu_styles.launcher]}>
                                            <Text style={ menu_styles.launcher_text }>{rowData.title}</Text>
                                        </TouchableHighlight>
                                    </View>
                                }
                                renderSeparator={(sectionId, rowId) => <View key={rowId} style={menu_styles.separator} />}
                                renderSectionHeader={(sectionData) => <MenuSectionHeader {...sectionData}
                                 />}
                     />
                </View>
                );
    }
}

const menu_styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height,
        backgroundColor: '#2B0B30',
    },
    listview: {
        paddingBottom: 50
    },
    launcher: {
        flex: 1,
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: height/30,
        paddingVertical: height/70,
        backgroundColor: '#333333',
    },
    launcher_text: {
        color: '#ffffff',
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.08),
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#707070',
    }

});
