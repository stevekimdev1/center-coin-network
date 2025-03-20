import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import Button from 'react-native-button';
import RootSiblings from 'react-native-root-siblings';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import layout from '../../res/layout';
// import string from '../../res/string';
import aes from 'browserify-cipher';
import crypto from 'crypto';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
import Language from '../../lib/util/language';

var elements = [];
class LoginDialog {
  constructor() {
    string = Language.getString();
  }
  show(callback) {
    global.loadingLogin = true;
    return new Promise((resolve, reject) => {
      let sibling = new RootSiblings(
        <View style={styles.dialogContainer} >
          <View style={styles.dialog}>
            <View style={{ padding: 15 }}>
              <Text style={{ fontSize: 18, letterSpacing: -0.05, color: '#000' }}>
                {string.myinfoLogin}
              </Text>
              <View style={{ width: 23, height: 2, backgroundColor: '#2d67ff', marginTop: 20, marginBottom: 15 }}></View>
              <Text style={{ fontSize: 14, letterSpacing: -0.05, color: '#686868', lineHeight: 19 }}>
                {string.myinfoLoginDetail}
              </Text>
              <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 30 }}>
                <BarIndicator color='#2d67ff' />
              </View>
            </View>
          </View>
        </View>
      );
      elements.push(sibling);
    });
  }
  dismiss() {
    global.loadingLogin = false;
    let lastSibling = elements.pop();
    lastSibling && lastSibling.destroy();
  };
}

const deviceW = Dimensions.get('window').width
const deviceH = Dimensions.get('window').height
const styles = StyleSheet.create({
  dialog: {
    width: deviceW * 0.92,
    backgroundColor: '#ffffffff',
    borderRadius: 5,
  },
  dialogContainer: {
    width: deviceW,
    height: deviceH,
    position: 'absolute',
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: "center"
  },
});

export default LoginDialog;