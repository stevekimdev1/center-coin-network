import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  CheckBox,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BasicText from '../text/BasicText';

class LoginButton extends Component {
  constructor(props) {
    super(props);
  }

  renderBasicButton = () => {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={{
          flex: 1,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          height: 51,
          ...this.props.style,
        }}>
        <Text
          {...this.props}
          style={{
            backgroundColor: 'transparent',
            color: this.props.color || color.white,
            fontSize: 17.3,
            letterSpacing: -0.77,
            includeFontPadding: false,
          }}>
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  };

  renderGradentButton = () => {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={{
          flex: 1,
          height: 51,
          ...this.props.style,
        }}>
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          colors={this.props.gradient}
          style={{
            height: '100%',
            width: '100%',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <BasicText
            {...this.props}
            style={{
              backgroundColor: 'transparent',
              color: this.props.color || color.white,
              fontSize: 17.3,
              letterSpacing: -0.77,
              includeFontPadding: false,
            }}>
            {this.props.title}
          </BasicText>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  render() {
    return this.props.gradient
      ? this.renderGradentButton()
      : this.renderBasicButton();
  }
}
export default LoginButton;
