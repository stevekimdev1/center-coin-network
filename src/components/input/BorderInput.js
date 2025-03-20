import React, {Component} from 'react';
import {Text, StyleSheet, View, TextInput} from 'react-native';
import color from '../../res/color';
import BasicText from '../text/BasicText';

export default class BorderInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      secureText: this.props.secureText,
    };
  }

  showHide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === 'input' ? 'password' : 'input',
    });
  }
  render() {
    const {addonBefore, addonAfter} = this.props;
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: this.props.borderColor || '#cccccc',
            borderWidth: 1,
            height: 53,
            backgroundColor: '#fff',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            paddingHorizontal: 15,

            paddingLeft: addonBefore ? 15 : 0,
            paddingRight: addonAfter ? 15 : 0,
            ...this.props.viewStyle,
          }}>
          {addonBefore && <View>{[addonBefore]}</View>}
          <TextInput
            {...this.props}
            autoCapitalize="none"
            placeholderTextColor="#b7b7b7"
            secureTextEntry={this.state.secureText}
            style={{
              flex: 1,
              height: 41,
              fontSize: 14,
              letterSpacing: !this.state.secureText ? -0.7 : 3,
              includeFontPadding: false,
              paddingLeft: 15,
              // fontFamily: !this.state.secureText ? 'NanumSquareEB' : '',
              ...this.props.style,
            }}
            onFocus={e => {
              this.setState({focused: true});
            }}
            onBlur={e => {
              this.setState({focused: false});
            }}
          />
          {addonAfter && <View>{[addonAfter]}</View>}
        </View>
        {this.props.error && (
          <View style={{paddingLeft: 5, paddingTop: 3}}>
            <BasicText
              style={{
                fontSize: 12.7,
                letterSpacing: -0.63,
                color: color.coral,
              }}>
              {this.props.error}
            </BasicText>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({});
