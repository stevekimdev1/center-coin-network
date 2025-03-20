import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import color from '../../res/color';

class LargeInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      secureText: this.props.secureText
    };
  }

  showHide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === 'input' ? 'password' : 'input'
    });
  }

  render() {
    return (
      <View>
        {this.props.title && (
          <Text style={{ color: this.props.titleColor || color.black }}>
            {this.props.title}
          </Text>
        )}
        <View style={{ flexDirection: 'row' }}>
          {this.props.topTitle && (
            <View style={{ flex: 0, justifyContent: 'center', marginHorizontal: 10 ,marginLeft:20, marginRight:15 }}>
              <Text style={{ color: this.props.titleColor || color.black }}>
                {this.props.topTitle}
              </Text>
            </View>
          )}
          <TextInput
            autoCapitalize="none"
            {...this.props}
            placeholderTextColor={this.props.placeholderTextColor || '#b7b7b7'}
            secureTextEntry={this.state.secureText}
            style={{
              flex: 3,
              height: 55,
              fontSize: 17.3,
              letterSpacing: -0.7,
              borderBottomWidth: 0, //1에서 0으로 수정 
              borderBottomColor: color.gray,
              backgroundColor: '#fff',
              includeFontPadding: false,
              ...this.props.style
            }}
            onFocus={e => {
              this.setState({ focused: true });
            }}
            onBlur={e => {
              this.setState({ focused: false });
            }}
          />
        </View>
        {this.props.error && (
          <View style={{ paddingLeft: 5, paddingTop: 3 }}>
            <Text
              style={{
                fontSize: 12.7,
                letterSpacing: -0.63,
                color: color.coral
              }}
            >
              {this.props.error}
            </Text>
          </View>
        )}
      </View>
    );
  }
}
export default LargeInput;
