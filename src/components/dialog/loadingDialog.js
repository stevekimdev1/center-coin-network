import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import layout from '../../res/layout';
// import string from '../../res/string';
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
import color from '../../res/color';

var elements = [];
class LoadingDialog {
  constructor() {
    string = Language.getString();
  }

  show() {
    return new Promise((resolve, reject) => {
      let sibling = new RootSiblings(
        (
          <View style={styles.dialogContainer} activeOpacity={1}>
            {!global.loadingLogin && (
              <View style={styles.dialog}>
                <BallIndicator color={color.mainColor} />
              </View>
            )}
            <KeyboardSpacer />
          </View>
        ),
      );
      elements.push(sibling);
    });
  }
  dismiss() {
    let lastSibling = elements.pop();
    lastSibling && lastSibling.destroy();
  }
}

const deviceW = Dimensions.get('window').width;
const deviceH = Dimensions.get('window').height;
const styles = StyleSheet.create({
  dialog: {},
  dialogContainer: {
    width: deviceW,
    height: deviceH,
    position: 'absolute',
    backgroundColor: '#00000020',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingDialog;
