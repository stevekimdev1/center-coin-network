import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Clipboard,
  ScrollView
} from 'react-native';
import Button from 'react-native-button';
import RootSiblings from 'react-native-root-siblings';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import layout from '../../res/layout';
// import string from '../../res/string';
import aes from 'browserify-cipher';
import crypto from 'crypto';
import Language from '../../lib/util/language';

import color from '../../res/color';

import { Navigation } from 'react-native-navigation';

class basicAlertDialog extends Component {
  constructor(props) {
    super(props)
    string = Language.getString();
  }

  close = () => {
    this.props.close();
    this.dismiss();
  }

  render() {
    // containerHeight = this.props.foundation == null ? deviceH * 0.2 : deviceH * 0.5;
    return (
      <View style={styles.dialogContainer}>
        <View style={styles.dialog}>
          {/* <View style={{ padding: 30, height: containerHeight }}> */}

          <View style={{ padding: 15 }}>
            <Text style={{ fontSize: 18, letterSpacing: -0.05, color: '#000' }}>
              {this.props.title}
            </Text>
            <View
              style={{
                width: 23,
                height: 2,
                backgroundColor: color.mainColor,
                marginTop: 20,
                marginBottom: 15
              }}
            ></View>
            <Text
              style={{
                fontSize: 14,
                letterSpacing: -0.05,
                color: '#686868',
                lineHeight: 19
              }}
            >
              {this.props.message}
            </Text>
          </View>

          {this.props.render != null && (
            <View style={{ marginVertical: 15 }}>
              {this.props.render()}
            </View>
          )}

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
                  this.props.ok();
                  this.dismiss();
                }}
              >
                <Text style={layout.buttonText}>
                  {this.props.okText == undefined ? string.ok : this.props.okText}
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
                  {this.props.cancelText == undefined ? string.cancel : this.props.cancelText}
                </Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </View>
    )
  }
  dismiss() {
    Navigation.dismissModal(this.props.componentId);
  }
}

const deviceW = Dimensions.get('window').width;
const deviceH = Dimensions.get('window').height;
const styles = StyleSheet.create({
  dialog: {
    position: 'absolute',
    top: deviceH * 0.3,
    left: deviceW * 0.04,
    width: deviceW * 0.92,
    backgroundColor: '#ffffffff',
    borderRadius: 5
  },
  dialogContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default basicAlertDialog;
