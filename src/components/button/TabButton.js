import React, { Component } from 'react';
import { Text, View, Button, TextInput, CheckBox, Image, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import color from '../../res/color';

class TabButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        {this.props.on && (
        <View 
          style={{ borderRadius: 3, backgroundColor: color.mainColor, ...this.props.style }}>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                flex: 1,
                height: 41,
                backgroundColor: 'transparent',
                color: '#fff',
                fontSize: 14,
                lineHeight: 41,
                letterSpacing: -0.77,
                textAlign: 'center',
                textAlignVertical: 'center',
                // paddingTop: Platform.OS === "ios" ? 15 : 0,
                includeFontPadding: false,
                ...this.props.style,
              }}>
              {this.props.title}
            </Text>
          </View>
        </View>)}
        {!this.props.on && (
        <TouchableOpacity 
          style={{ borderRadius: 3, borderColor: color.mainColor, borderWidth: 1, backgroundColor: '#fff', ...this.props.style }}>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text {...this.props} 
              style={{
                flex: 1,
                height: 41,
                backgroundColor: 'transparent',
                color: color.mainColor,
                fontSize: 14,
                lineHeight: 41,
                letterSpacing: -0.77,
                textAlign: 'center',
                textAlignVertical: 'center',
                // paddingTop: Platform.OS === "ios" ? 15 : 0,
                includeFontPadding: false,
                ...this.props.style,
              }}>
              {this.props.title}
            </Text>
          </View>
        </TouchableOpacity>)}
      </View>
    );
  }
};
export default TabButton;
