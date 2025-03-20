import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import layout from '../../res/layout';
// import string from '../../res/string';
import Language from '../../lib/util/language';

class secPasswordDialog extends Component {
  constructor(props) {
    super(props);
    string = Language.getString();
  }
  
  close = () => {
    this.props.close();
    this.dismiss();
  }

  render() {
    // containerHeight = this.props.foundation == null ? deviceH * 0.2 : deviceH * 0.5;
    return(
      <TouchableWithoutFeedback diabled={true} onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.dialogContainer}>
        <View style={styles.dialog}>
          {/* <View style={{ padding: 30, height: containerHeight }}> */}
          
          <View style={{ padding: 15 }}>
            <Text style={{ fontSize: 18, letterSpacing: -0.05, color: '#000' }}>
              {this.props.title}
            </Text>
            <View style={{ width: 23, height: 2, backgroundColor: '#2d67ff', marginTop: 20, marginBottom: 15 }}/>
            <Text style={{ fontSize: 14, letterSpacing: -0.05, color: '#686868', lineHeight: 19 }}>
              {this.props.message}
            </Text>
            <BasicInput
              icon="lock"
              resetable={true}
              placeholder={string.inputSecPassword}
              secureText={true}
              keyboardType={'numeric'}
              onChangeText={text => {
                this.setState({ secPassword: text.trim() });
              }}
              value={this.state.secPassword}
            />
          </View>
          <View style={{ height: 1, backgroundColor: '#dadada' }}></View>
          
          {this.props.ok == undefined ? (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={{ padding: 17, flex: 1, justifyContent: 'center' }}
                onPress={() => { this.props.close == undefined ? this.dismiss() : (this.close()) }}>
                <Text style={layout.buttonText}>
                  {string.close}
                </Text>
              </TouchableOpacity>
            </View>

          ) : (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={{ padding: 17, flex: 1, justifyContent: 'center' }}
                onPress={() => {
                  this.props.ok(this.state.secPassword);
                  this.dismiss();
                }}
              >
                <Text style={layout.buttonText}>
                  {string.ok}
                </Text>
              </TouchableOpacity>
              <View style={{ width: 1, backgroundColor: '#dadada' }} />
              <TouchableOpacity
                style={{ padding: 17, flex: 1, justifyContent: 'center' }}
                onPress={() => {
                  this.dismiss();
                }}
              >
                <Text style={layout.buttonText}>
                  {string.cancel}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
        </View>
      </View>
      </TouchableWithoutFeedback>
    )
  }
  dismiss() {
    Navigation.dismissModal(this.props.componentId);
  }
}

export default secPasswordDialog;