import React, { Component } from 'react';
import { Text, View, Button, TextInput, Image, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import CheckBox from 'react-native-check-box'

class BasicCheckBox extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <CheckBox
        uncheckedCheckBoxColor="#b7b7b7"
        checkedCheckBoxColor={color.mainColor}
        {...this.props}
      />
    );
  }
};
export default BasicCheckBox;
