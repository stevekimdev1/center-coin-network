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
import { TextField } from 'react-native-material-textfield';
import Language from '../../lib/util/language';

class EmailDialog {
  constructor() {
    string = Language.getString();
    this.state = {
      focused: false
    };
  }

  show(callback) {
    const { focused } = this.state;
    return new Promise((resolve, reject) => {
      let sibling = new RootSiblings(
        (
          <TouchableOpacity
            style={styles.dialogContainer}
            onPress={() => this.dismiss()}
            activeOpacity={1}
          >
            <TouchableWithoutFeedback diabled={true}>
              <View style={styles.dialog}>
                <View style={{ padding: 30 }}>
                  <Text style={layout.titleText}>{string.email}</Text>
                  <View style={{ height: 20 }} />
                  {/* <View
                    style={{
                      width: 23,
                      height: 2,
                      backgroundColor: '#2d67ff',
                      marginTop: 20,
                      marginBottom: 15
                    }}
                  /> */}
                  <Text
                    style={[
                      layout.contentText,
                      {
                        fontSize: 14
                      }
                    ]}
                  >
                    {string.inputEmailDetail}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: 30
                    }}
                  >
                    <Image source={require('../../img/common/email.png')} />
                    <View
                      style={{
                        justifyContent: 'center',
                        flex: 1,
                        marginLeft: 16,
                        marginRight: 5
                      }}
                    >
                      <TextField
                        label={string.inputEmail}
                        labelHeight={0}
                        maxLength={64}
                        activeLineWidth={1}
                        animationDuration={0}
                        baseColor="#c8c7c7"
                        tintColor="#2d67ff"
                        keyboardType="email-address"
                        onChangeText={text => {
                          this.email = text;
                        }}
                        style={{}}
                        autoCapitalize="none"
                      />
                    </View>
                  </View>
                </View>
                <View style={{ height: 1, backgroundColor: '#dadada' }}></View>

                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={{ padding: 17, flex: 1, justifyContent: 'center' }}
                    onPress={() => {
                      resolve(this.email);
                      this.dismiss();
                    }}
                  >
                    <Text
                      style={[
                        layout.buttonText,
                        {
                          color: '#2d67ff'
                        }
                      ]}
                    >
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
                    <Text style={layout.buttonText}>{string.close}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <KeyboardSpacer />
          </TouchableOpacity>
        )
      );
      global.dlg.push(sibling);
    });
  }
  dismiss() {
    if (global.dlg.length > 0) {
      let lastSibling = global.dlg.pop();
      lastSibling && lastSibling.destroy();
    }
  }
}

const deviceW = Dimensions.get('window').width;
const deviceH = Dimensions.get('window').height;
const styles = StyleSheet.create({
  dialog: {
    width: deviceW * 0.92,
    backgroundColor: '#ffffffff',
    borderRadius: 5
  },
  dialogContainer: {
    width: deviceW,
    height: deviceH,
    position: 'absolute',
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default EmailDialog;
