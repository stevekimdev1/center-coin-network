import React, { Component } from 'react';
import { View, TextInput, Image, Dimensions } from 'react-native';
import Coin from '../../lib/coin/coin';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class PwdInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      pwdText: this.props.pwdText
    };
  }

  render() {
    const { placeholder, secureText, type } = this.props;
    const { focused } = this.state;
    return (
      <View
        style={{
          // borderBottomColor: focused ? '#2d67ff' : '#c8c7c7',
          // borderBottomWidth: 1
        }}
      >
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center'
            // width: deviceWidth * 0.92 - 30
          }}
        >
          {focused ? (
            <Image
              source={require('../../img/regist/lock_color.png')}
              style={{
                width: 36 * 0.4,
                height: 48 * 0.4,
                marginTop: 15
              }}
            />
          ) : (
            <Image
              source={require('../../img/regist/lock.png')}
              style={{
                width: 36 * 0.4,
                height: 48 * 0.4,
                marginTop: 15
              }}
            />
          )}
        </View>
        <TextInput
          autoCapitalize="none"
          placeholder={placeholder}
          secureTextEntry={secureText}
          style={{
            paddingBottom: 5,
            borderColor: focused ? '#2d67ff' : '#c8c7c7',
            textAlign: 'center',
            borderBottomWidth: 1,
          }}
          onChangeText={text => {
            this.props.onChange(text, type);
          }}
          onFocus={() => {
            this.setState({ focused: true });
          }}
          onBlur={() => {
            this.setState({ focused: false });
          }}
        />
      </View>
    );
  }
}
export default PwdInput;
