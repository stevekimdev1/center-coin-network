import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Feather from 'react-native-vector-icons/Feather';
import ScalableImage from 'react-native-scalable-image';

import layout from '../../res/layout';
import Language from '../../lib/util/language';
import ToggleButton from '../button/ToggleButton';
import BasicText from '../text/BasicText';

export default class MyinfoTabChangePw extends Component {
  constructor(props) {
    super(props);
    string = Language.getString();
    this.state = {
      settingList: [
        {
          title: string.myinfoChangePassword,
          value: 'changePw',
        },
        {
          title: string.myinfoChangeSecurityPassword,
          value: 'securityChangePw',
        },
      ],
      isToggle: false,
      isTwoAuth: false,
    };
  }

  back = () => {
    Navigation.pop(this.props.componentId);
  };

  render() {
    return (
      <View
        style={[
          layout.container,
          {
            paddingHorizontal: 13.3,
            backgroundColor: '#f9fafb',
          },
        ]}>
        <View style={layout.nonBorderTopbar}>
          <TouchableOpacity
            onPress={() => {
              this.back();
            }}>
            <ScalableImage
              source={require('../../img/common/back.png')}
              width={15}
            />
          </TouchableOpacity>
          <Text style={layout.topbarTitleText}>{string.setting}</Text>
          <View />
        </View>
        {this.state.settingList.map((nav, index) => (
          <TouchableOpacity
            key={`nav${index}`}
            style={[
              styles.cell,
              styles.row,
              {
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}
            onPress={() => {
              // this.handleClickNavList(nav.value);
            }}>
            <BasicText>{nav.title}</BasicText>
            <Feather name="chevron-right" size={20} />
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cell: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: color.darkwhite,
  },
});
