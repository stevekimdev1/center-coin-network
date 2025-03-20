import React, { Component } from 'react';
import { Text, StyleSheet, View, Platform } from 'react-native';

export default class BasicText extends Component {
  render() {
    const defaultStyle = Platform.select({
      ios: {
        // fontFamily: 'NanumSquareB',
        color: '#868686',
        letterSpacing: -0.05,
      },
      android: {
        includeFontPadding: false,
        // fontFamily: 'NanumSquareB',
        color: '#868686',
        letterSpacing: -0.05,
      },
    });
    const { children, style } = this.props;
    return (
      <Text
        allowFontScaling={false}
        {...this.props}
        style={[defaultStyle, style]}>
        {children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({});
