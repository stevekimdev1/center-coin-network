import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import color from '../../res/color';

class BasicInput extends Component {
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

  renderInput() {
    return (
      <View>
        {this.props.title && (
          <Text style={{ color: this.props.titleColor || color.black }}>
            {this.props.title}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: color.gray
          }}
        >
          <TextInput
            autoCapitalize="none"
            {...this.props}
            placeholderTextColor={this.props.placeholderTextColor || '#b7b7b7'}
            secureTextEntry={this.state.secureText}
            style={{
              flex: 1,
              height: 41,
              fontSize: 14,
              letterSpacing: -0.7,
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
          >
            <TouchableOpacity
              style={{
                // height: 41,
                marginLeft: 5,
                marginBottom: 10,
                paddingVertical: 5,
                paddingHorizontal: 20,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: color.mainColor,
                backgroundColor: color.white
              }}
              onPress={this.props.onPress}
            >
              <Text style={{ color: color.mainColor }}>{this.props.button}</Text>
            </TouchableOpacity>
          </View>
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

  renderBasicInput() {
    return (
      <View>
        {this.props.title && (
          <Text style={{ color: this.props.titleColor || color.black }}>
            {this.props.title}
          </Text>
        )}
        <View style={{ flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: color.gray }}>
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
              fontSize: 14,
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

  render() {
    return this.props.button ? this.renderInput() : this.renderBasicInput();
  }
}
export default BasicInput;
