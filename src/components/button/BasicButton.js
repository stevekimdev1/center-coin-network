import React, { Component } from 'react';
import { Text, View, Button, TextInput, CheckBox, Image, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Platform } from 'react-native';

class BasicButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <TouchableOpacity 
          style={{ borderRadius: 3, backgroundColor: '#2d67ff', ...this.props.style }}>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text {...this.props} 
              style={{
                flex: 1,
                height: 41,
                backgroundColor: 'transparent',
                color: '#fff',
                fontSize: 15.3,
                letterSpacing: -0.77,
                textAlign: 'left',
                textAlignVertical: 'center',
                paddingTop: Platform.OS === "ios" ? 15 : 0,
                includeFontPadding: false,
                ...this.props.style,
              }}>
              {this.props.title}
            </Text>
          </View>
        </TouchableOpacity>
    );
  }
};
export default BasicButton;
